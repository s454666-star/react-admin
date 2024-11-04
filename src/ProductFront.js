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
    Fade,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import MemberRegister from './MemberRegister';
import LoginForm from './LoginForm';

const appTheme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
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
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    transition: 'background-color 0.3s, transform 0.3s',
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    },
                },
            },
        },
    },
});

const API_URL = 'https://mystar.monster/api';

const ProductFront = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openRegisterModal, setOpenRegisterModal] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({ id: null, username: '', email_verified: false });

    const [authLoading, setAuthLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const [cartItems, setCartItems] = useState([]);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // 設定 axios 預設 headers
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setIsLoggedIn(true);
            fetchUserInfo();
            fetchCartItems();
        }
    }, []);

    // 獲取使用者資訊
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

    // 獲取購物車品項數量
    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`${API_URL}/orders`, {
                params: {
                    filter: JSON.stringify({ status: 'pending' }),
                },
            });
            if (response.data.length > 0) {
                const pendingOrder = response.data[0];
                const items = Array.isArray(pendingOrder.orderItems) ? pendingOrder.orderItems : [];
                setCartItems(items);
                setTotalProducts(items.length);
            } else {
                setCartItems([]);
                setTotalProducts(0);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setCartItems([]);
            setTotalProducts(0);
        }
    };

    // 獲取商品類別
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/product-categories`, {
                    params: {
                        range: JSON.stringify([0, 100]),
                        sort: JSON.stringify(['category_name', 'asc']),
                    },
                });
                setCategories(response.data);
                setLoading(false);
            } catch (err) {
                setError('無法取得商品類別');
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // 獲取商品列表
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const range = [0, 100];
                const sort = [sortField, sortDirection];

                const filter = {};
                if (selectedCategory !== null) filter.category_id = selectedCategory;
                if (searchQuery) filter.q = searchQuery;

                const params = {
                    range: JSON.stringify(range),
                    sort: JSON.stringify(sort),
                };

                if (Object.keys(filter).length > 0) {
                    params.filter = JSON.stringify(filter);
                }

                const response = await axios.get(`${API_URL}/products`, { params });

                setProducts(response.data);
                setTotalProducts(parseInt(response.headers['x-total-count'], 10) || response.data.length);
                setLoading(false);
            } catch (err) {
                setError('無法取得商品列表');
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory, sortField, sortDirection, searchQuery]);

    // 選擇商品類別
    const handleCategorySelect = (categoryId) => {
        const numericCategoryId = Number(categoryId);
        setSelectedCategory((prevCategory) =>
            prevCategory === numericCategoryId ? null : numericCategoryId
        );
    };

    // 更改排序欄位
    const handleSortFieldChange = (event) => {
        setSortField(event.target.value);
    };

    // 更改排序方式
    const handleSortDirectionChange = (event) => {
        setSortDirection(event.target.value);
    };

    // 搜尋商品名稱
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // 關閉錯誤訊息
    const handleCloseError = () => {
        setError('');
    };

    // 加入購物車
    const handleAddToCart = async (product) => {
        if (!isLoggedIn) {
            setOpenLoginModal(true);
        } else {
            try {
                await axios.post(`${API_URL}/orders`, {
                    product_id: product.id,
                    quantity: 1,
                    price: product.price,
                });
                fetchCartItems(); // 更新購物車數量
                // 顯示加入購物車成功的通知
                setSnackbar({
                    open: true,
                    message: '商品已成功加入購物車！',
                    severity: 'success',
                });
            } catch (err) {
                if (err.response && err.response.data && err.response.data.errors) {
                    const memberIdError = err.response.data.errors.member_id;
                    if (memberIdError) {
                        setError('請先登入以加入購物車。');
                    } else {
                        setError('無法加入購物車，請稍後再試');
                    }
                } else {
                    setError('無法加入購物車，請稍後再試');
                }
                console.error('加入購物車失敗', err);
            }
        }
    };

    // 處理登入
    const handleLogin = async (email, password) => {
        try {
            setAuthLoading(true);
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            if (response.data && response.data.token) {
                localStorage.setItem('access_token', response.data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                setUser({
                    id: response.data.user.id,
                    username: response.data.user.username,
                    email_verified: response.data.user.email_verified,
                });
                setIsLoggedIn(true);
                setSnackbar({
                    open: true,
                    message: '登入成功！',
                    severity: 'success',
                });
                setOpenLoginModal(false);
                fetchCartItems();
                setAuthLoading(false);
            } else {
                setSnackbar({
                    open: true,
                    message: '登入失敗，請檢查您的帳號或密碼',
                    severity: 'error',
                });
                setAuthLoading(false);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setSnackbar({
                open: true,
                message: '登入失敗，請稍後再試',
                severity: 'error',
            });
            setAuthLoading(false);
        }
    };

    // 處理登出
    const handleLogout = async () => {
        try {
            setAuthLoading(true);
            await axios.post(`${API_URL}/auth/logout`);
            localStorage.removeItem('access_token');
            delete axios.defaults.headers.common['Authorization'];
            setIsLoggedIn(false);
            setUser({ id: null, username: '', email_verified: false });
            setCartItems([]);
            setTotalProducts(0);
            setSnackbar({
                open: true,
                message: '登出成功！',
                severity: 'success',
            });
            setAuthLoading(false);
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
                                transition: 'color 0.3s',
                                '&:hover': {
                                    color: theme.palette.secondary.main,
                                },
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
                                        transition: 'color 0.3s',
                                        '&:hover': {
                                            color: theme.palette.secondary.main,
                                        },
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
                                        transition: 'color 0.3s',
                                        '&:hover': {
                                            color: theme.palette.secondary.main,
                                        },
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
                                        transition: 'color 0.3s',
                                        '&:hover': {
                                            color: theme.palette.secondary.main,
                                        },
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
                        backgroundImage: 'url(/path/to/background/image.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        paddingY: 5,
                        minHeight: '80vh',
                        transition: 'background-image 0.5s ease-in-out',
                    }}
                >
                    <Container>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', marginY: 3, color: '#003366' }}>
                            我的購物車
                        </Typography>

                        <Card variant="outlined" sx={{ padding: 2, marginBottom: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
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
                                            {cartItems.map((item) => (
                                                <Box key={item.id} sx={{ padding: 2, borderBottom: '1px solid #e0e0e0', transition: 'background-color 0.3s' }}
                                                     onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                                     onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item xs={12} sm={6}>
                                                            <Box display="flex" alignItems="center">
                                                                <CardMedia
                                                                    component="img"
                                                                    image={
                                                                        item.product?.image_base64?.startsWith('data:image')
                                                                            ? item.product.image_base64
                                                                            : `data:image/png;base64,${item.product.image_base64}`
                                                                    }
                                                                    alt={item.product?.product_name || '產品圖片'}
                                                                    sx={{ width: 80, height: 80, objectFit: 'contain', marginRight: 2, borderRadius: 2 }}
                                                                />
                                                                <Box>
                                                                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                                                        {item.product?.product_name || '產品名稱'}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        單價：${parseFloat(item.price).toFixed(2)}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={6} sm={3} display="flex" alignItems="center">
                                                            <IconButton onClick={() => handleQuantityChange(item, -1)} color="secondary">
                                                                <Remove />
                                                            </IconButton>
                                                            <Typography sx={{ marginX: 1 }}>{item.quantity}</Typography>
                                                            <IconButton onClick={() => handleQuantityChange(item, 1)} color="secondary">
                                                                <Add />
                                                            </IconButton>
                                                        </Grid>
                                                        <Grid item xs={12} sm={3} display="flex" justifyContent="flex-end">
                                                            <Button
                                                                color="error"
                                                                onClick={() => handleRemoveItem(item.order_id, item.id)}
                                                                startIcon={<Delete />}
                                                                sx={{
                                                                    fontWeight: 'bold',
                                                                    textTransform: 'none',
                                                                    transition: 'background-color 0.3s',
                                                                    '&:hover': {
                                                                        backgroundColor: '#ffebee',
                                                                    },
                                                                }}
                                                            >
                                                                刪除
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            ))}
                                            <Typography variant="h6" sx={{ paddingTop: 2, color: '#d32f2f', fontWeight: 'bold' }}>
                                                小計金額：${parseFloat(totalAmount).toFixed(2)}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography variant="body1" sx={{ padding: 2, color: '#757575' }}>
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

                        <Snackbar
                            open={snackbar.open}
                            autoHideDuration={6000}
                            onClose={handleCloseSnackbar}
                            TransitionComponent={Fade}
                        >
                            <Alert
                                onClose={handleCloseSnackbar}
                                severity={snackbar.severity}
                                sx={{ width: '100%', fontWeight: 'bold' }}
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
                        component={Fade}
                        timeout={500}
                    >
                        <MemberRegister onClose={() => setOpenRegisterModal(false)} />
                    </Box>
                </Modal>

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
                        component={Fade}
                        timeout={500}
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

export default ProductFront;
