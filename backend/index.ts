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

router.ws('/canvas', (ws, req) => {
    const id = crypto.randomUUID();
    console.log('Client connected! id=', id);
    activeConnections[id] = ws;

    ws.on('message', (draw) => {
        const decodeMessage = JSON.parse(draw.toString()) as IncomingDraw;

        switch (decodeMessage.type) {
            case 'SEND_DRAW':
                Object.keys(activeConnections).forEach(id => {
                    const conn = activeConnections[id];
                    conn.send(JSON.stringify({
                        type: 'SEND_DRAWS',
                        payload: decodeMessage.payload,
                    }))
                });
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