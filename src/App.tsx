import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {themeMode} from "./components/global/recoilMain";
import {useRecoilValue} from "recoil";
import Login from './components/Login'
import Backdrop from '@mui/material/Backdrop';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
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
                <Login/>
        </ThemeProvider>
    );
}

export default App;
