import React, {useState, useEffect} from 'react';
import * as CONFIG from './helpers/config';
import {
    loadingMessageSelector,
    accessTokenAtom,
    refreshTokenAtom,
    refreshExpiryAtom,
    accessExpiryAtom,
    userIdAtom,
    loggedInUserAtom, themeMode,
    loadingTitle,
    loadingOpen
} from './global/recoilMain';
import {getDataString, getDataInt, deleteData} from './helpers/storage';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {login, refreshLogin} from './helpers/api';
import {timeToLogout} from './helpers/misc';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import darkLogo from '../assets/darkLogo.png'
import lightLogo from '../assets/lightLogo.png'
import Main from './Main'
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const Login = () => {
    const [loginError, setLoginError] = useState(null);
    const [usernameValue, setUsernameValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [loadingMessage, setLoadingMessage] = useRecoilState(loadingMessageSelector);
    const setLoadingTitle = useSetRecoilState(loadingTitle);
    const setOpenLoad = useSetRecoilState(loadingOpen);
    const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
    const setUserId = useSetRecoilState(userIdAtom);
    const setRefreshToken = useSetRecoilState(refreshTokenAtom);
    const setAccessExpiry = useSetRecoilState(accessExpiryAtom);
    const setRefreshExpiry = useSetRecoilState(refreshExpiryAtom);
    const setLoggedInUser = useSetRecoilState(loggedInUserAtom);
    const [mode, setMode] = useRecoilState(themeMode);
    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    function setTheme() {
        if(mode === 'light') {
            setMode('dark')
            localStorage.setItem('themeMode','dark')
        } else {
            setMode('light')
            localStorage.setItem('themeMode','light')
        }
    }

    // check for local stored credentials
    useEffect(() => {
        const now = Math.floor(Date.now() / 1000);
        const userIdLocal = getDataString('userId'),
            accessTokenLocal = getDataString('accessToken'),
            refreshTokenLocal = getDataString('refreshToken'),
            accessExpiryLocal = getDataInt('accessExpiry'),
            refreshExpiryLocal = getDataInt('refreshExpiry'),
            loggedInUserLocal = getDataString('loggedInUser');
        if (!userIdLocal || !accessTokenLocal || !refreshTokenLocal || !accessExpiryLocal || !refreshExpiryLocal
            || !loggedInUserLocal || (accessExpiryLocal < now && refreshExpiryLocal < now)) {
            deleteData('userId');
            deleteData('accessToken');
            deleteData('refreshToken');
            deleteData('accessExpiry');
            deleteData('refreshExpiry');
            deleteData('loggedInUser');
        } else if (accessExpiryLocal < now && refreshExpiryLocal > now) {
            const refresh = async () => {
                try {
                    setLoadingMessage('Initializing');
                    setOpenLoad(true)
                    setLoadingTitle('Initializing')
                    const authData = await refreshLogin(userIdLocal, refreshTokenLocal);
                    if (!authData || !authData.userId || !authData.accessToken || !authData.refreshToken ||
                        !authData.accessExpiry || !authData.refreshExpiry || !authData.user) {
                        deleteData('userId');
                        deleteData('accessToken');
                        deleteData('refreshToken');
                        deleteData('accessExpiry');
                        deleteData('refreshExpiry');
                        deleteData('loggedInUser');
                        return;
                    }
                    setUserId(authData.userId);
                    setAccessToken(authData.accessToken);
                    setRefreshToken(authData.refreshToken);
                    setAccessExpiry(authData.accessExpiry);
                    setRefreshExpiry(authData.refreshExpiry);
                    setLoggedInUser(authData.user);
                } finally {
                    setLoadingMessage(null);
                    setOpenLoad(false)
                }
            };
            refresh();
        } else {
            setUserId(userIdLocal);
            setAccessToken(accessTokenLocal);
            setRefreshToken(refreshTokenLocal);
            setAccessExpiry(accessExpiryLocal);
            setRefreshExpiry(refreshExpiryLocal);
            setLoggedInUser(loggedInUserLocal);
        }
    }, [
        setUserId,
        setAccessToken,
        setRefreshToken,
        setAccessExpiry,
        setRefreshExpiry,
        setLoadingMessage,
        setLoggedInUser,
    ]);

    // credential checker interval
    useEffect(() => {
        const clearAuth = () => {
            setUserId(null);
            setAccessToken(null);
            setRefreshToken(null);
            setAccessExpiry(null);
            setRefreshExpiry(null);
            setLoggedInUser(null);
        };
        const checkerInterval = setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            const userIdLocal = getDataString('userId'),
                accessTokenLocal = getDataString('accessToken'),
                refreshTokenLocal = getDataString('refreshToken'),
                accessExpiryLocal = getDataInt('accessExpiry'),
                refreshExpiryLocal = getDataInt('refreshExpiry'),
                loggedInUserLocal = getDataString('loggedInUser');
            if (userIdLocal && refreshTokenLocal && accessExpiryLocal && refreshExpiryLocal && accessTokenLocal
                && loggedInUserLocal) {
                if (accessExpiryLocal < now) {
                    if (refreshExpiryLocal > now && !CONFIG.DISABLE_RE_AUTHENTICATION) {
                        refreshLogin(userIdLocal, refreshTokenLocal)
                            .then(authData => {
                                if (!authData || !authData.userId || !authData.accessToken || !authData.refreshToken ||
                                    !authData.accessExpiry || !authData.refreshExpiry || !authData.user) {
                                    clearAuth();
                                    return;
                                }
                                setUserId(authData.userId);
                                setAccessToken(authData.accessToken);
                                setRefreshToken(authData.refreshToken);
                                setAccessExpiry(authData.accessExpiry);
                                setRefreshExpiry(authData.refreshExpiry);
                                setLoggedInUser(authData.user);
                            })
                            .catch(e => {
                                console.error('Could not background refresh API credentials ->', e);
                                clearAuth();
                            });
                    } else clearAuth();
                }
            } else {
                clearAuth();
            }
        }, 30000);
        return () => clearInterval(checkerInterval);
    }, [setUserId, setAccessToken, setRefreshToken, setAccessExpiry, setRefreshExpiry, setLoggedInUser]);

    // no activity checker interval
    useEffect(() => {
        let checkerInterval;
        if (CONFIG.NO_ACTIVITY_TIMEOUT) {
            checkerInterval = setInterval(() => {
                if (timeToLogout(CONFIG.NO_ACTIVITY_TIMEOUT)) {
                    setUserId(null);
                    setAccessToken(null);
                    setRefreshToken(null);
                    setAccessExpiry(null);
                    setRefreshExpiry(null);
                    setLoggedInUser(null);
                }
            }, 10000);
        }
        if (checkerInterval) return () => clearInterval(checkerInterval);
    }, [setUserId, setAccessToken, setRefreshToken, setAccessExpiry, setRefreshExpiry, setLoggedInUser]);

    const authenticate = async event => {
        event.preventDefault();
        setLoginError(false);
        try {
            setLoadingMessage('Authenticating');
            setOpenLoad(true)
            setLoadingTitle('Authenticating')
            const authData = await login(usernameValue, passwordValue);
            if (!authData || !authData.userId || !authData.accessToken || !authData.refreshToken || !authData.accessExpiry ||
                !authData.refreshExpiry || !authData.user) {
                setLoginError(true);
                return;
            }
            setUserId(authData.userId);
            setAccessToken(authData.accessToken);
            setRefreshToken(authData.refreshToken);
            setAccessExpiry(authData.accessExpiry);
            setRefreshExpiry(authData.refreshExpiry);
            setLoggedInUser(authData.user);
            setUsernameValue('');
            setPasswordValue('');
        } catch (e) {
            setLoginError(true);
            console.error('login error ->', e);
        } finally {
            setLoadingMessage(null);
            setOpenLoad(false)
        }
    };

    if (!accessToken) return (
        <Box style={styles.mainContainer}>
            <img
                src={mode === 'light' ? lightLogo : darkLogo}
                alt="NIFCO"
                width="284"
                height="132"
                style={styles.logo}
            />
            <p style={styles.appTitle}>{`${CONFIG.APP_DISPLAY_NAME} v23.02.07.1`}</p>
            <Box style={styles.form} component='form'>
                <Stack spacing={2}>
                    <TextField
                        type="text"
                        error={loginError}
                        fullWidth
                        label="Username"
                        size='small'
                        value={usernameValue}
                        onChange={e => setUsernameValue(e.target.value)}
                        disabled={loadingMessage != null}
                    />
                    <TextField
                        fullWidth
                        error={loginError}
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        size='small'
                        value={passwordValue}
                        onChange={e => setPasswordValue(e.target.value)}
                        disabled={loadingMessage != null}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        onClick={authenticate}
                        disabled={loadingMessage != null}
                        style={styles.button}
                        className="button-orange"
                    >
                        LOGIN
                    </Button>
                </Stack>
            </Box>
            <Box style={styles.lightBulb}>
                <Typography display='inline'>
                    {mode} mode
                </Typography>
                <Tooltip title="Change Theme" arrow>
                    <IconButton onClick={setTheme} color="inherit">
                        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
    else return <Main/>;
};

const styles = {
    mainContainer: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '100px 10px 0 10px',
        margin: 0,
    },
    appTitle: {
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 30,
    },
    logo: {
        marginBottom: 15,
    },
    form: {
        width: 280,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
    },
    lightBulb: {
        position: 'absolute',
        top: '15px',
        right: '20px',
    }
};

export default Login;