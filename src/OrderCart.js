import React, { useState, useEffect } from 'react';
import {
    Button,
    Card,
    Container,
    Divider,
    Typography,
    Box,
    Grid,
    IconButton,
    Modal,
} from '@mui/material';
import { Add, Remove, Delete, Edit } from '@mui/icons-material';
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

    // 獲取購物車項目
    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`${API_URL}/cart`);
            setCartItems(response.data.items);
            setTotalAmount(response.data.total_amount);
        } catch (error) {
            console.error('Error fetching cart items:', error);
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

    const handleQuantityChange = async (productId, change) => {
        try {
            await axios.post(`${API_URL}/cart/update`, { product_id: productId, change });
            fetchCartItems();
        } catch (error) {
            console.error('Error updating cart quantity:', error);
        }
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
                                            {item.product_name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            單價：${item.price}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3} display="flex" alignItems="center">
                                        <IconButton onClick={() => handleQuantityChange(item.id, -1)}>
                                            <Remove />
                                        </IconButton>
                                        <Typography>{item.quantity}</Typography>
                                        <IconButton onClick={() => handleQuantityChange(item.id, 1)}>
                                            <Add />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={3} display="flex" justifyContent="flex-end">
                                        <Button
                                            color="error"
                                            onClick={() => handleQuantityChange(item.id, 0)}
                                            startIcon={<Delete />}
                                        >
                                            刪除
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                        <Typography variant="h6" sx={{ paddingTop: 2 }}>
                            小計金額：${totalAmount}
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
        </Container>
    );
};

export default OrderCart;
