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
![Single elimination]([https://github.com/jon/coolproject/raw/master/image/image.png](https://drive.google.com/file/d/1ZmF77ojoGcNbbEnLYJ0UklYIdCdBSs5e/view?usp=sharing))
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
