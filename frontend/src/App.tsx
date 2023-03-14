import React, {useEffect, useRef, useState} from "react";
import AppToolbar from "./components/MUI/AppToolbar/AppToolbar";
import './App.css'
import {DrawCoordinate, IncomingALL, IncomingMessage} from "./types";

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
            const decodeMessage = JSON.parse(event.data) as IncomingMessage | IncomingALL;

            if (decodeMessage.type === 'SEND_ALL') {
                if (Array.isArray(decodeMessage.payload)) {
                    decodeMessage.payload.forEach(item => {
                        if (item.type === 'SEND_DOT') {
                            setDots(prev => [...prev, item.payload]);
                        }
                        if (item.type === 'SEND_SQUARE') {
                            setSquares(prev => [...prev, item.payload]);
                        }
                        if (item.type === 'SEND_CIRCLE') {
                            setCircles(prev => [...prev, item.payload]);
                        }
                        if (item.type === 'SEND_LINE') {
                            setLines(prev => [...prev, item.payload]);
                        }
                    });
                }
            }
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
    }, []);

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

    const onEraseDrawing = (erase: string) => {
        ctx.clearRect(10, 10, canvas.width, canvas.height);
        setDots([]);
        setSquares([]);
        setCircles([]);
        setLines([]);
        if (!ws.current) return;
        ws.current.send(JSON.stringify({
            type: erase + '_DRAWS',
            payload: erase,
        }));
    };

    dots.forEach(dot => {
        ctx.fillRect(dot.x, dot.y, 10, 10);
        ctx.fillStyle = dot.color;
    });

    squares.forEach(square => {
        ctx.strokeRect(square.x, square.y, 50, 50);
        ctx.strokeStyle = square.color;
    });

    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, 30, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.fillStyle = circle.color;
    });

    lines.forEach(line => {
        ctx.lineTo(line.x, line.y);
        ctx.stroke();
        ctx.strokeStyle = line.color;
    });

    return (
        <>
            <AppToolbar
                value={color}
                onChangeColor={onColorClick}
                onChooseDot={onChooseDot}
                onChooseSquare={onChooseSquare}
                onChooseCircle={onChooseCircle}
                onChooseLine={onChooseLine}
                onEraseDrawing={onEraseDrawing}
            />
            <canvas id='canvas' width='800' height='600' onClick={onCanvasClick}/>
        </>
    )
}

export default App;
