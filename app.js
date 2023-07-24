const express = require('express')
const app = express()
const port = 8000
const orderRouter = require('./service/api/orderApi')

app.use('/api', orderRouter);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})