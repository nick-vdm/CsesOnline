from flask import Blueprint, jsonify, url_for
from flask_hal import document, link
from app.models.submissions import Submission
from app.extensions import db
import logging

bp = Blueprint("submission_routes", __name__)
log = logging.getLogger("app")


@bp.route("/submissions", methods=["GET"])
def get_submissions():
    submissions = Submission.query.all()
    submission_collection = [
        document.Document(
            data={
                "id": submission.id,
                "program_lang": submission.program_lang,
                "linked_user": submission.linked_user,
                "problem_id": submission.problem_id,
                "status": submission.status,
                "result": submission.result,
                "result_time_ms": submission.result_time_ms,
                "result_memory_kb": submission.result_memory_kb,
            },
            links=link.Collection(
                link.Link("collection", href=url_for("submission_routes.get_submissions")),
            ),
        ).to_dict()
        for submission in submissions
    ]

    response = document.Document(
        data={"submissions": submission_collection},
        links=link.Collection(),
    )
    return jsonify(response.to_dict())


@bp.route("/submissions/<int:submission_id>", methods=["GET"])
def get_submission(submission_id):
    submission = db.session.get(Submission, submission_id)

    if not submission:
        return jsonify({"error": f"Submission {submission_id} not found"}), 404

    response = document.Document(
        data={
            "id": submission.id,
            "program_lang": submission.program_lang,
            "linked_user": submission.linked_user,
            "problem_id": submission.problem_id,
            "status": submission.status,
            "result": submission.result,
            "result_time_ms": submission.result_time_ms,
            "result_memory_kb": submission.result_memory_kb,
        },
        links=link.Collection(
            link.Link("collection", href=url_for("submission_routes.get_submissions")),
        ),
    )

    return jsonify(response.to_dict())
