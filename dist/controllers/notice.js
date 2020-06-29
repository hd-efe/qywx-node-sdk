"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');
const stringRandom = require('string-random');
const corpid = 'ww1266e7f9c1f958ec';
const agentid = "1000002";
const corpsecret = 'r09v4eGvsSADCEn2aJGMt9X2JzB_k4ZDGRbZq1QGVQQ';
let gettoken_url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`;
let get_jsticket_url = `https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket`;
let get_jsticket_app_url = `https://qyapi.weixin.qq.com/cgi-bin/ticket/get`;
const data_file_folder = path.resolve(__dirname, `../../data/`);
const files = [{
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
    }];
const control = {
    exec(action, params, other) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (action) {
                case 'renew':
                    return yield control.renew(params, other);
                    break;
                case 'get':
                    return yield control.get(params, other);
                default:
                    break;
            }
        });
    },
    renew(params, other) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = {};
            res = yield do_request(params.req_url, other);
            if (res.errcode == 0 && res.errmsg == 'ok') {
                let fileData = {
                    [params.key]: res[params.return_key],
                    expries_time: new Date().getTime() + 7200 * 1000
                };
                fs.writeFileSync(params.path, JSON.stringify(fileData));
                return fileData[params.key];
            }
            else {
                return '';
            }
        });
    },
    get(params, other) {
        return __awaiter(this, void 0, void 0, function* () {
            let file_path = params.path;
            let res = fs.readFileSync(file_path, 'utf-8');
            if (res == '') {
                return yield control.exec('renew', params, other);
            }
            else {
                let json_res = JSON.parse(res);
                if (json_res.expries_time < new Date().getTime()) {
                    // 过期
                    return yield control.exec('renew', params, other);
                }
                else {
                    return json_res[params.key];
                }
            }
        });
    }
};
const do_request = (url, params) => {
    console.log(`请求${url}`);
    return new Promise((resolve, reject) => {
        return axios.get(url, {
            params
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err);
        });
    });
};
const sign = (params) => {
    let str = `jsapi_ticket=${params.jsapi_ticket}&noncestr=${params.noncestr}&timestamp=${params.timestamp}&url=${params.url}`;
    return crypto.createHash('sha1').update(str).digest('hex');
};
class Notice {
    constructor() {
        if (!fs.existsSync(data_file_folder)) {
            fs.mkdirSync(data_file_folder);
        }
        files.forEach(file => {
            file.path = path.resolve(data_file_folder, file.src);
            if (!fs.existsSync(file.path)) {
                fs.writeFileSync(file.path, '', 'utf-8');
            }
        });
    }
    index(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.query.url) {
                return {
                    msg: '缺少参数'
                };
            }
            let token = yield control.exec('get', files[0], {});
            let ticket = yield control.exec('get', files[1], { access_token: token });
            let ticket_app = yield control.exec('get', files[2], {
                access_token: token,
                type: 'agent_config'
            });
            let noncestr = stringRandom(16);
            let url = request.query.url;
            let timestamp = Math.round(new Date().getTime() / 1000);
            let signature = sign({
                jsapi_ticket: ticket,
                noncestr,
                timestamp,
                url
            });
            let signature1 = sign({
                jsapi_ticket: ticket_app,
                noncestr,
                timestamp,
                url
            });
            return {
                appId: corpid,
                timestamp,
                nonceStr: noncestr,
                signature,
                signature1,
                agentid
            };
        });
    }
}
let notice = new Notice();
exports.default = notice;
