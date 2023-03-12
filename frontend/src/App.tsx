import React, {useEffect, useRef, useState} from "react";
import AppToolbar from "./components/MUI/AppToolbar/AppToolbar";
import './App.css'
import {DrawCoordinate, IncomingMessage} from "./types";

function App() {
    const [draws, setDraws] = useState<DrawCoordinate[]>([]);
    const [color, setColor] = useState('');

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
                color,
            },
        }));
    };

    for (let i = 0; i < draws.length; i++) {
        ctx.fillRect(draws[i].x, draws[i].y, 10, 10);
        ctx.fillStyle = draws[i].color;
    }

    const onColorClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
    };

    return (
        <>
            <AppToolbar value={color} onChangeColor={onColorClick}/>
            <canvas id='canvas' width='600' height='600' onClick={onCanvasClick}/>
        </>
    )
}

export default App;
