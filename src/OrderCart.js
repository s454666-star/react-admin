// OrderCart.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    AppBar,
    Badge,
    Box,
    Button,
    Card,
    CardMedia,
    CircularProgress,
    Container,
    createTheme,
    Grid,
    IconButton,
    Modal,
    Snackbar,
    TextField,
    ThemeProvider,
    Toolbar,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Add, Delete, Remove } from '@mui/icons-material';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import MemberRegister from './MemberRegister';
import DeliveryAddress from './DeliveryAddress';
import CreditCard from './CreditCard';
import { formatAmount } from './utils'; // 引入格式化函數

const appTheme = createTheme({
    palette: {
        primary: {
            main: '#87CEFA',
        },
        background: {
            default: '#f4f6f8',
        },
        text: {
            primary: '#003366',
            secondary: '#00509e',
        },
    },
    typography: {
        fontFamily: 'Roboto Slab, serif',
    },
});

const API_URL = 'https://mystar.monster/api';

// LoginForm 組件
const LoginForm = ({ onLogin, loading, error }) => {
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        await onLogin(email, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="電子郵件"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                    '& .MuiInputLabel-root': {
                        color: theme.palette.text.primary,
                        fontWeight: 'bold',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: theme.palette.text.primary,
                        },
                        '&:hover fieldset': {
                            borderColor: theme.palette.text.secondary,
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: theme.palette.text.secondary,
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: theme.palette.text.primary,
                        fontWeight: 'bold',
                    },
                }}
            />
            <TextField
                label="密碼"
                type="password"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                    '& .MuiInputLabel-root': {
                        color: theme.palette.text.primary,
                        fontWeight: 'bold',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: theme.palette.text.primary,
                        },
                        '&:hover fieldset': {
                            borderColor: theme.palette.text.secondary,
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: theme.palette.text.secondary,
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: theme.palette.text.primary,
                        fontWeight: 'bold',
                    },
                }}
            />
            {error && (
                <Alert severity="error" sx={{ marginTop: theme.spacing(2), fontWeight: 'bold' }}>
                    {error}
                </Alert>
            )}
            <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ marginTop: theme.spacing(2), fontWeight: 'bold', textTransform: 'none' }}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : '登入'}
            </Button>
        </form>
    );
};

