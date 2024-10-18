// src/Login.js
import React, { useState } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
import { TextField, Button, Grid, Paper, Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { keyframes } from '@emotion/react';

// 定義淡入動畫
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 使用 makeStyles 創建樣式
const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
    },
    paper: {
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: `${fadeIn} 1s ease-out`,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '15px',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        color: '#fff',
        '&:hover': {
            background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
        },
    },
    title: {
        marginBottom: theme.spacing(2),
        color: '#333',
    },
}));

const Login = () => {
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const notify = useNotify();

    const submit = (e) => {
        e.preventDefault();
        login({ username, password }).catch(() => notify('Invalid username or password', 'warning'));
    };

    return (
        <Grid container className={classes.root} justifyContent="center" alignItems="center">
            <Grid item xs={10} sm={8} md={4}>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h5" className={classes.title}>
                        登入
                    </Typography>
                    <form className={classes.form} onSubmit={submit} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="用戶名"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="密碼"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            className={classes.submit}
                        >
                            登入
                        </Button>
                    </form>
                    <Notification />
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Login;
