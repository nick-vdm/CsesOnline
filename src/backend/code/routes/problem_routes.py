import logging

from flask import Blueprint, jsonify, url_for
from flask_hal import document, link

from code.extensions import db
from code.models import Problem

bp = Blueprint("problem_routes", __name__)
log = logging.getLogger("code")


@bp.route("/api/problems", methods=["GET"])
def get_problems():
    problems = Problem.query.all()
    problems_collection = [
        document.Document(
            data={
                "id": problem.id,
                "title": problem.title,
                "difficulty": problem.difficulty.value,
                "problem_group": problem.problem_group,
            },
            links=link.Collection(
                link.Link("collection", href=url_for("problem_routes.get_problems")),
            ),
        ).to_dict()
        for problem in problems
    ]

    response = document.Document(data={"problems": problems_collection}, links=link.Collection())
    return jsonify(response.to_dict())


@bp.route("/api/problems/<int:problem_id>", methods=["GET"])
def get_problem(problem_id):
    problem = db.session.get(Problem, problem_id)

    if not problem:
        return jsonify({"error": f"Problem {problem_id} not found"}), 404

    response = document.Document(
        data={
            "id": problem.id,
            "title": problem.title,
            "difficulty": problem.difficulty.value,
            "problem_description": problem.problem_description,
            "problem_group": problem.problem_group,
        },
        links=link.Collection(
            link.Link("collection", href=url_for("problem_routes.get_problems")),
        ),
    )
    return jsonify(response.to_dict())
