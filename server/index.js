require('dotenv').config()
const express = require('express')

const cors = require('cors')
const logger = require("./logger")
const routes = require('./routes');

const port = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use('/', routes);

app.listen(port, () => {
    logger.info(process.env.BASE_URL)
    logger.info(`Example app listening at http://localhost:${port}`)
})
