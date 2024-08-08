from enum import Enum
from app.extensions import db


class DifficultyEnum(Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class Problem(db.Model):
    __tablename__ = "problems"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    difficulty = db.Column(db.Enum(DifficultyEnum), nullable=False)
    problem_description = db.Column(db.Text, nullable=False)
    problem_link = db.Column(db.Text, nullable=True)
    tests_id = db.Column(db.String(255), nullable=True)
    tags = db.Column(db.ARRAY(db.String), nullable=False)
