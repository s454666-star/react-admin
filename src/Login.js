import React, { useState } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const notify = useNotify();

    const handleSubmit = (e) => {
        e.preventDefault();
        login({ username, password }).catch(() =>
            notify('無效的用戶名或密碼')
        );
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
        >
            <Card sx={{ minWidth: 300, padding: 2 }}>
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        登入
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="用戶名"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="密碼"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ marginTop: 2 }}
                        >
                            登入
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <Notification />
        </Box>
    );
};

export default Login;
