import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {loadingOpen, loadingTitle, themeMode} from "./components/global/recoilMain";
import {useRecoilValue} from "recoil";
import Login from './components/Login'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function App() {
    const loadTitle = useRecoilValue(loadingTitle);
    const openLoad = useRecoilValue(loadingOpen);
    const mode = useRecoilValue(themeMode);
    const theme = createTheme({
        palette: {
            //@ts-ignore
            mode: mode,
            primary: {
                main: '#ff6B00',
            },
            secondary: {
                main: '#0095ff',
            }
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openLoad}
            >
                <Box sx={{display:'flex',flexDirection:'column',alignContent:'center',justifyItems:'center'}}>
                    <CircularProgress color="inherit" sx={{alignSelf:'center'}} />
                    <Typography variant='h5' sx={{my:3, textAlign:'center'}}>
                        {loadTitle}
                    </Typography>
                </Box>
            </Backdrop>
            <Login/>
        </ThemeProvider>
    );
}

export default App;
