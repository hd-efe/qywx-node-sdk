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
const corpid = 'ww1266e7f9c1f958ec';
const corpsecret = 'r09v4eGvsSADCEn2aJGMt9X2JzB_k4ZDGRbZq1QGVQQ';
let gettoken_url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`;
const get_token = () => {
    return new Promise((resolve, reject) => {
        return axios.get(gettoken_url, {}).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err);
        });
    });
};
const handle_token = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(1);
    let res = fs.readFileSync(path.resolve(__dirname, '../data/token.json'), 'utf-8');
    // let token = await get_token()
    console.log(res);
});
class Notice {
    constructor() {
    }
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            yield handle_token();
            return {
                a: '1'
            };
        });
    }
}
let notice = new Notice();
exports.default = notice;
