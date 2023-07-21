const express = require('express')
const app = express()
const port = 8000

const fs = require('fs')
// 读取JSON文件
const customerFilePath = './mock/costomerList.json'
const orderFilePath = './mock/orderList.json'

const customerJsonData = fs.readFileSync(customerFilePath, 'utf-8');
const orderJsonData = fs.readFileSync(orderFilePath, 'utf-8');

const customerJsonObject = JSON.parse(customerJsonData);
const orderJsonObject = JSON.parse(orderJsonData);

app.get('/searchOrderList', (req, res) => {
    let query = req.query
    let orderNumber = query.orderNumber || "all"
    let info = []
    if (orderNumber === "all") {
        info = orderJsonObject
    } else {
        info =
            orderJsonObject.find(i => i.parentOrderNumber === orderNumber) || null
    }
    res.status(200)
        .json({
            code: '200',
            data: info,
            msg: info ? 'successful' : '没有找到'
        })
})

app.get('/updateOrderInfo', (req, res) => {
    let query = req.query
    let orderNumber = query.orderNumber
    let updateFields = query.field
    let updateValue = query.value
    if (!orderNumber||orderJsonObject.findIndex(item=>item.parentOrderNumber===orderNumber)===-1) {
        res.status(400)
            .json({
                code: '400',
                data: null,
                msg: '没有找到需要更新的订单'
            })
    } else {
        orderJsonObject.forEach(element => {
            if(element.parentOrderNumber===orderNumber) {
                element[updateFields] = updateValue
            }
        });
        const modifiedJsonData = JSON.stringify(orderJsonObject, null, 2);
        fs.writeFileSync(orderFilePath, modifiedJsonData, 'utf-8');
        res.status(200)
            .json({
                code: '200',
                data: null,
                msg: 'update successful'
            })
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})