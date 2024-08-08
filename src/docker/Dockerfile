FROM python:3.12-slim

WORKDIR /app


COPY requirements.txt requirements.txt
RUN pip install --upgrade pip
RUN pip install --use-pep517 --upgrade -r requirements.txt

COPY . .

CMD ["flask", "run", "--host=0.0.0.0"]
