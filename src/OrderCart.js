import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    AppBar,
    Badge,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    createTheme,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Snackbar,
    TextField,
    ThemeProvider,
    Toolbar,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Add, Remove, Delete } from '@mui/icons-material';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import MemberRegister from './MemberRegister'; // 確保正確導入 MemberRegister

const appTheme = createTheme({
    palette: {
        primary: {
            main: '#87CEFA',
        },
        background: {
            default: '#f4f6f8',
        },
        text: {
            primary: '#003366', // 深藍色文字
            secondary: '#00509e',
        },
    },
    typography: {
        fontFamily: 'Roboto Slab, serif',
    },
});

const API_URL = 'https://mystar.monster/api';

const OrderCart = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate(); // 使用 useNavigate 進行跳轉

    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [creditCards, setCreditCards] = useState([]);
    const [isItemsOpen, setIsItemsOpen] = useState(true);
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const [isCreditCardOpen, setIsCreditCardOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openRegisterModal, setOpenRegisterModal] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });
    const [error, setError] = useState('');

    // 設定 axios 預設 headers
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchCartItems();
            fetchAddresses();
            fetchCreditCards();
        }
    }, []);

    // 獲取購物車項目
    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`${API_URL}/orders`, {
                params: {
                    filter: JSON.stringify({ status: 'pending' }),
                },
            });
            if (response.data && response.data.length > 0) {
                const pendingOrder = response.data[0];
                const orderId = pendingOrder.id;
                // Fetch order details with orderItems
                const orderResponse = await axios.get(`${API_URL}/orders/${orderId}`);
                const order = orderResponse.data;
                const items = Array.isArray(order.orderItems) ? order.orderItems : [];
                setCartItems(items);
                setTotalAmount(parseFloat(order.total_amount) || 0);
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
            fetchCartItems(); // 重新獲取購物車資料以更新前端顯示
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

    // 獲取地址
    const fetchAddresses = async () => {
        try {
            const response = await axios.get(`${API_URL}/delivery-addresses`);
            setAddresses(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching addresses:', error);
            setAddresses([]);
        }
    };

    // 獲取信用卡
    const fetchCreditCards = async () => {
        try {
            const response = await axios.get(`${API_URL}/credit-cards`);
            setCreditCards(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching credit cards:', error);
            setCreditCards([]);
        }
    };

    const toggleSection = (section) => {
        if (section === 'items') setIsItemsOpen(!isItemsOpen);
        if (section === 'address') setIsAddressOpen(!isAddressOpen);
        if (section === 'creditCard') setIsCreditCardOpen(!isCreditCardOpen);
    };

    const handleQuantityChange = async (item, change) => {
        const newQuantity = item.quantity + change;
        if (newQuantity < 1) return; // 防止數量小於 1

        try {
            await handleUpdateQuantity(item.order_id, item.id, newQuantity);
        } catch (error) {
            console.error('Error updating cart quantity:', error);
        }
    };

    const handleRemoveItem = async (orderId, itemId) => {
        try {
            // 假設有一個 API 來刪除訂單品項
            await axios.delete(`${API_URL}/orders/${orderId}/items/${itemId}`);
            fetchCartItems(); // 重新獲取購物車資料以更新前端顯示
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

    // 處理會員登入
    const handleLogin = async (email, password) => {
        try {
            // 假設有一個登入 API
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            if (response.data && response.data.token) {
                localStorage.setItem('access_token', response.data.token);
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('email_verified', response.data.email_verified);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                setSnackbar({
                    open: true,
                    message: '登入成功！',
                    severity: 'success',
                });
                setOpenLoginModal(false);
                fetchCartItems();
                fetchAddresses();
                fetchCreditCards();
            } else {
                setSnackbar({
                    open: true,
                    message: '登入失敗，請檢查您的帳號或密碼',
                    severity: 'error',
                });
            }
        } catch (error) {
            console.error('Error during login:', error);
            setSnackbar({
                open: true,
                message: '登入失敗，請稍後再試',
                severity: 'error',
            });
        }
    };

    // 關閉錯誤訊息
    const handleCloseError = () => {
        setError('');
    };

    // 關閉 Snackbar
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
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
                        {/* 新增購物車按鈕 */}
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
                        {!localStorage.getItem('access_token') ? (
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
                                    {localStorage.getItem('username') || '用戶'}
                                </Typography>
                                {!localStorage.getItem('email_verified') && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#d32f2f', // 鮮豔紅色
                                            marginRight: theme.spacing(2),
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        未驗證
                                    </Typography>
                                )}
                                <Button
                                    color="secondary"
                                    onClick={() => {
                                        localStorage.removeItem('access_token');
                                        localStorage.removeItem('username');
                                        localStorage.removeItem('email_verified');
                                        navigate('/');
                                        window.location.reload();
                                    }}
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

                        <Card variant="outlined" sx={{ padding: 2, marginBottom: 3, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">訂單品項</Typography>
                                <Button onClick={() => toggleSection('items')}>
                                    {isItemsOpen ? '隱藏' : '顯示'}
                                </Button>
                            </Box>
                            {isItemsOpen && (
                                <Box>
                                    {cartItems && cartItems.length > 0 ? (
                                        <>
                                            {cartItems.map((item) => (
                                                <Box key={item.id} sx={{ padding: 2, borderBottom: '1px solid #e0e0e0' }}>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item xs={12} sm={6}>
                                                            <Box display="flex" alignItems="center">
                                                                <CardMedia
                                                                    component="img"
                                                                    image={item.product?.image_base64?.startsWith('data:image')
                                                                        ? item.product.image_base64
                                                                        : `data:image/png;base64,${item.product.image_base64}`}
                                                                    alt={item.product?.product_name || '產品圖片'}
                                                                    sx={{ width: 80, height: 80, objectFit: 'contain', marginRight: 2 }}
                                                                />
                                                                <Box>
                                                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                                        {item.product?.product_name || '產品名稱'}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        單價：${parseFloat(item.price).toFixed(2)}
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
                                                            >
                                                                刪除
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            ))}
                                            <Typography variant="h6" sx={{ paddingTop: 2 }}>
                                                小計金額：${parseFloat(totalAmount).toFixed(2)}
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

                        <Card variant="outlined" sx={{ padding: 2, marginBottom: 3, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">配送地址</Typography>
                                <Button onClick={() => toggleSection('address')}>
                                    {isAddressOpen ? '隱藏' : '顯示'}
                                </Button>
                            </Box>
                            {isAddressOpen && (
                                <Box>
                                    {addresses && addresses.length > 0 ? (
                                        <>
                                            {addresses.map((address) => (
                                                <Box key={address.id} sx={{ padding: 1, borderBottom: '1px solid #e0e0e0' }}>
                                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                        {address.recipient}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {address.address}, {address.city}, {address.country}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        電話：{address.phone}
                                                    </Typography>
                                                </Box>
                                            ))}
                                            <Button variant="outlined" onClick={() => setOpenModal(true)}>
                                                新增/編輯地址
                                            </Button>
                                        </>
                                    ) : (
                                        <Typography variant="body1" sx={{ padding: 2 }}>
                                            尚無配送地址。
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </Card>

                        <Card variant="outlined" sx={{ padding: 2, marginBottom: 3, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">付款信用卡</Typography>
                                <Button onClick={() => toggleSection('creditCard')}>
                                    {isCreditCardOpen ? '隱藏' : '顯示'}
                                </Button>
                            </Box>
                            {isCreditCardOpen && (
                                <Box>
                                    {creditCards && creditCards.length > 0 ? (
                                        <>
                                            {creditCards.map((card) => (
                                                <Box key={card.id} sx={{ padding: 1, borderBottom: '1px solid #e0e0e0' }}>
                                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                        {card.cardholder_name} - {card.card_type}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        卡號：{'**** **** **** ' + card.card_number.slice(-4)}
                                                    </Typography>
                                                </Box>
                                            ))}
                                            <Button variant="outlined" onClick={() => setOpenModal(true)}>
                                                新增/編輯信用卡
                                            </Button>
                                        </>
                                    ) : (
                                        <Typography variant="body1" sx={{ padding: 2 }}>
                                            尚無信用卡資料。
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </Card>

                        <Modal open={openModal} onClose={() => setOpenModal(false)}>
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
                                }}
                            >
                                {/* 在這裡放置新增/編輯表單 */}
                                <Typography>表單待實作</Typography>
                            </Box>
                        </Modal>

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

                {/* 一般新增/編輯表單的 Modal */}
                <Modal open={openModal} onClose={() => setOpenModal(false)}>
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
                        }}
                    >
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            新增/編輯表單
                        </Typography>
                        {/* 在這裡放置新增/編輯表單的組件 */}
                        <Typography>表單待實作</Typography>
                    </Box>
                </Modal>

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
                        }}
                    >
                        <Typography variant="h6" component="h2" sx={{ marginBottom: theme.spacing(2), color: theme.palette.text.primary, fontWeight: 'bold' }}>
                            會員登入
                        </Typography>
                        <LoginForm onLogin={handleLogin} loading={false} error={error} />
                    </Box>
                </Modal>
            </div>
        </ThemeProvider>
    );
};

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

export default OrderCart;
