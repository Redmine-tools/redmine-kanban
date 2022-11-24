# Redmine kanban

## Configure

- create a file and name it: `.env`
- in this `.env` file set the following values:
    - VUE_APP_BACKEND_URL  
      defaults to `http://localhost:3000/api` in `src/services/Api.js`


## Start the application

- to install dependencies run: `npm i`
- to start the application: `npm run serve`

## Build the application

- to build the application: `npm run build`
- to run the built version you will need serve, so download it: `npm install -g serve`
- and run: `serve -s dist`
