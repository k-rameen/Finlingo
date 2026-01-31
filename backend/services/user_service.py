import os
import re
import secrets
import bcrypt
import jwt
from services.db import get_conn

JWT_SECRET = os.getenv("JWT_SECRET", "dev_secret_change_later")

def _hash_password(password: str) -> str:
    pw = password.encode("utf-8")
    hashed = bcrypt.hashpw(pw, bcrypt.gensalt())
    return hashed.decode("utf-8")

def _check_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))

def _make_token(user_id: int, role: str, username: str) -> str:
    payload = {"uid": user_id, "role": role, "username": username}
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def _normalize_username(username: str) -> str:
    username = (username or "").strip()
    # keep it simple: letters/numbers/_/.
    if not re.match(r"^[a-zA-Z0-9_.]{3,32}$", username):
        raise ValueError("username must be 3-32 chars and only letters, numbers, _ or .")
    return username.lower()

def _generate_child_id():
    # short, readable, still high uniqueness
    # example: CH-9F2K7Q3B
    return "CH-" + secrets.token_hex(4).upper()

def create_child_account(name: str, username: str, password: str):
    username = _normalize_username(username)
    if not password or len(password) < 6:
        raise ValueError("password must be at least 6 characters")

    conn = get_conn()
    cur = conn.cursor()

    # username unique (enforced by UNIQUE constraint)
    password_hash = _hash_password(password)

    # create user first
    try:
        cur.execute(
            "INSERT INTO users (role, name, username, password_hash) VALUES (?, ?, ?, ?)",
            ("child", name, username, password_hash),
        )
        user_id = cur.lastrowid
    except Exception as e:
        conn.rollback()
        conn.close()
        # common case: username already taken
        raise ValueError("username already exists") from e

    # create unique child_id with retry in the extremely rare collision case
    child_id = None
    for _ in range(10):
        candidate = _generate_child_id()
        try:
            cur.execute(
                "INSERT INTO child_profiles (user_id, child_id) VALUES (?, ?)",
                (user_id, candidate),
            )
            child_id = candidate
            break
        except Exception:
            # collision on UNIQUE child_id, retry
            continue

    if not child_id:
        conn.rollback()
        conn.close()
        raise RuntimeError("failed to generate unique child id")

    conn.commit()
    conn.close()

    return {
        "id": user_id,
        "role": "child",
        "name": name,
        "username": username,
        "childId": child_id,
    }

def create_parent_account(name: str, username: str, password: str, child_id: str = None):
    username = _normalize_username(username)
    if not password or len(password) < 6:
        raise ValueError("password must be at least 6 characters")

    conn = get_conn()
    cur = conn.cursor()

    password_hash = _hash_password(password)

    # create parent user
    try:
        cur.execute(
            "INSERT INTO users (role, name, username, password_hash) VALUES (?, ?, ?, ?)",
            ("parent", name, username, password_hash),
        )
        parent_user_id = cur.lastrowid
        cur.execute("INSERT INTO parent_profiles (user_id) VALUES (?)", (parent_user_id,))
    except Exception as e:
        conn.rollback()
        conn.close()
        raise ValueError("username already exists") from e

    # optional linking
    linked_child_user_id = None
    if child_id:
        child_id = child_id.strip()
        row = cur.execute(
            "SELECT user_id FROM child_profiles WHERE child_id = ?",
            (child_id,),
        ).fetchone()

        if not row:
            conn.rollback()
            conn.close()
            raise ValueError("invalid child id")

        linked_child_user_id = int(row["user_id"])

        # link parent -> child
        cur.execute(
            "INSERT OR IGNORE INTO parent_child_links (parent_user_id, child_user_id) VALUES (?, ?)",
            (parent_user_id, linked_child_user_id),
        )

    conn.commit()
    conn.close()

    return {
        "id": parent_user_id,
        "role": "parent",
        "name": name,
        "username": username,
        "linkedChildUserId": linked_child_user_id,
    }

def login(username: str, password: str):
    username = _normalize_username(username)

    conn = get_conn()
    cur = conn.cursor()

    user = cur.execute(
        "SELECT id, role, name, username, password_hash FROM users WHERE username = ?",
        (username,),
    ).fetchone()

    if not user:
        conn.close()
        raise ValueError("invalid username or password")

    if not _check_password(password, user["password_hash"]):
        conn.close()
        raise ValueError("invalid username or password")

    user_id = int(user["id"])
    role = user["role"]

    child_id = None
    if role == "child":
        row = cur.execute(
            "SELECT child_id FROM child_profiles WHERE user_id = ?",
            (user_id,),
        ).fetchone()
        if row:
            child_id = row["child_id"]

    token = _make_token(user_id, role, user["username"])

    conn.close()

    return {
        "token": token,
        "user": {
            "id": user_id,
            "role": role,
            "name": user["name"],
            "username": user["username"],
            "childId": child_id,
        },
    }
