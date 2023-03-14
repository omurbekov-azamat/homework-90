import express from 'express';
import expressWs from "express-ws";
import cors from 'cors';
import * as crypto from "crypto";
import {ActiveConnections, IncomingDraw} from "./types";

const port = 8000;
const app = express();
expressWs(app);
app.use(cors());

const router = express.Router();

const activeConnections: ActiveConnections = {};
let draws: IncomingDraw[] = [];

router.ws('/canvas', (ws, req) => {
    const id = crypto.randomUUID();
    console.log('Client connected! id=', id);
    activeConnections[id] = ws;

    ws.send(JSON.stringify({type: "SEND_ALL", payload: draws}));

    ws.on('message', (draw) => {
        const decodeMessage = JSON.parse(draw.toString()) as IncomingDraw;
        draws.push(decodeMessage);
        switch (decodeMessage.type) {
            case 'SEND_DOT':
                Object.keys(activeConnections).forEach(id => {
                    const conn = activeConnections[id];
                    conn.send(JSON.stringify({
                        type: 'SEND_DOTS',
                        payload: decodeMessage.payload,
                    }));
                });
                break;
            case 'SEND_SQUARE':
                Object.keys(activeConnections).forEach(id => {
                    const conn = activeConnections[id];
                    conn.send(JSON.stringify({
                        type: 'SEND_SQUARES',
                        payload: decodeMessage.payload,
                    }));
                });
                break;
            case 'SEND_CIRCLE':
                Object.keys(activeConnections).forEach(id => {
                    const conn = activeConnections[id];
                    conn.send(JSON.stringify({
                        type: 'SEND_CIRCLES',
                        payload: decodeMessage.payload,
                    }));
                });
                break;
            case 'SEND_LINE':
                Object.keys(activeConnections).forEach(id => {
                    const conn = activeConnections[id];
                    conn.send(JSON.stringify({
                        type: 'SEND_LINES',
                        payload: decodeMessage.payload,
                    }));
                });
                break;
            case 'ERASE_DRAWS':
                draws = [];
                break;
            default:
                console.log('Unknown type', decodeMessage.type);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected! id=', id);
        delete activeConnections[id];
    });
});

app.use(router);

app.listen(port, () => {
    console.log('Server started on ', port);
});