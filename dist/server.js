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
const hapi = require("hapi");
const index_1 = require("./routers/index");
const server = new hapi.Server({
    host: 'localhost',
    port: 3002,
});
server.route(index_1.default);
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield server.start();
        }
        catch (e) {
            console.log(e);
            process.exit(1);
        }
        console.log("server running at:", server.info.uri);
    });
}
start();
