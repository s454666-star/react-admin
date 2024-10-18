// src/Login.js
import React, { useState } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
import { TextField, Button } from '@mui/material';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const notify = useNotify();

    const submit = (e) => {
        e.preventDefault();
        login({ username, password }).catch(() => notify('Invalid username or password'));
    };

    return (
        <form onSubmit={submit}>
            <div>
                <TextField
                    label="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            </div>
            <Button type="submit" variant="contained" color="primary">
                Sign in
            </Button>
            <Notification />
        </form>
    );
};

export default Login;
