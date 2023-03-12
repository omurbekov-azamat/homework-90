import {WebSocket} from 'ws';

export interface ActiveConnections {
    [id: string]: WebSocket;
}

export interface IncomingDraw {
    type: string;
    payload: {
        x: number;
        y: number;
        color: string;
    };
}