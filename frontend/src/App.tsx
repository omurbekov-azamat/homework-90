import React, {useEffect, useRef, useState} from "react";
import AppToolbar from "./components/MUI/AppToolbar/AppToolbar";
import './App.css'
import {IncomingALL, IncomingMessage, Tools} from "./types";

function App() {
    const [color, setColor] = useState('');
    const [tools, setTools] = useState('dot');
    const [draws, setDraws] = useState<Tools>({
        dots: [],
        squares: [],
        circles: [],
        lines: [],
        brushes: [],
    });

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
                            setDraws(prev => ({...prev, dots: [...prev.dots, item.payload]}));
                        }
                        if (item.type === 'SEND_SQUARE') {
                            setDraws(prev => ({...prev, squares: [...prev.squares, item.payload]}));
                        }
                        if (item.type === 'SEND_CIRCLE') {
                            setDraws(prev => ({...prev, circles: [...prev.circles, item.payload]}));
                        }
                        if (item.type === 'SEND_LINE') {
                            setDraws(prev => ({...prev, lines: [...prev.lines, item.payload]}));
                        }
                        if (item.type === 'SEND_BRUSH') {
                            setDraws(prev => ({...prev, brushes: [...prev.brushes, item.payload]}));
                        }
                    });
                }
            }

            if (decodeMessage.type === 'SEND_DOTS') {
                setDraws(prevState => ({...prevState, dots: [...prevState.dots, decodeMessage.payload]}));
            }
            if (decodeMessage.type === 'SEND_SQUARES') {
                setDraws(prevState => ({...prevState, squares: [...prevState.squares, decodeMessage.payload]}));
            }
            if (decodeMessage.type === 'SEND_CIRCLES') {
                setDraws(prevState => ({...prevState, circles: [...prevState.circles, decodeMessage.payload]}));
            }
            if (decodeMessage.type === 'SEND_LINES') {
                setDraws(prevState => ({...prevState, lines: [...prevState.lines, decodeMessage.payload]}));
            }
            if (decodeMessage.type === 'SEND_BRUSHES') {
                setDraws(prevState => ({...prevState, brushes: [...prevState.brushes, decodeMessage.payload]}));
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

    const onBrushChoose = (brush: string) => {
        setTools(brush);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!ws.current) return;
        if (tools === 'brush') {
            ws.current.send(JSON.stringify({
                type: 'SEND_BRUSH',
                payload: {
                    x: e.nativeEvent.offsetX,
                    y: e.nativeEvent.offsetY,
                    color,
                }
            }));
        }
    };

    const onEraseDrawing = (erase: string) => {
        ctx.clearRect(10, 10, canvas.width, canvas.height);
        setDraws({
            dots: [],
            squares: [],
            circles: [],
            lines: [],
            brushes: [],
        });
        if (!ws.current) return;
        ws.current.send(JSON.stringify({
            type: erase + '_DRAWS',
            payload: erase,
        }));
    };

    draws.dots.forEach(dot => {
        ctx.fillRect(dot.x, dot.y, 10, 10);
        ctx.fillStyle = dot.color;
    });

    draws.squares.forEach(square => {
        ctx.strokeRect(square.x, square.y, 50, 50);
        ctx.strokeStyle = square.color;
    });

    draws.circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, 30, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.fillStyle = circle.color;
    });

    draws.lines.forEach(line => {
        ctx.lineTo(line.x, line.y);
        ctx.stroke();
        ctx.strokeStyle = line.color;
    });

    draws.brushes.forEach(brush => {
        ctx.lineTo(brush.x, brush.y);
        ctx.stroke();
        ctx.strokeStyle = brush.color;
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
                onBrushChoose={onBrushChoose}
            />
            <canvas id='canvas' width='800' height='600' onClick={onCanvasClick} onMouseMove={onMouseMove}/>
        </>
    )
}

export default App;
