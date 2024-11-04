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
    InputLabel,
    MenuItem,
    Modal,
    Snackbar,
    Select,
    TextField,
    ThemeProvider,
    Toolbar,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
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

const ProductFront = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate(); // 使用 useNavigate 進行跳轉

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

    const [cartItems, setCartItems] = useState([]); // 新增 cartItems 狀態

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
                const items = Array.isArray(pendingOrder.order_items) ? pendingOrder.order_items : [];
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
            console.log('User ID:', user.id); // 調試輸出
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
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { access_token, user } = response.data;
            localStorage.setItem('access_token', access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            setUser(user);
            setIsLoggedIn(true);
            setAuthLoading(false);
            setOpenLoginModal(false);
            fetchCartItems(); // 獲取登入後的購物車數據
            // 顯示登入成功的通知
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

    // 處理登出
    const handleLogout = async () => {
        try {
            setAuthLoading(true);
            await axios.post(`${API_URL}/logout`);
            localStorage.removeItem('access_token');
            delete axios.defaults.headers.common['Authorization'];
            setIsLoggedIn(false);
            setUser({ id: null, username: '', email_verified: false });
            setCartItems([]); // 清空購物車
            setTotalProducts(0);
            setAuthLoading(false);
            // 顯示登出成功的通知
            setSnackbar({
                open: true,
                message: '登出成功！',
                severity: 'success',
            });
        } catch (err) {
            console.error('登出失敗', err);
            setError('登出失敗，請稍後再試。');
            setAuthLoading(false);
        }
    };

    return (
        <ThemeProvider theme={appTheme}>
            <div>
                <Helmet>
                    <title>星夜商城</title>
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

                <Container>
                    <Box sx={{ marginBottom: theme.spacing(4), display: 'flex', overflowX: 'auto' }}>
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={selectedCategory === category.id ? 'contained' : 'outlined'}
                                color="primary"
                                sx={{
                                    marginRight: theme.spacing(2),
                                    whiteSpace: 'nowrap',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                }}
                                onClick={() => handleCategorySelect(category.id)}
                            >
                                {category.category_name}
                            </Button>
                        ))}
                    </Box>

                    <Grid container spacing={2} sx={{ marginBottom: theme.spacing(4) }}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="搜尋商品名稱"
                                variant="outlined"
                                value={searchQuery}
                                onChange={handleSearchChange}
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
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
                                    排序欄位
                                </InputLabel>
                                <Select
                                    value={sortField}
                                    onChange={handleSortFieldChange}
                                    label="排序欄位"
                                    sx={{
                                        '& .MuiSelect-icon': {
                                            color: theme.palette.text.primary,
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: theme.palette.text.primary,
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: theme.palette.text.secondary,
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: theme.palette.text.secondary,
                                        },
                                        color: theme.palette.text.primary,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    <MenuItem value="product_name">商品名稱</MenuItem>
                                    <MenuItem value="price">價格</MenuItem>
                                    <MenuItem value="stock_quantity">庫存數量</MenuItem>
                                    <MenuItem value="id">編號</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
                                    排序方式
                                </InputLabel>
                                <Select
                                    value={sortDirection}
                                    onChange={handleSortDirectionChange}
                                    label="排序方式"
                                    sx={{
                                        '& .MuiSelect-icon': {
                                            color: theme.palette.text.primary,
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: theme.palette.text.primary,
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: theme.palette.text.secondary,
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: theme.palette.text.secondary,
                                        },
                                        color: theme.palette.text.primary,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    <MenuItem value="asc">升冪</MenuItem>
                                    <MenuItem value="desc">降冪</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: theme.spacing(4) }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <Grid container spacing={4}>
                                {products.map((product) => {
                                    // 處理圖片來源
                                    let imageSrc = '';
                                    if (product.image_base64) {
                                        if (product.image_base64.startsWith('data:image')) {
                                            imageSrc = product.image_base64;
                                        } else {
                                            // 假設圖片格式為 PNG，如果有其他格式，請根據實際情況修改
                                            imageSrc = `data:image/png;base64,${product.image_base64}`;
                                        }
                                    } else {
                                        // 設定預設圖片（可選）
                                        imageSrc = '/path/to/default/image.png'; // 請替換為實際預設圖片路徑
                                    }

                                    return (
                                        <Grid item key={product.id} xs={12} sm={6} md={4}>
                                            <Card
                                                sx={{
                                                    transition: 'transform 0.2s',
                                                    '&:hover': {
                                                        transform: 'scale(1.05)',
                                                    },
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    src={imageSrc}
                                                    alt={product.product_name}
                                                    sx={{
                                                        objectFit: 'contain',
                                                        marginTop: theme.spacing(2),
                                                    }}
                                                />
                                                <CardContent sx={{ flexGrow: 1 }}>
                                                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                                        {product.product_name}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                                        價格：${product.price}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                                        庫存：{product.stock_quantity}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                                        狀態：
                                                        {product.status === 'available'
                                                            ? '可用'
                                                            : product.status === 'out_of_stock'
                                                                ? '缺貨'
                                                                : '已停產'}
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button
                                                        size="small"
                                                        color="secondary"
                                                        onClick={() => handleAddToCart(product)}
                                                        sx={{ fontWeight: 'bold', textTransform: 'none' }}
                                                    >
                                                        加入購物車
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        color="secondary"
                                                        sx={{ fontWeight: 'bold', textTransform: 'none' }}
                                                    >
                                                        詳細資訊
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>

                            {/* 顯示購物車內容 */}
                            {cartItems.length > 0 && (
                                <Box sx={{ marginTop: theme.spacing(6) }}>
                                    <Typography variant="h5" sx={{ marginBottom: theme.spacing(2), fontWeight: 'bold' }}>
                                        我的購物車
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {cartItems.map((item) => {
                                            // 處理圖片來源
                                            let imageSrc = '';
                                            if (item.product && item.product.image_base64) {
                                                if (item.product.image_base64.startsWith('data:image')) {
                                                    imageSrc = item.product.image_base64;
                                                } else {
                                                    imageSrc = `data:image/png;base64,${item.product.image_base64}`;
                                                }
                                            } else {
                                                imageSrc = '/path/to/default/image.png'; // 請替換為實際預設圖片路徑
                                            }

                                            return (
                                                <Grid item key={item.id} xs={12} sm={6} md={4}>
                                                    <Card
                                                        sx={{
                                                            transition: 'transform 0.2s',
                                                            '&:hover': {
                                                                transform: 'scale(1.05)',
                                                            },
                                                            height: '100%',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                        }}
                                                    >
                                                        <CardMedia
                                                            component="img"
                                                            height="140"
                                                            src={imageSrc}
                                                            alt={item.product?.product_name || '商品名稱'}
                                                            sx={{
                                                                objectFit: 'contain',
                                                                marginTop: theme.spacing(2),
                                                            }}
                                                        />
                                                        <CardContent sx={{ flexGrow: 1 }}>
                                                            <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                                                {item.product?.product_name || '未知商品'}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                                                價格：${item.price}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                                                數量：{item.quantity}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                                                小計：${(item.price * item.quantity).toFixed(2)}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardActions>
                                                            <Button
                                                                size="small"
                                                                color="secondary"
                                                                onClick={() => handleAddToCart(item.product)}
                                                                sx={{ fontWeight: 'bold', textTransform: 'none' }}
                                                            >
                                                                加入更多
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                color="secondary"
                                                                onClick={() => navigate('/order-cart')}
                                                                sx={{ fontWeight: 'bold', textTransform: 'none' }}
                                                            >
                                                                前往購物車
                                                            </Button>
                                                        </CardActions>
                                                    </Card>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </Box>
                            )}
                        </>
                    )}

                    <Snackbar
                        open={snackbar.open}
                        autoHideDuration={6000}
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                    >
                        <Alert
                            onClose={() => setSnackbar({ ...snackbar, open: false })}
                            severity={snackbar.severity}
                            sx={{ width: '100%' }}
                        >
                            {snackbar.message}
                        </Alert>
                    </Snackbar>

                    <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
                        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%', fontWeight: 'bold' }}>
                            {error}
                        </Alert>
                    </Snackbar>
                </Container>

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

    const handleSubmit = (event) => {
        event.preventDefault();
        onLogin(email, password);
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
