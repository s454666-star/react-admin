import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    TextField,
    Typography,
    Fade,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'https://mystar.monster/api';

const CreditCard = () => {
    const [creditCards, setCreditCards] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [currentCard, setCurrentCard] = useState(null);
    const [formData, setFormData] = useState({
        cardholder_name: '',
        card_number: '',
        expiry_date: '',
        card_type: '',
        billing_address: '',
        postal_code: '',
        country: 'Taiwan',
        is_default: false,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCreditCards();
    }, []);

    const fetchCreditCards = async () => {
        try {
            const response = await axios.get(`${API_URL}/credit-cards`);
            setCreditCards(response.data);
        } catch (err) {
            console.error('Error fetching credit cards:', err);
            setError('無法取得信用卡資料');
        }
    };

    const handleOpenModal = (card = null) => {
        if (card) {
            setCurrentCard(card);
            setFormData({
                cardholder_name: card.cardholder_name || '',
                card_number: card.card_number || '',
                expiry_date: card.expiry_date || '',
                card_type: card.card_type || '',
                billing_address: card.billing_address || '',
                postal_code: card.postal_code || '',
                country: card.country || 'Taiwan',
                is_default: card.is_default === 1,
            });
        } else {
            setCurrentCard(null);
            setFormData({
                cardholder_name: '',
                card_number: '',
                expiry_date: '',
                card_type: '',
                billing_address: '',
                postal_code: '',
                country: 'Taiwan',
                is_default: false,
            });
        }
        setError('');
        setSuccess('');
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/credit-cards/${id}`);
            fetchCreditCards();
            setSuccess('信用卡已刪除');
        } catch (err) {
            console.error('Error deleting credit card:', err);
            setError('無法刪除信用卡');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentCard) {
                await axios.put(`${API_URL}/credit-cards/${currentCard.id}`, formData);
                setSuccess('信用卡已更新');
            } else {
                await axios.post(`${API_URL}/credit-cards`, formData);
                setSuccess('信用卡已新增');
            }
            fetchCreditCards();
            handleCloseModal();
        } catch (err) {
            console.error('Error saving credit card:', err);
            setError('無法保存信用卡資料');
        }
    };

    return (
        <Box sx={{ marginBottom: 3 }}>
            <Card variant="outlined" sx={{ padding: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">付款信用卡</Typography>
                    <Button variant="outlined" startIcon={<Add />} onClick={() => handleOpenModal()}>
                        新增
                    </Button>
                </Box>
                <Box>
                    {creditCards && creditCards.length > 0 ? (
                        creditCards.map((card) => (
                            <Card key={card.id} variant="outlined" sx={{ marginTop: 2, transition: 'background-color 0.3s' }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={8}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                                {card.cardholder_name} - {card.card_type}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                卡號：{'**** **** **** ' + (card.card_number ? card.card_number.slice(-4) : '****')}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                到期日：{card.expiry_date}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                帳單地址：{card.billing_address}, {card.country}
                                            </Typography>
                                            {card.is_default === 1 && (
                                                <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                                                    主要信用卡
                                                </Typography>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={4} display="flex" justifyContent="flex-end">
                                            <IconButton onClick={() => handleOpenModal(card)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(card.id)}>
                                                <Delete />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ padding: 2, color: '#757575' }}>
                            尚無信用卡資料。
                        </Typography>
                    )}
                </Box>
                {error && (
                    <Alert severity="error" sx={{ marginTop: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ marginTop: 2 }}>
                        {success}
                    </Alert>
                )}
            </Card>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
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
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        {currentCard ? '編輯信用卡' : '新增信用卡'}
                    </Typography>
                    <TextField
                        label="持卡人姓名"
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.cardholder_name}
                        onChange={(e) => setFormData({ ...formData, cardholder_name: e.target.value })}
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
                        label="信用卡號"
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.card_number}
                        onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
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
                        label="到期日 (MM/YY)"
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.expiry_date}
                        onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
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
                    <FormControl variant="outlined" fullWidth required margin="normal">
                        <InputLabel sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>信用卡類型</InputLabel>
                        <Select
                            value={formData.card_type}
                            onChange={(e) => setFormData({ ...formData, card_type: e.target.value })}
                            label="信用卡類型"
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
                            <MenuItem value="Visa">Visa</MenuItem>
                            <MenuItem value="MasterCard">MasterCard</MenuItem>
                            <MenuItem value="American Express">American Express</MenuItem>
                            <MenuItem value="Discover">Discover</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="帳單地址"
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.billing_address}
                        onChange={(e) => setFormData({ ...formData, billing_address: e.target.value })}
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
                        label="郵遞區號"
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.postal_code}
                        onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
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
                        label="國家"
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
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
                    <Box display="flex" alignItems="center" marginTop={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{ marginRight: 2, fontWeight: 'bold', textTransform: 'none' }}
                        >
                            {currentCard ? '更新' : '新增'}
                        </Button>
                        <Button variant="outlined" onClick={handleCloseModal} sx={{ fontWeight: 'bold', textTransform: 'none' }}>
                            取消
                        </Button>
                    </Box>
                    {error && (
                        <Alert severity="error" sx={{ marginTop: 2 }}>
                            {error}
                        </Alert>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default CreditCard;