const OrderCart = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const [user, setUser] = useState({ id: null, username: '', email_verified: false });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isItemsOpen, setIsItemsOpen] = useState(true);
    const [openRegisterModal, setOpenRegisterModal] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });
    const [error, setError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setIsLoggedIn(true);
            fetchUserInfo();
            fetchCartItems();
        }
    }, []);

    const fetchUserInfo = async () => {
        try {
            setAuthLoading(true);
            const response = await axios.get(`${API_URL}/me`);
            setUser(response.data);
            setIsLoggedIn(true);
            setAuthLoading(false);
        } catch (err) {
            console.error('獲取使用者資訊失敗', err);
            setIsLoggedIn(false);
            setUser({ id: null, username: '', email_verified: false });
            setAuthLoading(false);
        }
    };

    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`${API_URL}/orders`, {
                params: {
                    'filter[status]': 'pending',
                },
            });
            const pendingOrders = response.data.filter(order => order.status === 'pending');
            if (pendingOrders.length > 0) {
                const pendingOrder = pendingOrders[0];
                const items = Array.isArray(pendingOrder.order_items) ? pendingOrder.order_items : [];
                const calculatedTotalAmount = items.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
                setCartItems(items);
                setTotalAmount(calculatedTotalAmount);
            } else {
                setCartItems([]);
                setTotalAmount(0);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setError('無法取得購物車項目');
            setCartItems([]);
            setTotalAmount(0);
        }
    };

    const handleUpdateQuantity = async (orderId, itemId, newQuantity) => {
        try {
            await axios.put(`${API_URL}/orders/${orderId}/items/${itemId}`, {
                quantity: newQuantity,
            });
            fetchCartItems();
            setSnackbar({
                open: true,
                message: '品項數量已更新！',
                severity: 'success',
            });
        } catch (error) {
            console.error('Error updating item quantity:', error);
            setSnackbar({
                open: true,
                message: '無法更新品項數量，請稍後再試。',
                severity: 'error',
            });
        }
    };

    const toggleSection = (section) => {
        if (section === 'items') setIsItemsOpen(!isItemsOpen);
    };

    const handleQuantityChange = async (item, change) => {
        const newQuantity = item.quantity + change;
        if (newQuantity < 1) return;

        try {
            await handleUpdateQuantity(item.order_id, item.id, newQuantity);
        } catch (error) {
            console.error('Error updating cart quantity:', error);
        }
    };

    const handleRemoveItem = async (orderId, itemId) => {
        try {
            await axios.delete(`${API_URL}/orders/${orderId}/items/${itemId}`);
            fetchCartItems();
            setSnackbar({
                open: true,
                message: '品項已刪除！',
                severity: 'success',
            });
        } catch (error) {
            console.error('Error removing cart item:', error);
            setSnackbar({
                open: true,
                message: '無法刪除品項，請稍後再試。',
                severity: 'error',
            });
        }
    };

    const handleLogin = async (email, password) => {
        try {
            setAuthLoading(true);
            const response = await axios.post(`${API_URL}/login`, { email, password }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const { access_token, user } = response.data;
            localStorage.setItem('access_token', access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            setUser(user);
            setIsLoggedIn(true);
            setAuthLoading(false);
            setOpenLoginModal(false);
            fetchCartItems();
            setSnackbar({
                open: true,
                message: '登入成功！',
                severity: 'success',
            });
        } catch (err) {
            console.error('登入失敗', err);
            setLoginError(err.response?.data?.message || '登入失敗，請稍後再試。');
            setAuthLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setAuthLoading(true);
            await axios.post(`${API_URL}/logout`);
            localStorage.removeItem('access_token');
            delete axios.defaults.headers.common['Authorization'];
            setIsLoggedIn(false);
            setUser({ id: null, username: '', email_verified: false });
            setCartItems([]);
            setTotalAmount(0);
            setAuthLoading(false);
            setSnackbar({
                open: true,
                message: '登出成功！',
                severity: 'success',
            });
            navigate('/');
            window.location.reload();
        } catch (error) {
            console.error('登出失敗', error);
            setSnackbar({
                open: true,
                message: '登出失敗，請稍後再試。',
                severity: 'error',
            });
            setAuthLoading(false);
        }
    };

    const handleCloseError = () => {
        setError('');
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            setSnackbar({
                open: true,
                message: '購物車中沒有商品。',
                severity: 'warning',
            });
            return;
        }

        try {
            setAuthLoading(true);
            const response = await axios.post(`${API_URL}/orders/process`);
            if (response.status === 200) {
                setSnackbar({
                    open: true,
                    message: '結帳成功！',
                    severity: 'success',
                });
                setCartItems([]);
                setTotalAmount(0);
                navigate('/product-front');
            }
            setAuthLoading(false);
        } catch (error) {
            console.error('結帳失敗', error);
            setSnackbar({
                open: true,
                message: '結帳失敗，請稍後再試。',
                severity: 'error',
            });
            setAuthLoading(false);
        }
    };

    return (
        <ThemeProvider theme={appTheme}>
            <div>
                <Helmet>
                    <title>我的購物車 - 星夜商城</title>
                    <link rel="icon" href="/icon_198x278.png" type="image/png" />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap"
                        rel="stylesheet"
                    />
                </Helmet>

                <AppBar
                    position="static"
                    sx={{
                        marginBottom: theme.spacing(4),
                        backgroundColor: theme.palette.primary.main,
                        boxShadow: 'none',
                        borderBottom: '1px solid #e0e0e0',
                    }}
                >
                    <Toolbar>
                        <Typography
                            variant={isSmallScreen ? 'h6' : 'h5'}
                            sx={{
                                flexGrow: 1,
                                color: 'rgb(234 212 241)',
                                fontFamily: 'Roboto Slab, serif',
                                fontWeight: 'bold',
                            }}
                        >
                            星夜電商平台
                        </Typography>
                        <Button
                            color="secondary"
                            onClick={() => navigate('/order-cart')}
                            sx={{
                                color: '#f5f6f6',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                marginRight: theme.spacing(2),
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Badge badgeContent={cartItems.length} color="error">
                                <ShoppingCartIcon />
                            </Badge>
                            <Typography variant="body1" sx={{ marginLeft: 1 }}>
                                購物車
                            </Typography>
                        </Button>
                        {!isLoggedIn ? (
                            <>
                                <Button
                                    color="secondary"
                                    onClick={() => setOpenLoginModal(true)}
                                    sx={{
                                        color: '#f5f6f6',
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                    }}
                                >
                                    登入
                                </Button>
                                <Button
                                    color="secondary"
                                    onClick={() => setOpenRegisterModal(true)}
                                    sx={{
                                        color: '#f1f6f4',
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        marginLeft: theme.spacing(1),
                                    }}
                                >
                                    註冊
                                </Button>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        marginRight: theme.spacing(2),
                                        color: '#f7f8fa',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {user.username}
                                </Typography>
                                {!user.email_verified && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#d32f2f',
                                            marginRight: theme.spacing(2),
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        未驗證
                                    </Typography>
                                )}
                                <Button
                                    color="secondary"
                                    onClick={handleLogout}
                                    sx={{
                                        color: '#f7f8fa',
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                    }}
                                >
                                    登出
                                </Button>
                            </Box>
                        )}
                    </Toolbar>
                </AppBar>

                <Box
                    sx={{
                        backgroundImage: 'url(/path/to/background/image.jpg)', // 替換為實際背景圖片路徑
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        paddingY: 5,
                    }}
                >
                    <Container>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', marginY: 3, color: '#003366' }}>
                            我的購物車
                        </Typography>

                        <Card variant="outlined" sx={{ padding: 2, marginBottom: 3, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">訂單品項</Typography>
                                <IconButton onClick={() => toggleSection('items')}>
                                    {isItemsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                            </Box>
                            {isItemsOpen && (
                                <Box>
                                    {cartItems && cartItems.length > 0 ? (
                                        <>
                                            {cartItems.map((item) => {
                                                let imageSrc = '';
                                                if (item.product?.image_base64) {
                                                    if (item.product.image_base64.startsWith('data:image')) {
                                                        imageSrc = item.product.image_base64;
                                                    } else {
                                                        imageSrc = `data:image/png;base64,${item.product.image_base64}`;
                                                    }
                                                } else {
                                                    imageSrc = '/path/to/default/image.png'; // 替換為實際預設圖片路徑
                                                }

                                                return (
                                                    <Box key={item.id} sx={{ padding: 2, borderBottom: '1px solid #e0e0e0' }}>
                                                        <Grid container spacing={2} alignItems="center">
                                                            <Grid item xs={12} sm={6}>
                                                                <Box display="flex" alignItems="center">
                                                                    <CardMedia
                                                                        component="img"
                                                                        image={imageSrc}
                                                                        alt={item.product?.product_name || '產品圖片'}
                                                                        sx={{ width: 80, height: 80, objectFit: 'contain', marginRight: 2, borderRadius: 1 }}
                                                                    />
                                                                    <Box>
                                                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                                            {item.product?.product_name || '產品名稱'}
                                                                        </Typography>
                                                                        <Typography variant="body2" color="textSecondary">
                                                                            單價：${formatAmount(parseFloat(item.price))}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={6} sm={3} display="flex" alignItems="center">
                                                                <IconButton onClick={() => handleQuantityChange(item, -1)}>
                                                                    <Remove />
                                                                </IconButton>
                                                                <Typography sx={{ marginX: 1 }}>{item.quantity}</Typography>
                                                                <IconButton onClick={() => handleQuantityChange(item, 1)}>
                                                                    <Add />
                                                                </IconButton>
                                                            </Grid>
                                                            <Grid item xs={12} sm={3} display="flex" justifyContent="flex-end">
                                                                <Button
                                                                    color="error"
                                                                    onClick={() => handleRemoveItem(item.order_id, item.id)}
                                                                    startIcon={<Delete />}
                                                                    sx={{ fontWeight: 'bold', borderRadius: 2 }}
                                                                >
                                                                    刪除
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                        <Typography variant="h6" sx={{ paddingTop: 2, fontWeight: 'bold' }}>
                                                            小計金額：${formatAmount(parseFloat(item.price) * item.quantity)}
                                                        </Typography>
                                                    </Box>
                                                );
                                            })}
                                            <Typography variant="h6" sx={{ paddingTop: 2, fontWeight: 'bold' }}>
                                                小計金額：${formatAmount(parseFloat(totalAmount))}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography variant="body1" sx={{ padding: 2 }}>
                                            購物車中沒有任何商品。
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </Card>

                        {isLoggedIn && (
                            <>
                                <DeliveryAddress />
                                <CreditCard />
                            </>
                        )}

                        {isLoggedIn && cartItems.length > 0 && (
                            <Box sx={{ textAlign: 'right', marginTop: 4 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCheckout}
                                    sx={{
                                        paddingX: 4,
                                        paddingY: 1.5,
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        borderRadius: 2,
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        transition: 'transform 0.3s, background-color 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            backgroundColor: '#00509e',
                                        },
                                    }}
                                >
                                    結帳
                                </Button>
                            </Box>
                        )}

                        <Snackbar
                            open={snackbar.open}
                            autoHideDuration={6000}
                            onClose={handleCloseSnackbar}
                        >
                            <Alert
                                onClose={handleCloseSnackbar}
                                severity={snackbar.severity}
                                sx={{ width: '100%' }}
                            >
                                {snackbar.message}
                            </Alert>
                        </Snackbar>

                        {error && (
                            <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
                                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%', fontWeight: 'bold' }}>
                                    {error}
                                </Alert>
                            </Snackbar>
                        )}
                    </Container>
                </Box>

                {/* 會員註冊的 Modal */}
                <Modal open={openRegisterModal} onClose={() => setOpenRegisterModal(false)}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: { xs: '90%', sm: 400 },
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                        }}
                    >
                        <MemberRegister onClose={() => setOpenRegisterModal(false)} />
                    </Box>
                </Modal>

                {/* 會員登入的 Modal */}
                <Modal open={openLoginModal} onClose={() => setOpenLoginModal(false)}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: { xs: '90%', sm: 400 },
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="h6" component="h2" sx={{ marginBottom: theme.spacing(2), color: theme.palette.text.primary, fontWeight: 'bold' }}>
                            會員登入
                        </Typography>
                        <LoginForm onLogin={handleLogin} loading={authLoading} error={loginError} />
                    </Box>
                </Modal>
            </div>
        </ThemeProvider>
    );
};

export default OrderCart;