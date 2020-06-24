const fs = require('fs')
const path = require('path')
const axios = require('axios')
const corpid = 'ww1266e7f9c1f958ec'
const corpsecret = 'r09v4eGvsSADCEn2aJGMt9X2JzB_k4ZDGRbZq1QGVQQ'
let gettoken_url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`

const get_token = () => {
    return new Promise((resolve, reject) => {
        return axios.get(gettoken_url, {
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}
const handle_token =async  () => {
    console.log(1)
    let res = fs.readFileSync(path.resolve(__dirname, '../data/token.json'), 'utf-8')
    // let token = await get_token()
    console.log(res)
}
class Notice {
    constructor() {

    }
    async index() {
        await handle_token()
        return {
            a: '1'
        }
    }
}

let notice = new Notice()
export default notice