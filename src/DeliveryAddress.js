import React, {useEffect, useState} from 'react';
import {Alert, Box, Button, Card, CardContent, Grid, IconButton, Modal, TextField, Typography,} from '@mui/material';
import {Add, Delete, Edit} from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'https://mystar.monster/api';

const DeliveryAddress = () => {
    const [addresses, setAddresses] = useState([]);
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [formData, setFormData] = useState({
        recipient: '',
        phone: '',
        address: '',
        postal_code: '',
        country: 'Taiwan',
        city: '',
        is_default: false,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await axios.get(`${API_URL}/delivery-addresses`);
            setAddresses(response.data);
        } catch (err) {
            console.error('Error fetching addresses:', err);
            setError('無法取得配送地址');
        }
    };

    const handleOpenModal = (address = null) => {
        if (address) {
            setCurrentAddress(address);
            setFormData({
                recipient: address.recipient,
                phone: address.phone,
                address: address.address,
                postal_code: address.postal_code,
                country: address.country || 'Taiwan',
                city: address.city,
                is_default: address.is_default === 1,
            });
        } else {
            setCurrentAddress(null);
            setFormData({
                recipient: '',
                phone: '',
                address: '',
                postal_code: '',
                country: 'Taiwan',
                city: '',
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
            await axios.delete(`${API_URL}/delivery-addresses/${id}`);
            fetchAddresses();
            setSuccess('配送地址已刪除');
        } catch (err) {
            console.error('Error deleting address:', err);
            setError('無法刪除配送地址');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentAddress) {
                await axios.put(`${API_URL}/delivery-addresses/${currentAddress.id}`, formData);
                setSuccess('配送地址已更新');
            } else {
                await axios.post(`${API_URL}/delivery-addresses`, formData);
                setSuccess('配送地址已新增');
            }
            fetchAddresses();
            handleCloseModal();
        } catch (err) {
            console.error('Error saving address:', err);
            setError('無法保存配送地址');
        }
    };

    return (
        <Box sx={{marginBottom: 3}}>
            <Card variant="outlined" sx={{padding: 2, backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">配送地址</Typography>
                    <Button variant="outlined" startIcon={<Add/>} onClick={() => handleOpenModal()}>
                        新增
                    </Button>
                </Box>
                <Box>
                    {addresses && addresses.length > 0 ? (
                        addresses.map((address) => (
                            <Card key={address.id} variant="outlined" sx={{marginTop: 2}}>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={8}>
                                            <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                                                {address.recipient}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {address.address}, {address.city}, {address.country}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                電話：{address.phone}
                                            </Typography>
                                            {address.is_default === 1 && (
                                                <Typography variant="body2" color="primary" sx={{fontWeight: 'bold'}}>
                                                    主要地址
                                                </Typography>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={4} display="flex" justifyContent="flex-end">
                                            <IconButton onClick={() => handleOpenModal(address)}>
                                                <Edit/>
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(address.id)}>
                                                <Delete/>
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="body1" sx={{padding: 2}}>
                            尚無配送地址。
                        </Typography>
                    )}
                </Box>
                {error && (
                    <Alert severity="error" sx={{marginTop: 2}}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{marginTop: 2}}>
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
                        width: {xs: '90%', sm: 400},
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" sx={{marginBottom: 2}}>
                        {currentAddress ? '編輯配送地址' : '新增配送地址'}
                    </Typography>
                    <TextField
                        label="收件人姓名"
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.recipient}
                        onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                    />
                    <TextField
                        label="電話號碼"
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                    <TextField
                        label="地址"
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                    <TextField
                        label="郵遞區號"
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.postal_code}
                        onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                    />
                    <TextField
                        label="城市"
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                    <TextField
                        label="國家"
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                    />
                    <Box display="flex" alignItems="center" marginTop={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{marginRight: 2}}
                        >
                            {currentAddress ? '更新' : '新增'}
                        </Button>
                        <Button variant="outlined" onClick={handleCloseModal}>
                            取消
                        </Button>
                    </Box>
                    {error && (
                        <Alert severity="error" sx={{marginTop: 2}}>
                            {error}
                        </Alert>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default DeliveryAddress;
