from code.extensions import db
from .abstract_base_model import BaseModel


class Submission(BaseModel):
    __tablename__ = "submissions"
    program_lang = db.Column(db.String(50), nullable=False)
    code = db.Column(db.Text, nullable=False)
    linked_user = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    problem_id = db.Column(db.Integer, db.ForeignKey("problems.id"), nullable=False)
    status = db.Column(db.String(50), nullable=False, default="PENDING")
    result = db.Column(db.Text, nullable=True)
    result_time_ms = db.Column(db.Integer, nullable=True)
    result_memory_kb = db.Column(db.Integer, nullable=True)
    output_text = db.Column(db.Text, nullable=True)
    error_text = db.Column(db.Text, nullable=True)
