from flask import Blueprint, request, jsonify
from services.user_service import create_child_account, create_parent_account, login

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.post("/child/signup")
def child_signup():
    data = request.get_json(force=True)
    try:
        user = create_child_account(
            name=data.get("name", ""),
            username=data.get("username", ""),
            password=data.get("password", ""),
        )
        return jsonify({"ok": True, "user": user}), 201
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 400

@auth_bp.post("/parent/signup")
def parent_signup():
    data = request.get_json(force=True)
    try:
        user = create_parent_account(
            name=data.get("name", ""),
            username=data.get("username", ""),
            password=data.get("password", ""),
            child_id=data.get("childId", "").strip() if data.get("childId") else None,
        )
        return jsonify({"ok": True, "user": user}), 201
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 400

@auth_bp.post("/login")
def do_login():
    data = request.get_json(force=True)
    try:
        result = login(
            username=data.get("username", ""),
            password=data.get("password", ""),
        )
        return jsonify({"ok": True, **result}), 200
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 400
