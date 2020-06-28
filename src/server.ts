import * as hapi from 'hapi';
import routers from './routers/index'
const server: hapi.Server = new hapi.Server({
    host: 'localhost',
    port: 3002,
    // routes: {cors: {origin: ['*']} }
});

server.route(routers);

async function start() {
    try {
        await server.start();
    }catch(e) {
        console.log(e);
        process.exit(1);
    }
    console.log("server running at:", server.info.uri);
}
start();
