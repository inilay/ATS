# Automatic Tournament System

System for creating and maintaining tournaments. 

## Stack:
- Backend: Django + DRF + Gunicorn
- Frontend: React + Bootstrap 
- Database: PostgreSQL
- Web-server: Nginx

## Deploy
Change .env.example -> .env or create your own.
Open your favorite Terminal and run these commands.
```sh 
docker-compose build && docker-compose up -d
```
Verify the deployment by navigating to localhost:80 in your preferred browser.
