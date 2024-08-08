from app.extensions import db
from .abstract_base_model import BaseModel


class User(BaseModel):
    __tablename__ = "users"
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
