import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {Button, Container, Grid, TextField} from "@mui/material";
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import StopIcon from '@mui/icons-material/Stop';
import SquareOutlinedIcon from '@mui/icons-material/SquareOutlined';
import StackedLineChartOutlinedIcon from '@mui/icons-material/StackedLineChartOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import AutoFixNormalOutlinedIcon from '@mui/icons-material/AutoFixNormalOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';

interface Props {
    value: string;
    onChangeColor: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChooseDot: (dot: string) => void;
    onChooseSquare: (square: string) => void;
    onChooseCircle: (circle: string) => void;
    onChooseLine: (line: string) => void;
    onEraseDrawing: (erase: string) => void;
    onBrushChoose: (brush: string) => void;
}

const AppToolbar: React.FC<Props> = ({
                                         value,
                                         onChangeColor,
                                         onChooseDot,
                                         onChooseSquare,
                                         onChooseCircle,
                                         onChooseLine,
                                         onEraseDrawing,
                                         onBrushChoose
                                     }) => {
    return (
        <AppBar position="static" color='inherit' sx={{mb: 2}}>
            <Toolbar>
                <Container maxWidth='lg'>
                    <Grid container alignItems='center'>
                        <Grid item xs>
                            <Grid container direction='row' alignItems='center'>
                                <ColorLensOutlinedIcon sx={{color: 'skyblue'}}/>
                                <TextField
                                    id='color'
                                    name='color'
                                    type='color'
                                    value={value}
                                    onChange={onChangeColor}
                                    sx={{width: 60}}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs>
                            <Button onClick={() => onChooseDot('dot')}>
                                <StopIcon sx={{color: 'green'}}/>
                            </Button>
                        </Grid>
                        <Grid item xs>
                            <Button onClick={() => onChooseSquare('square')}>
                                <SquareOutlinedIcon sx={{color: 'blue'}}/>
                            </Button>
                        </Grid>
                        <Grid item xs>
                            <Button onClick={() => onChooseCircle('circle')}>
                                <CircleIcon sx={{color: 'red'}}/>
                            </Button>
                        </Grid>
                        <Grid item xs>
                            <Button onClick={() => onChooseLine('line')}>
                                <StackedLineChartOutlinedIcon sx={{color: 'black'}}/>
                            </Button>
                        </Grid>
                        <Grid item xs>
                            <Button onClick={() => onBrushChoose('brush')}>
                                <BrushOutlinedIcon sx={{color: 'gold'}}/>
                            </Button>
                        </Grid>
                        <Grid item xs>
                            <Button onClick={() => onEraseDrawing('ERASE')}>
                                <AutoFixNormalOutlinedIcon sx={{color: 'lightcoral'}}/>
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Toolbar>
        </AppBar>
    );
};

export default AppToolbar;