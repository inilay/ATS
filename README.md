# Automatic Tournament System
System for creating and maintaining tournaments. 

## System description
### Main features:
 - Support one-stage and two-stage tournaments
 - Support four types of bracket
 - Support auto time managment 
 - Grid auto-fill 
 - Ability to download the grid in jpg, sng, png formats
 - User's personal account
 - Dark and light theme
 
 ### Bracket types:
Single elimination:
![Single elimination](https://github.com/inilay/ATS/assets/110691997/ad853913-56fc-400a-b117-bb140d10b9fd)
Double elimination:
Swiss:
Round robin:


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

## License

MIT
