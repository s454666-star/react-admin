import React, { useState, useEffect } from 'react';
import {
    Button,
    Card,
    Container,
    Typography,
    Box,
    Grid,
    IconButton,
    Modal,
    Snackbar,
    Alert,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'https://mystar.monster/api';

const OrderCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [creditCards, setCreditCards] = useState([]);
    const [isItemsOpen, setIsItemsOpen] = useState(true);
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const [isCreditCardOpen, setIsCreditCardOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });
    const [error, setError] = useState('');

    // 獲取購物車項目
    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`${API_URL}/orders`, {
                params: {
                    filter: JSON.stringify({ status: 'pending' }),
                },
            });
            if (response.data.length > 0) {
                const pendingOrder = response.data[0];
                setCartItems(pendingOrder.orderItems);
                setTotalAmount(pendingOrder.total_amount);
            } else {
                setCartItems([]);
                setTotalAmount(0);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setError('無法取得購物車項目');
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
            setAddresses(response.data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    // 獲取信用卡
    const fetchCreditCards = async () => {
        try {
            const response = await axios.get(`${API_URL}/credit-cards`);
            setCreditCards(response.data);
        } catch (error) {
            console.error('Error fetching credit cards:', error);
        }
    };

    useEffect(() => {
        fetchCartItems();
        fetchAddresses();
        fetchCreditCards();
    }, []);

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

    // 關閉錯誤訊息
    const handleCloseError = () => {
        setError('');
    };

    // 關閉 Snackbar
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ fontWeight: 'bold', marginY: 3 }}>
                我的購物車
            </Typography>

            <Card variant="outlined" sx={{ padding: 2, marginBottom: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">訂單品項</Typography>
                    <Button onClick={() => toggleSection('items')}>
                        {isItemsOpen ? '隱藏' : '顯示'}
                    </Button>
                </Box>
                {isItemsOpen && (
                    <Box>
                        {cartItems.map((item) => (
                            <Box key={item.id} sx={{ padding: 2, borderBottom: '1px solid #e0e0e0' }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={6}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            {item.product.product_name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            單價：${item.price}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3} display="flex" alignItems="center">
                                        <IconButton onClick={() => handleQuantityChange(item, -1)}>
                                            <Remove />
                                        </IconButton>
                                        <Typography>{item.quantity}</Typography>
                                        <IconButton onClick={() => handleQuantityChange(item, 1)}>
                                            <Add />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={3} display="flex" justifyContent="flex-end">
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
                            小計金額：${totalAmount.toFixed(2)}
                        </Typography>
                    </Box>
                )}
            </Card>

            <Card variant="outlined" sx={{ padding: 2, marginBottom: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">配送地址</Typography>
                    <Button onClick={() => toggleSection('address')}>
                        {isAddressOpen ? '隱藏' : '顯示'}
                    </Button>
                </Box>
                {isAddressOpen && (
                    <Box>
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
                    </Box>
                )}
            </Card>

            <Card variant="outlined" sx={{ padding: 2, marginBottom: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">付款信用卡</Typography>
                    <Button onClick={() => toggleSection('creditCard')}>
                        {isCreditCardOpen ? '隱藏' : '顯示'}
                    </Button>
                </Box>
                {isCreditCardOpen && (
                    <Box>
                        {creditCards.map((card) => (
                            <Box key={card.id} sx={{ padding: 1, borderBottom: '1px solid #e0e0e0' }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    {card.cardholder_name} - {card.card_type}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    卡號：{card.card_number.slice(-4).padStart(card.card_number.length, '*')}
                                </Typography>
                            </Box>
                        ))}
                        <Button variant="outlined" onClick={() => setOpenModal(true)}>
                            新增/編輯信用卡
                        </Button>
                    </Box>
                )}
            </Card>

            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto' }}>
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
    );
};

export default OrderCart;
