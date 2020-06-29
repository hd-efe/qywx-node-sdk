const fs = require('fs')
const path = require('path')
const axios = require('axios')
const crypto = require('crypto')
const corpid = 'ww1266e7f9c1f958ec'
const agentid = "1000002";
const corpsecret = 'r09v4eGvsSADCEn2aJGMt9X2JzB_k4ZDGRbZq1QGVQQ'
let gettoken_url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`
let get_js_ticket_url = `https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket`
let get_js_ticket_app_url = `https://qyapi.weixin.qq.com/cgi-bin/ticket/get`
const get_token = () => {
    console.log('发送获取token请求...')
    return new Promise((resolve, reject) => {
        return axios.get(gettoken_url, {
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}
const get_js_ticket = (access_token) => {
    console.log('发送获取ticket请求...')
    return new Promise((resolve, reject) => {
        return axios.get(get_js_ticket_url, {
            params: {
                access_token
            }
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}
const get_js_ticket_app = (access_token) => {
    console.log('发送获取ticket请求...')
    return new Promise((resolve, reject) => {
        return axios.get(get_js_ticket_app_url, {
            params: {
                access_token,
                type: 'agent_config'
            }
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}
// 重新获取token 并且写入文件
const renew_token = async () => {
    let token: any = await get_token()
    if (token.errcode == 0 && token.errmsg == 'ok') {
        let fileData = {
            token: token.access_token,
            expries_time: new Date().getTime() + 7200 * 1000
        }
        fs.writeFileSync(path.resolve(__dirname, '../data/token.json'), JSON.stringify(fileData))
        return fileData.token
    }
}
const handle_token = async () => {
    let res = fs.readFileSync(path.resolve(__dirname, '../data/token.json'), 'utf-8')
    if (res == '') {
        return renew_token()
    }else {
        let json_res = JSON.parse(res);
        if(json_res.expries_time < new Date().getTime()) {
            // 过期
            return renew_token()
        }else {
            return json_res.token
        }
    }
}
const renew_js_ticket = async(access_token) => {
    let res: any = await get_js_ticket(access_token)
    if (res.errcode == 0 && res.errmsg == 'ok') {
        let fileData = {
            ticket: res.ticket,
            expries_time: new Date().getTime() + 7200 * 1000
        }
        fs.writeFileSync(path.resolve(__dirname, '../data/ticket.json'), JSON.stringify(fileData))
        return fileData.ticket;
    }
}
const renew_js_ticket_app = async(access_token) => {
    let res: any = await get_js_ticket_app(access_token)
    if (res.errcode == 0 && res.errmsg == 'ok') {
        let fileData = {
            ticket: res.ticket,
            expries_time: new Date().getTime() + 7200 * 1000
        }
        fs.writeFileSync(path.resolve(__dirname, '../data/ticket_app.json'), JSON.stringify(fileData))
        return fileData.ticket;
    }
}

const handle_js_ticket_app = async (access_token) => {

    let res = fs.readFileSync(path.resolve(__dirname, '../data/ticket_app.json'), 'utf-8')
    if (res == '') {
        return renew_js_ticket_app(access_token)
    }else {
        let json_res = JSON.parse(res);
        if(json_res.expries_time < new Date().getTime()) {
            // 过期
            return renew_js_ticket_app(access_token)
        }else {
            return json_res.ticket
        }
    }
}
const handle_js_ticket = async (access_token) => {

    let res = fs.readFileSync(path.resolve(__dirname, '../data/ticket.json'), 'utf-8')
    if (res == '') {
        return renew_js_ticket(access_token)
    }else {
        let json_res = JSON.parse(res);
        if(json_res.expries_time < new Date().getTime()) {
            // 过期
            return renew_js_ticket(access_token)
        }else {
            return json_res.ticket
        }
    }
}
const sign = (params) => {
    let str = `jsapi_ticket=${params.jsapi_ticket}&noncestr=${params.nonceStr}&timestamp=${params.timestamp}&url=${params.url}`
    return crypto.createHash('sha1').update(str).digest('hex')
}
class Notice {
    constructor() {

    }
    async index(request) {
        if(!request.query.url) {
            return {
                msg: '缺少参数'
            }
        }
        let token = await handle_token()
        let ticket = await handle_js_ticket(token)
        let ticket_app = await handle_js_ticket_app(token)
        let timestamp = Math.round(new Date().getTime() / 1000)
        let url = request.query.url
        let nonceStr = 'hundundaxue'
        let sginParams = {
            jsapi_ticket: ticket,
            nonceStr,
            timestamp,
            url
        }
        let sginapp = {
            jsapi_ticket: ticket_app,
            nonceStr,
            timestamp,
            url
        }
        let signature = sign(sginParams)
        let signature1 = sign(sginapp)
        return {
            appId: corpid,
            timestamp,
            nonceStr,
            signature,
            signature1,
            agentid
        }
    }
}

let notice = new Notice()
export default notice