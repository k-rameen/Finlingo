import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from services.db import init_db
from routes.auth import auth_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    # create tables on boot (simple hackathon style)
    init_db()

    app.register_blueprint(auth_bp)

    @app.get("/health")
    def health():
        return jsonify({"ok": True})

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", "5050"))
    app.run(host="0.0.0.0", port=port, debug=True)
