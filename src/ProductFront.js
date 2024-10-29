import React, { useEffect, useState } from 'react';
import {
    Alert,
    AppBar,
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
    Select,
    Snackbar,
    TextField,
    ThemeProvider,
    Toolbar,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
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
    },
});

const API_URL = 'https://mystar.monster/api';

const ProductFront = () => {
    const theme = useTheme();

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
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 根據實際情況設定

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

    const handleCategorySelect = (categoryId) => {
        const numericCategoryId = Number(categoryId);
        setSelectedCategory((prevCategory) =>
            prevCategory === numericCategoryId ? null : numericCategoryId
        );
    };

    const handleSortFieldChange = (event) => {
        setSortField(event.target.value);
    };

    const handleSortDirectionChange = (event) => {
        setSortDirection(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleCloseError = () => {
        setError('');
    };

    const handleAddToCart = (product) => {
        if (!isLoggedIn) {
            setOpenRegisterModal(true);
        } else {
            // 加入購物車的邏輯
        }
    };

    return (
        <ThemeProvider theme={appTheme}>
            <div>
                <Helmet>
                    <title>星夜商城</title>
                    <link rel="icon" href="/icon_198x278.png" type="image/png" />
                </Helmet>

                <AppBar
                    position="static"
                    sx={{ marginBottom: theme.spacing(4), backgroundColor: theme.palette.primary.main }}
                >
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            星夜電商平台
                        </Typography>
                        {!isLoggedIn ? (
                            <>
                                <Button color="inherit" onClick={() => setOpenRegisterModal(true)}>
                                    註冊
                                </Button>
                                {/* 登入按鈕，可自行添加 */}
                            </>
                        ) : (
                            <Typography variant="body1">歡迎，會員</Typography>
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
                                sx={{ marginRight: theme.spacing(2), whiteSpace: 'nowrap' }}
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
                            />
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>排序欄位</InputLabel>
                                <Select value={sortField} onChange={handleSortFieldChange} label="排序欄位">
                                    <MenuItem value="product_name">商品名稱</MenuItem>
                                    <MenuItem value="price">價格</MenuItem>
                                    <MenuItem value="stock_quantity">庫存數量</MenuItem>
                                    <MenuItem value="id">編號</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>排序方式</InputLabel>
                                <Select value={sortDirection} onChange={handleSortDirectionChange} label="排序方式">
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
                                            <CardContent>
                                                <Typography gutterBottom variant="h6" component="div">
                                                    {product.product_name}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    價格：${product.price}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    庫存：{product.stock_quantity}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    狀態：
                                                    {product.status === 'available'
                                                        ? '可用'
                                                        : product.status === 'out_of_stock'
                                                            ? '缺貨'
                                                            : '已停產'}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" color="primary" onClick={() => handleAddToCart(product)}>
                                                    加入購物車
                                                </Button>
                                                <Button size="small" color="primary">
                                                    詳細資訊
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}

                    <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
                        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                            {error}
                        </Alert>
                    </Snackbar>
                </Container>

                {/* 會員註冊的 Modal */}
                <Modal open={openRegisterModal} onClose={() => setOpenRegisterModal(false)}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <MemberRegister onClose={() => setOpenRegisterModal(false)} />
                    </Box>
                </Modal>
            </div>
        </ThemeProvider>
    );
};

export default ProductFront;
