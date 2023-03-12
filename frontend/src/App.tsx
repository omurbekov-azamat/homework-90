import React, {useEffect, useRef, useState} from "react";
import {DrawCoordinate, IncomingMessage} from "./types";
import './App.css'

function App() {
    const [draws, setDraws] = useState<DrawCoordinate[]>([]);
    const ws = useRef<null | WebSocket>(null);
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d')!;

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/canvas');

        ws.current.onclose = () => {
            console.log('ws closed');
        };

        ws.current.onmessage = (event) => {
            const decodeMessage = JSON.parse(event.data) as IncomingMessage;

            if (decodeMessage.type === 'SEND_DRAWS') {
                setDraws(prev => [...prev, decodeMessage.payload]);
            }
        };

        return () => {
            if (ws.current) {
                ws.current?.close();
            }
        }
    });

    const onCanvasClick = (e: React.MouseEvent) => {
        if (!ws.current) return;

        ws.current.send(JSON.stringify({
            type: 'SEND_DRAW',
            payload: {
                x: e.nativeEvent.offsetX - 5,
                y: e.nativeEvent.offsetY - 5,
            },
        }));
    };

    for (let i = 0; i < draws.length; i++) {
        ctx.fillRect(draws[i].x, draws[i].y, 10, 10);
    }

    return (
            <canvas id='canvas' className='canvas' width='800' height='800' onClick={onCanvasClick}/>
    )
}

export default App;
