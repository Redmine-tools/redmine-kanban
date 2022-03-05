# Backend proxy

This project serves as a backend proxy for a Redmine based application. The frontend application uses this backend to avoid any CORS issues.

## Configure

- create a file and name it: `.env`
- in this `.env` file set the following values: 
  - PORT
  - BASE_URL
  - NODE_LOGGING_LEVEL

### example .env file
```
PORT=3000
BASE_URL=http://redmine-url.com
NODE_LOGGING_LEVEL=info
```

## Start the application

- to install dependencies run: `npm i`
- to start the application: `npm run start`

## Endpoints

`/api` - this endpoint just redirects the request from the client to a redmine API (no changes made to the request itself)
