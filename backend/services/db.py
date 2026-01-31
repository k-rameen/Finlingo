import os
import sqlite3

def get_db_path():
    return os.getenv("DB_PATH", "finlingo.db")

def get_conn():
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    conn = get_conn()
    cur = conn.cursor()

    # users: both parent and child live here
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL CHECK(role IN ('child', 'parent')),
        name TEXT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # child profile: stores the unique childId
    cur.execute("""
    CREATE TABLE IF NOT EXISTS child_profiles (
        user_id INTEGER PRIMARY KEY,
        child_id TEXT NOT NULL UNIQUE,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # parent profile: optional table (room for extra parent fields later)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS parent_profiles (
        user_id INTEGER PRIMARY KEY,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # link table: allows 1 parent -> many kids, or many parents -> 1 kid later
    cur.execute("""
    CREATE TABLE IF NOT EXISTS parent_child_links (
        parent_user_id INTEGER NOT NULL,
        child_user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(parent_user_id, child_user_id),
        FOREIGN KEY(parent_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(child_user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    conn.commit()
    conn.close()
