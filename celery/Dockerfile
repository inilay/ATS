FROM python:3.11.5

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONNUNBUFFERED 1

WORKDIR /backend

COPY ./celery/requirements.txt /backend/requirements.txt

RUN  python -m pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY ./backend /backend/

COPY ./celery/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["bash", "entrypoint.sh"]

# ENTRYPOINT [ "python", "manage.py", "runserver", "0.0.0.0:49088" ]

# CMD [ "python", "manage.py", "runserver", "0.0.0.0:49088" ]