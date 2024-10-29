import React, { useState } from 'react';
import axios from 'axios';
import {
    Button,
    TextField,
    Container,
    Typography,
    Box,
    Alert,
} from '@mui/material';

const API_URL = 'https://mystar.monster/api'; // 根據您的實際 API URL

const MemberRegister = ({ onClose }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/register`, formData);
            setSuccess(response.data.message);
            setError('');
            // 可在此處執行其他操作，例如自動登入或關閉註冊窗口
        } catch (err) {
            setError(err.response.data.message || '註冊失敗');
            setSuccess('');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    會員註冊
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="帳號"
                        name="username"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <TextField
                        label="密碼"
                        name="password"
                        type="password"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <TextField
                        label="姓名"
                        name="name"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        label="電子郵件"
                        name="email"
                        type="email"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        label="電話號碼"
                        name="phone"
                        fullWidth
                        margin="normal"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <TextField
                        label="地址"
                        name="address"
                        fullWidth
                        margin="normal"
                        value={formData.address}
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        註冊
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default MemberRegister;
