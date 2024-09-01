import logging

from flask import Blueprint, jsonify, url_for, request
from flask_hal import document, link

from code.extensions import db
from code.models.submissions import Submission
from code.utils.auth import token_required

bp = Blueprint("submission_routes", __name__)
log = logging.getLogger("code")


@bp.route("/api/submissions", methods=["GET"])
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


@bp.route("/api/submissions/<int:submission_id>", methods=["GET"])
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


@bp.route("/api/create_submission", methods=["POST"])
@token_required
def create_submission(current_user):
    data = request.get_json()

    program_lang = data.get("program_lang")
    code = data.get("code")
    problem_id = data.get("problem_id")

    if not program_lang or not code or not problem_id:
        return jsonify({"message": "Missing required fields"}), 400

    new_submission = Submission(
        program_lang=program_lang,
        code=code,
        linked_user=current_user.id,
        problem_id=problem_id,
        status=data.get("status", "PENDING"),
        result=data.get("result"),
        result_time_ms=data.get("result_time_ms"),
        result_memory_kb=data.get("result_memory_kb"),
        output_text=data.get("output_text"),
        error_text=data.get("error_text"),
    )

    db.session.add(new_submission)
    db.session.commit()

    return jsonify({"message": "Submission created successfully!"}), 201
