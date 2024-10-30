import React, {useState} from 'react';
import axios from 'axios';
import {Alert, Box, Button, CircularProgress, Container, Snackbar, TextField, Typography} from '@mui/material';

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
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/register`, formData);
            setSuccess(response.data.message);
            setError('');
            setSnackbarOpen(true);
            if (onClose) onClose();
        } catch (err) {
            const errorMessage = err.response?.data?.errors
                ? Object.values(err.response.data.errors).flat().join(' ')
                : '註冊失敗';
            setError(errorMessage);
            setSuccess('');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
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
                    <Box sx={{position: 'relative', mt: 2}}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                        >
                            註冊
                        </Button>
                        {loading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                    </Box>
                </form>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                    <Alert onClose={handleCloseSnackbar} severity={success ? "success" : "error"}>
                        {success || error}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
};

export default MemberRegister;
