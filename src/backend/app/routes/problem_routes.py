from flask import Blueprint, jsonify, url_for
from app.models import Problem
from app.extensions import db
from flask_hal import document, link
import logging

bp = Blueprint("problem_routes", __name__)
log = logging.getLogger("app")


@bp.route("/problems", methods=["GET"])
def get_problems():
    log.info("querying")
    problems = Problem.query.all()
    log.info("building collection %s", len(problems))
    problems_collection = [
        document.Document(
            data={
                "id": problem.id,
                "title": problem.title,
                "difficulty": problem.difficulty.value,
                "tags": problem.tags,
            },
            links=link.Collection(
                link.Link("collection", href=url_for("problem_routes.get_problems")),
            ),
        ).to_dict()
        for problem in problems
    ]

    log.info("problems collection %s", problems_collection)
    response = document.Document(data={"problems": problems_collection}, links=link.Collection())
    log.info("sending back %s", response.to_json())
    return jsonify(response.to_dict())


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
    return jsonify(response.to_dict())
