from app.extensions import db
from .abstract_base_model import BaseModel
from sqlalchemy.dialects.postgresql import ARRAY


class DifficultyEnum(db.Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class Problem(BaseModel):
    __tablename__ = "problems"
    title = db.Column(db.String(255), nullable=False)
    difficulty = db.Column(db.Enum(DifficultyEnum), nullable=False)
    markdown_text = db.Column(db.Text, nullable=False)
    tags = db.Column(ARRAY(db.Text), nullable=False)
