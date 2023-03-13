import React, {useEffect, useRef, useState} from "react";
import AppToolbar from "./components/MUI/AppToolbar/AppToolbar";
import './App.css'
import {DrawCoordinate, IncomingMessage} from "./types";

function App() {
    const [color, setColor] = useState('');
    const [tools, setTools] = useState('dot');
    const [dots, setDots] = useState<DrawCoordinate[]>([]);
    const [squares, setSquares] = useState<DrawCoordinate[]>([]);
    const [circles, setCircles] = useState<DrawCoordinate[]>([]);
    const [lines, setLines] = useState<DrawCoordinate[]>([]);

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
            if (decodeMessage.type === 'SEND_DOTS') {
                setDots(prev => [...prev, decodeMessage.payload]);
            }
            if (decodeMessage.type === 'SEND_SQUARES') {
                setSquares(prev => [...prev, decodeMessage.payload]);
            }
            if (decodeMessage.type === 'SEND_CIRCLES') {
                setCircles(prev => [...prev, decodeMessage.payload]);
            }
            if (decodeMessage.type === 'SEND_LINES') {
                setLines(prev => [...prev, decodeMessage.payload]);
            }
        };

        return () => {
            if (ws.current) {
                ws.current?.close();
            }
        };
    });

    const onCanvasClick = (e: React.MouseEvent) => {
        if (!ws.current) return;

        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        if (tools === 'dot') {
            ws.current.send(JSON.stringify({
                type: 'SEND_DOT',
                payload: {
                    x: x - 5,
                    y: y - 5,
                    color,
                }
            }));
        }
        if (tools === 'square') {
            ws.current.send(JSON.stringify({
                type: 'SEND_SQUARE',
                payload: {
                    x: x - 25,
                    y: y - 25,
                    color,
                }
            }));
        }
        if (tools === 'circle') {
            ws.current.send(JSON.stringify({
                type: 'SEND_CIRCLE',
                payload: {
                    x: x - 3,
                    y: y - 3,
                    color,
                }
            }));
        }
        if (tools === 'line') {
            ws.current.send(JSON.stringify({
                type: 'SEND_LINE',
                payload: {
                    x,
                    y,
                    color,
                }
            }));
        }
    };

    const onColorClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
    };

    const onChooseDot = (dot: string) => {
        setTools(dot);
    };

    const onChooseSquare = (square: string) => {
        setTools(square);
    };

    const onChooseCircle = (circle: string) => {
        setTools(circle);
    };

    const onChooseLine = (line: string) => {
        setTools(line);
    };

    for (let i = 0; i < dots.length; i++) {
        ctx.fillRect(dots[i].x, dots[i].y, 10, 10);
        ctx.fillStyle = dots[i].color;
    }

    for (let i = 0; i < squares.length; i++) {
        ctx.strokeRect(squares[i].x,squares[i].y,50,50);
        ctx.strokeStyle = squares[i].color;
    }

    for (let i = 0; i < circles.length; i++) {
        ctx.beginPath();
        ctx.arc(circles[i].x, circles[i].y, 30, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.fillStyle = circles[i].color;
    }

    for (let i = 0; i < lines.length; i++) {
        ctx.lineTo(lines[i].x, lines[i].y);
        ctx.stroke();
        ctx.strokeStyle = lines[i].color;
    }

    return (
        <>
            <AppToolbar
                value={color}
                onChangeColor={onColorClick}
                onChooseDot={onChooseDot}
                onChooseSquare={onChooseSquare}
                onChooseCircle={onChooseCircle}
                onChooseLine={onChooseLine}
            />
            <canvas id='canvas' width='800' height='600' onClick={onCanvasClick}/>
        </>
    )
}

export default App;
