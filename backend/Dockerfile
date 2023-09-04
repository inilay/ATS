FROM python:3

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONNUNBUFFERED 1

WORKDIR /usr/src/automatic_tournament_system

COPY ./requirements.txt /usr/src/automatic_tournament_system/requirements.txt

RUN  pip install --no-cache-dir -r requirements.txt

COPY . /usr/src/automatic_tournament_system

#CMD ["python", "manage.py", "runserver", "0.0.0.0:9088" ]