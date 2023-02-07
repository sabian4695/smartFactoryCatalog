import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Catalog from '../components/Catalog'
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../assets/5 Nifco White Thick - Large.png'
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
import CatalogDetails from "../components/modals/CatalogDetails";
import LogoutIcon from '@mui/icons-material/Logout';
import AddCatalogItem from '../components/modals/AddCatalogItem'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {snackBarOpen, snackBarText, snackBarSeverity, cartItems, authAtom} from "./global/recoilMain";
import {useRecoilState} from "recoil";
import FilterDrawer from "../components/modals/FilterDrawer";
import EditCatalogItem from "../components/modals/EditCatalogItem";
import AreYouSure from "../components/modals/AreYouSure";
import Tooltip from '@mui/material/Tooltip';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button";
import Login from '../components/Login'

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

function Main() {
    const [auth, setAuth] = useRecoilState(authAtom)
    const [mode, setMode] = React.useState(defaultTheme);
    const [cart, setCart] = useRecoilState(cartItems)
    const [snackSev, setSnackSev] = useRecoilState(snackBarSeverity);
    const [snackOpen, setSnackOpen] = useRecoilState(snackBarOpen);
    const [snackText, setSnackText] = useRecoilState(snackBarText);
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
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    function removeCartItem(id: string) {
        //@ts-ignore
        let newArray = cart.filter(function(el) { return el.id !== id; });
        setCart(newArray);
        setSnackSev('success')
        setSnackText('Item removed')
        setSnackOpen(true)
    }

    React.useEffect(() => {
        //LOAD FRESH DATA
    }, [])

    if(auth === null) {
        return <Login/>
    } else {return (
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
                            <Tooltip title="Cart" arrow>
                                <IconButton
                                    sx={{ ml: 1 }}
                                    color="inherit"
                                    onClick={(event: React.MouseEvent<HTMLElement>) => {setAnchorEl(event.currentTarget)}}
                                >
                                    <Badge badgeContent={cart.length} color="secondary">
                                        <ShoppingCartIcon/>
                                    </Badge>
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
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={openMenu}
                onClose={() => {setAnchorEl(null)}}
                PaperProps={{
                    style: {
                        maxHeight: 500,
                        minWidth: 300,
                        maxWidth: 500
                    },
                }}
            >
                {cart.length === 0 ?
                    <Box sx={{mx:1}}>
                        <Typography color='text.secondary' sx={{fontWeight: '600'}}>
                            No items added yet.
                        </Typography>
                        <Typography variant='subtitle2'>
                            Tip - add items to your cart to send to the smart factory team.
                            This tells us you're interested in these products, and we will reach out to you.
                        </Typography>
                    </Box>
                    :
                    <div key={'2'}>
                        {cart.map((option) => (
                            <Tooltip title='Click to Remove'>
                                {/*@ts-ignore*/}
                                <MenuItem key={option.id} onClick={() => removeCartItem(option.id)}>
                                    {/*@ts-ignore*/}
                                    <ListItemText>{option.title}</ListItemText>
                                    <ListItemIcon sx={{ml:2, mr:-2}}>
                                        <DeleteIcon/>
                                    </ListItemIcon>
                                </MenuItem>
                            </Tooltip>
                        ))}
                        <Button
                            fullWidth
                            key={'1'}
                            variant='contained'
                            disableElevation color='secondary' size='small'>
                            Send Cart
                        </Button>
                    </div>
                }
            </Menu>
            <Snackbar open={snackOpen} autoHideDuration={2000} onClose={snackClose}>
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
    }}

export default Main;
