import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {Container, Grid, TextField} from "@mui/material";
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';

interface Props {
    value: string;
    onChangeColor: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AppToolbar: React.FC<Props> = ({value, onChangeColor}) => {
    return (
        <AppBar position="static" color='inherit' sx={{mb: 2}}>
            <Toolbar>
                <Container maxWidth='sm'>
                    <Grid container>
                        <Grid item xs={2}>
                            <Grid container direction='row' alignItems='center'>
                                <Grid item xs>
                                    <ColorLensOutlinedIcon sx={{color: 'skyblue'}}/>
                                </Grid>
                                <Grid item xs>
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
                        </Grid>
                    </Grid>
                </Container>
            </Toolbar>
        </AppBar>
    );
};

export default AppToolbar;