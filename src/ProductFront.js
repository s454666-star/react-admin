// src/ProductFront.js

import React, {useEffect, useState} from 'react';
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
    Select,
    Snackbar,
    TextField,
    ThemeProvider,
    Toolbar,
    Typography,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {Helmet} from 'react-helmet';
import axios from 'axios';

// 自定義主題（黎明藍）
const appTheme = createTheme({
    palette: {
        primary: {
            main: '#87CEFA', // 黎明藍
        }, background: {
            default: '#f4f6f8',
        },
    },
});

const API_URL = 'https://mystar.monster/api';

const ProductFront = () => {
    const theme = useTheme();

    // 狀態管理
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 取得商品類別
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/product-categories`, {
                    params: {
                        range: JSON.stringify([0, 100]), sort: JSON.stringify(['category_name', 'asc']),
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

    // 取得商品列表
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const range = [0, 100];
                const sort = [sortField, sortDirection];
                const filter = {};

                if (selectedCategory) {
                    filter.category_id = selectedCategory;
                }

                if (searchQuery) {
                    filter.q = searchQuery;
                }

                const response = await axios.get(`${API_URL}/products`, {
                    params: {
                        range: JSON.stringify(range), sort: JSON.stringify(sort), filter: JSON.stringify(filter),
                    },
                });

                setProducts(response.data);
                // 假設後端有回傳 X-Total-Count 標頭
                setTotalProducts(parseInt(response.headers['x-total-count'], 10) || response.data.length);
                setLoading(false);
            } catch (err) {
                setError('無法取得商品列表');
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory, sortField, sortDirection, searchQuery]);

    // 處理分類選擇
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
    };

    // 處理排序欄位變更
    const handleSortFieldChange = (event) => {
        setSortField(event.target.value);
    };

    // 處理排序方向變更
    const handleSortDirectionChange = (event) => {
        setSortDirection(event.target.value);
    };

    // 處理搜尋查詢
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // 關閉錯誤訊息
    const handleCloseError = () => {
        setError('');
    };

    return (<ThemeProvider theme={appTheme}>
            <div>
                <Helmet>
                    <title>星夜商城</title>
                    <link rel="icon" href="/icon_198x278.png" type="image/png"/>
                </Helmet>

                {/* 頁面頂部 AppBar */}
                <AppBar
                    position="static"
                    sx={{marginBottom: theme.spacing(4), backgroundColor: theme.palette.primary.main}}
                >
                    <Toolbar>
                        <Typography variant="h6">星夜電商平台</Typography>
                    </Toolbar>
                </AppBar>

                <Container>
                    {/* 商品分類置於頁面頂部 */}
                    <Box sx={{marginBottom: theme.spacing(4), display: 'flex', overflowX: 'auto'}}>
                        {categories.map((category) => (<Button
                                key={category.id}
                                variant={selectedCategory === category.id ? 'contained' : 'outlined'}
                                color="primary"
                                sx={{marginRight: theme.spacing(2), whiteSpace: 'nowrap'}}
                                onClick={() => handleCategorySelect(category.id)}
                            >
                                {category.category_name}
                            </Button>))}
                    </Box>

                    {/* 篩選與排序 */}
                    <Grid container spacing={2} sx={{marginBottom: theme.spacing(4)}}>
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

                    {/* 商品列表 */}
                    {loading ? (<Box sx={{display: 'flex', justifyContent: 'center', marginTop: theme.spacing(4)}}>
                            <CircularProgress/>
                        </Box>) : (<Grid container spacing={4}>
                            {products.map((product) => (<Grid item key={product.id} xs={12} sm={6} md={4}>
                                    <Card
                                        sx={{
                                            transition: 'transform 0.2s', '&:hover': {
                                                transform: 'scale(1.05)',
                                            },
                                        }}
                                    >
                                        <CardMedia
                                            sx={{
                                                height: 140, backgroundSize: 'contain', marginTop: theme.spacing(2),
                                            }}
                                            image={product.image_base64}
                                            title={product.product_name}
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
                                                {product.status === 'available' ? '可用' : product.status === 'out_of_stock' ? '缺貨' : '已停產'}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" color="primary">
                                                加入購物車
                                            </Button>
                                            <Button size="small" color="primary">
                                                詳細資訊
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>))}
                        </Grid>)}

                    {/* 錯誤訊息 */}
                    <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
                        <Alert onClose={handleCloseError} severity="error" sx={{width: '100%'}}>
                            {error}
                        </Alert>
                    </Snackbar>
                </Container>
            </div>
        </ThemeProvider>);
};

export default ProductFront;
