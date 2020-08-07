# EventManagementSystem
A full-stack event management system I have developed during my internship at TÜBİTAK BİLGEM YTE

## Getting Started
Front-end can be started by running yarn start command in "src/main/etkinlik-yonetim-sistemi-frontend" directory  

**Some configuration should be made for application to function properly:**
- Google API Key should be inserted into "src/main/etkinlik-yonetim-sistemi-frontend/.env" file for Google Maps to work
- PostgreSQL username and password should be inserted into "src/main/resources/application.properties"
- An email address and password should be inserted into "src/main/resources/application.properties". Additional work may be required. (Enabling less secure apps in Gmail)
- A random secret key for JWT should be inserted into "src/main/resources/application.properties".

## Features of the project
- Organizator can add new event with event name, start-end date, quota, location and additional questions to ask participants.
- Organizator can list all events, edit or delete them.
- User can list all events whose start data has not passed and apply with name, surname and identification number.
- For each application, a QRCode is generated and an email sent to participant with this QRCode. Event and participant information can be seen when this QRCode is decoded
- Organizator can list all participants of a specific event.
- When a new user applies for an event, if organizator's browser is open, a notification including participant information will be shown by using websocket.
- During the event, participants can ask questions to organizator and organizator can see all questions in one page. This is also implemented with websocket.
