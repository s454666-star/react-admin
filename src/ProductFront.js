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
    Select,
    Snackbar,
    TextField,
    ThemeProvider,
    Toolbar,
    Typography,
    Modal,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import MemberRegister from './MemberRegister'; // 確保導入

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

    // 其他 useEffect 和函數...

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
                                {/* 登入按鈕 */}
                            </>
                        ) : (
                            <Typography variant="body1">歡迎，會員</Typography>
                        )}
                    </Toolbar>
                </AppBar>

                {/* 其他內容... */}

                {/* 使用 MemberRegister 的 Modal */}
                <Modal open={openRegisterModal} onClose={() => setOpenRegisterModal(false)}>
                    <Box sx={{ maxWidth: 500, margin: 'auto', mt: 5 }}>
                        <MemberRegister onClose={() => setOpenRegisterModal(false)} />
                    </Box>
                </Modal>
            </div>
        </ThemeProvider>
    );
};

export default ProductFront;
