import os
from flask import Blueprint, request, jsonify
import jwt
from datetime import datetime, timedelta, timezone

from services.user_service import (
    create_child_account,
    create_parent_account,
    login as login_user,
)

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

def _now():
    return datetime.now(timezone.utc)

def _make_token(payload: dict) -> str:
    secret = os.getenv("JWT_SECRET", "dev_secret_change_me")
    exp = _now() + timedelta(days=7)
    token_payload = {**payload, "exp": exp}
    return jwt.encode(token_payload, secret, algorithm="HS256")

@auth_bp.post("/child/signup")
def child_signup():
    data = request.get_json(force=True) or {}
    try:
        out = create_child_account(
            name=data.get("name"),
            username=data.get("username"),
            password=data.get("password"),
        )
        return jsonify({"ok": True, "user": out}), 201
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 400

@auth_bp.post("/parent/signup")
def parent_signup():
    data = request.get_json(force=True) or {}
    try:
        out = create_parent_account(
            name=data.get("name"),
            username=data.get("username"),
            password=data.get("password"),
            child_id=data.get("childId"),
        )
        return jsonify({"ok": True, "user": out}), 201
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 400

@auth_bp.post("/login")
def login():
    data = request.get_json(force=True) or {}
    try:
        user = login_user(username=data.get("username"), password=data.get("password"))
        token = _make_token({"role": user["role"], "username": user["username"]})
        return jsonify({"ok": True, "user": user, "token": token}), 200
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 400
