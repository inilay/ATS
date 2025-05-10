# Automatic Tournament System
System for creating and maintaining tournaments. 

## System description
### Main features:
 - Support one-stage tournaments
 - Support matches with 2-6 participants
 - Support four types of bracket
 - Grid auto-fill 
 - Push notifications
 - User's personal account
 - Dark and light theme
 
 ### Bracket types:
Single elimination:

![Single elimination](https://github.com/inilay/ATS/assets/110691997/ad853913-56fc-400a-b117-bb140d10b9fd)

Double elimination:

![Double elimination](https://github.com/inilay/ATS/assets/110691997/a79049a1-6bc1-49d5-a560-f04fa23e7fa6)

Swiss:

![Swiss](https://github.com/inilay/ATS/assets/110691997/adcb2b78-1bf1-475b-924a-7fb6c0f35592)

Round robin:

![Round robin](https://github.com/inilay/ATS/assets/110691997/d9bdb3b9-d501-41d5-91d3-b49ac3e28791)


## Stack:
- Backend: Django + Celery + DRF + Gunicorn
- Frontend: React + Bootstrap 
- Database: PostgreSQL, Redis
- Web-server: Nginx

## Deploy
Change .env.example -> .env or create your own.
Open your favorite Terminal and run these commands.
```sh 
docker-compose build && docker-compose up -d
```
Verify the deployment by navigating to localhost:80 in your preferred browser.

## License

MIT
