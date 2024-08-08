from app.extensions import db


class BaseModel(db.Model):
    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True)
    version = db.Column(db.Integer, default=1, nullable=False)
    created = db.Column(db.DateTime, default=db.func.current_timestamp(), nullable=False)
    lastupdated = db.Column(
        db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp(), nullable=False
    )
