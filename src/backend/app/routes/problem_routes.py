from flask import Blueprint, request, jsonify, url_for
from app.models import Problem
from app.extensions import db
import json
from flask_hal import document, link, HAL
from app.utils.document_2_dict import document_to_dict
import logging

bp = Blueprint("problem_routes", __name__)
log = logging.getLogger("app")
HAL(bp)


@bp.route("/problems", methods=["GET"])
def get_problems():
    log.info("querying")
    problems = Problem.query.all()
    log.info("building collection %s", len(problems))
    problems_collection = [
        document_to_dict(
            document.Document(
                data={
                    "id": problem.id,
                    "title": problem.title,
                    "difficulty": problem.difficulty,
                    "tags": problem.tags,
                },
                links=link.Collection(
                    link.Link("collection", href=url_for("problem_routes.get_problems")),
                ),
            )
        )
        for problem in problems
    ]

    log.info("problems collection %s", problems_collection)
    response = document.Document(data={"problems": problems_collection}, links=link.Collection())
    log.info("sending back %s", response.to_json())
    return jsonify(document_to_dict(response))


@bp.route("/problems/<int:problem_id>", methods=["GET"])
def get_problem(problem_id):
    problem = db.session.get(Problem, problem_id)

    if not problem:
        return jsonify({"error": f"Problem {problem_id} not found"}), 404

    response = document.Document(
        data={
            "id": problem.id,
            "title": problem.title,
            "difficulty": problem.difficulty.value,
            "markdown_text": problem.markdown_text,
            "tags": problem.tags,
        },
        links=link.Collection(
            link.Link("collection", href=url_for("problem_routes.get_problems")),
        ),
    )
    log.info("Sending back %s", response.to_json())
    return jsonify(document_to_dict(response))
