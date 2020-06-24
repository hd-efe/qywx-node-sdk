"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notice_1 = require("../controllers/notice");
const routers = [
    {
        path: '/',
        method: 'GET',
        handler: notice_1.default.index
    },
    {
        path: '/qywx',
        method: 'GET',
        handler: notice_1.default.index
    }
];
exports.default = routers;
