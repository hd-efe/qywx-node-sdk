/**
 * 企业微信sdk  nodejs版
 * author: maixiaojie
 * version: 1.0.1
 */
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const crypto = require('crypto')
const stringRandom = require('string-random')
const corpid = 'ww1266e7f9c1f958ec'
const agentid = "1000002";
const corpsecret = 'r09v4eGvsSADCEn2aJGMt9X2JzB_k4ZDGRbZq1QGVQQ'
let gettoken_url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`
let get_jsticket_url = `https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket`
let get_jsticket_app_url = `https://qyapi.weixin.qq.com/cgi-bin/ticket/get`
const data_file_folder = path.resolve(__dirname, `../../data/`)

type File = {
    key: string
    // 文件名
    src: string
    // 请求返回值 要取的key
    return_key: string
    // 数据写入文件路劲
    path?: string
    // 请求url
    req_url: string
}
// 签名对象
type SignParams = {
    jsapi_ticket: string
    noncestr: string
    timestamp: number
    url: string
}

const files: File[] = [{
    // 获取token
    key: 'token',
    return_key: 'access_token',
    src: 'token.json',
    req_url: gettoken_url
}, {
    // 获取企业jstickets
    key: 'jstickets',
    return_key: 'ticket',
    src: 'jstickets.json',
    req_url: get_jsticket_url
}, {
    // 获取app jstickets
    key: 'jstickets_app',
    return_key: 'ticket',
    src: 'jstickets_app.json',
    req_url: get_jsticket_app_url
}]
const control = {
    async exec(action: string, params: File, other?: object) {
        switch (action) {
            case 'renew':
                return await control.renew(params, other)
                break
            case 'get':
                return await control.get(params, other)
            default:
                break
        }
    },
    async renew(params: File, other?: object) {
        let res: any = {}
        res = await do_request(params.req_url, other)

        if (res.errcode == 0 && res.errmsg == 'ok') {
            let fileData = {
                [params.key]: res[params.return_key],
                expries_time: new Date().getTime() + 7200 * 1000
            }
            fs.writeFileSync(params.path, JSON.stringify(fileData))
            return fileData[params.key]
        } else {
            return ''
        }
    },
    async get(params: File, other?: object) {
        let file_path = params.path
        let res = fs.readFileSync(file_path, 'utf-8')
        if (res == '') {
            return await control.exec('renew', params, other)
        } else {
            let json_res = JSON.parse(res);
            if (json_res.expries_time < new Date().getTime()) {
                // 过期
                return await control.exec('renew', params, other)
            } else {
                return json_res[params.key]
            }
        }
    }
}

const do_request = (url, params?: object) => {
    console.log(`请求${url}`)
    return new Promise((resolve, reject) => {
        return axios.get(url, {
            params
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

const sign = (params: SignParams) => {
    let str = `jsapi_ticket=${params.jsapi_ticket}&noncestr=${params.noncestr}&timestamp=${params.timestamp}&url=${params.url}`
    return crypto.createHash('sha1').update(str).digest('hex')
}

class Notice {
    token: string = 'a'
    constructor() {
        if (!fs.existsSync(data_file_folder)) {
            fs.mkdirSync(data_file_folder)
        }
        files.forEach(file => {
            file.path = path.resolve(data_file_folder, file.src);
            if (!fs.existsSync(file.path)) {
                fs.writeFileSync(file.path, '', 'utf-8')
            }
        })
        this.get_token()

    }
    async get_token() {
        this.token = await control.exec('get', files[0], {})
    }
    async user_info(request) {
        if (!request.query.user_id) {
            return {
                msg: '缺少参数'
            }
        }
        let external_userid = request.query.user_id
        let res: any = await do_request('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/get', {
            access_token: this.token,
            external_userid
        })

        if (res.errcode == 0 && res.errmsg == 'ok') {
            return res.external_contact
        } else {

            return {
                msg: '获取失败'
            }
        }
    }
    async index(request) {
        if (!request.query.url) {
            return {
                msg: '缺少参数'
            }
        }
        let token = this.token
        let ticket = await control.exec('get', files[1], { access_token: token })
        let ticket_app = await control.exec('get', files[2], {
            access_token: token,
            type: 'agent_config'
        })
        let noncestr = stringRandom(16)
        let url = request.query.url
        let timestamp = Math.round(new Date().getTime() / 1000)
        let signature = sign({
            jsapi_ticket: ticket,
            noncestr,
            timestamp,
            url
        })
        let signature1 = sign({
            jsapi_ticket: ticket_app,
            noncestr,
            timestamp,
            url
        })
        return {
            appId: corpid,
            timestamp,
            nonceStr: noncestr,
            signature,
            signature1,
            agentid
        }
    }
}

let notice = new Notice()
export default notice