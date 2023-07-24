const express = require('express')
const orderRouter = express.Router()

const fs = require('fs')
// 读取JSON文件
const orderFilePath = './mock/orderList.json'

const orderJsonData = fs.readFileSync(orderFilePath, 'utf-8');

const orderJsonObject = JSON.parse(orderJsonData);

orderRouter.get('/searchOrderList', (req, res) => {
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

orderRouter.get('/updateOrderInfo', (req, res) => {
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
        let add = false
        orderJsonObject.forEach(element => {
            if(element.parentOrderNumber===orderNumber) {
                add = !element[updateFields]
                element[updateFields] = updateValue
            }
        });
        const modifiedJsonData = JSON.stringify(orderJsonObject, null, 2);
        fs.writeFileSync(orderFilePath, modifiedJsonData, 'utf-8');
        res.status(200)
            .json({
                code: '200',
                data: null,
                msg: add?"add successful":'update successful'
            })
    }
})

module.exports = orderRouter