import os
from pymongo import MongoClient, ASCENDING
from dotenv import load_dotenv

load_dotenv()

_client = None
_db = None

def get_db():
    global _client, _db

    if _db is not None:
        return _db

    mongo_uri = os.getenv("MONGODB_URI")
    db_name = os.getenv("MONGODB_DB", "finlingo")

    if not mongo_uri:
        raise RuntimeError("MONGODB_URI is missing in backend/.env")

    _client = MongoClient(mongo_uri)
    _db = _client[db_name]

    # ensure unique constraints (db-level guarantees)
    _db.children.create_index([("username", ASCENDING)], unique=True)
    _db.children.create_index([("childId", ASCENDING)], unique=True)

    _db.parents.create_index([("username", ASCENDING)], unique=True)
    _db.parents.create_index([("childId", ASCENDING)], unique=False)

    return _db

def children_col():
    return get_db().children

def parents_col():
    return get_db().parents
