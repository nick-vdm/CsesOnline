from app.models import Problem
from flask import jsonify, request, url_for
from flask_hal import Document, HALJson
from flask_hal.link import Link


@bp.route("/problems", methods=["GET"])
def get_problems():
    problems = Problem.query.all()
    problems_list = [
        {
            "id": problem.id,
            "title": problem.title,
            "difficulty": problem.difficulty.value,
            "tags": problem.tags,
            "_links": {
                "self": {"href": url_for("bp.get_problem", problem_id=problem.id)},
                "collection": {"href": url_for("bp.get_problems")},
            },
        }
        for problem in problems
    ]
    response = Document(
        data={"problems": problems_list},
        links={"self": Link(url_for("bp.get_problems"))},
    )
    return HALJson(response)


@bp.route("/problems/<int:problem_id>", methods=["GET"])
def get_problem(problem_id):
    problem = Problem.query.get_or_404(problem_id)
    response = Document(
        data={
            "id": problem.id,
            "title": problem.title,
            "difficulty": problem.difficulty.value,
            "markdown_text": problem.markdown_text,
            "tags": problem.tags,
        },
        links={
            "self": Link(url_for("bp.get_problem", problem_id=problem.id)),
            "collection": Link(url_for("bp.get_problems")),
        },
    )
    return HALJson(response)
