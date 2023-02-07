import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Catalog from './components/Catalog'
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../src/assets/5 Nifco White Thick - Large.png'
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
import CatalogDetails from "./components/modals/CatalogDetails";
import LogoutIcon from '@mui/icons-material/Logout';
import AddCatalogItem from './components/modals/AddCatalogItem'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {snackBarOpen, snackBarText, snackBarSeverity} from "./components/global/recoilMain";
import {useRecoilValue, useRecoilState} from "recoil";
import FilterDrawer from "./components/modals/FilterDrawer";
import EditCatalogItem from "./components/modals/EditCatalogItem";
import AreYouSure from "./components/modals/AreYouSure";
import Tooltip from '@mui/material/Tooltip';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

let defaultTheme: string
if (localStorage.getItem('themeMode') !== null) {
    let def = localStorage.getItem('themeMode')
    defaultTheme = def === null ? 'light' : def
} else {
    defaultTheme = 'light'
    localStorage.setItem('themeMode','light')
}

function App() {
    const [mode, setMode] = React.useState(defaultTheme);
    const snackSev = useRecoilValue(snackBarSeverity);
    const [snackOpen, setSnackOpen] = useRecoilState(snackBarOpen);
    const snackText = useRecoilValue(snackBarText);
    function setTheme() {
        if(mode === 'light') {
            setMode('dark')
            localStorage.setItem('themeMode','dark')
        } else {
            setMode('light')
            localStorage.setItem('themeMode','light')
        }
    }
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
    const snackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {return}
        setSnackOpen(false);
    };
    return (
        <ThemeProvider theme={theme}>
        <Box>
            <CssBaseline />
            <Box sx={{flexGrow: 1}}>
                <AppBar position="fixed" sx={mode === 'light' ? {backgroundColor:'#eeeeee'} : {backgroundColor:'#212121'}} elevation={2}>
                    <Toolbar>
                        <img
                            src={logo}
                            height='40'
                            alt='logo'
                            >
                        </img>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1, ml:1}}>
                            Smart Factory Catalog
                        </Typography>
                        <Typography display='inline'>
                            {theme.palette.mode} mode
                        </Typography>
                        <Tooltip title="Change Theme" arrow>
                            <IconButton onClick={setTheme} color="inherit">
                                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Logout" arrow>
                            <IconButton sx={{ ml: 1 }} color="inherit">
                                <LogoutIcon/>
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box component="main" sx={{p: 3}}>
                <Toolbar/>
                <Catalog/>
            </Box>
        </Box>
            <Snackbar open={snackOpen} autoHideDuration={4000} onClose={snackClose}>
                {/*@ts-ignore*/}
                <Alert onClose={snackClose} severity={snackSev} sx={{width: '100%'}}>
                    {snackText}
                </Alert>
            </Snackbar>
            <CatalogDetails/>
            <AddCatalogItem/>
            <EditCatalogItem/>
            <FilterDrawer/>
            <AreYouSure/>
        </ThemeProvider>
    );
}

export default App;
