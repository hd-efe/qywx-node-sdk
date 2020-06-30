"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notice_1 = require("../controllers/notice");
const routers = [
    {
        path: '/',
        method: 'GET',
        handler: notice_1.default.index.bind(notice_1.default)
    },
    {
        path: '/qywx',
        method: 'GET',
        handler: notice_1.default.index.bind(notice_1.default)
    },
    {
        path: '/user_info',
        method: 'GET',
        handler: notice_1.default.user_info.bind(notice_1.default)
    }
];
exports.default = routers;
