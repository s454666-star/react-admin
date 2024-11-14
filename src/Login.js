import React, { useState } from 'react';
import { useNotify } from 'react-admin';
import { TextField, Button, Grid, Paper, Typography, Box } from '@mui/material';
import axios from 'axios';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';

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

// 使用動畫的樣式化 Paper 元件
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    animation: `${fadeIn} 1s ease-out`,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '15px',
}));

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const notify = useNotify();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://mystar.monster/api/admin-login', {
                username,
                password,
            }, {
                withCredentials: true,
            });
            const { access_token, user } = response.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = '/';
        } catch (error) {
            if (error.response && error.response.status === 401) {
                notify('無效的用戶名或密碼', 'warning');
            } else {
                notify('登入失敗，請稍後再試', 'warning');
            }
        }
    };

    return (
        <Grid
            container
            sx={{
                height: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
            }}
            justifyContent="center"
            alignItems="center"
        >
            <Grid item xs={10} sm={8} md={4}>
                <StyledPaper>
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{ marginBottom: 2, color: '#333' }}
                    >
                        登入
                    </Typography>
                    <Box
                        component="form"
                        sx={{ width: '100%', marginTop: 1 }}
                        onSubmit={handleSubmit}
                        noValidate
                    >
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
                            sx={{
                                margin: (theme) => theme.spacing(3, 0, 2),
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                color: '#fff',
                                '&:hover': {
                                    background:
                                        'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
                                },
                            }}
                        >
                            登入
                        </Button>
                    </Box>
                </StyledPaper>
            </Grid>
        </Grid>
    );
};

export default Login;
