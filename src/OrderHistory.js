// OrderHistory.js
import React, { useEffect, useState } from 'react';
import {
    Alert,
    AppBar,
    Box,
    Button,
    CircularProgress,
    Container,
    Fade,
    Modal,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Typography,
    useTheme,
    IconButton,
    TextField,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatAmount } from './utils';

const API_URL = 'https://mystar.monster/api';

const OrderHistory = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const [openReturnModal, setOpenReturnModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [returnReason, setReturnReason] = useState('');
    const [returnLoading, setReturnLoading] = useState(false);
    const [returnError, setReturnError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/orders`, {
                    params: {
                        'filter[status_ne]': 'pending',
                        sort: JSON.stringify(['created_at', 'desc']),
                    },
                });
                setOrders(response.data);
                setLoading(false);
            } catch (err) {
                setError('無法取得訂單歷史紀錄');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleOpenReturnModal = (order) => {
        setSelectedOrder(order);
        setOpenReturnModal(true);
    };

    const handleCloseReturnModal = () => {
        setOpenReturnModal(false);
        setSelectedOrder(null);
        setReturnReason('');
        setReturnError('');
    };

    const handleReturnSubmit = async () => {
        if (!returnReason.trim()) {
            setReturnError('請輸入退貨原因');
            return;
        }

        try {
            setReturnLoading(true);
            await axios.post(`${API_URL}/orders/${selectedOrder.id}/return`, {
                reason: returnReason,
            });
            setSnackbar({
                open: true,
                message: '退貨申請成功！',
                severity: 'success',
            });
            setReturnLoading(false);
            handleCloseReturnModal();
            // 更新訂單列表
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === selectedOrder.id ? { ...order, status: 'returned' } : order
                )
            );
        } catch (err) {
            setReturnError('退貨申請失敗，請稍後再試');
            setReturnLoading(false);
            console.error('退貨失敗', err);
        }
    };

    const handleCloseError = () => {
        setError('');
    };

    return (
        <Container sx={{ marginTop: theme.spacing(4), marginBottom: theme.spacing(4) }}>
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
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="back"
                        onClick={() => navigate('/')}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        sx={{
                            flexGrow: 1,
                            color: 'rgb(234 212 241)',
                            fontFamily: 'Roboto Slab, serif',
                            fontWeight: 'bold',
                        }}
                    >
                        訂單歷史紀錄
                    </Typography>
                </Toolbar>
            </AppBar>

            <Typography variant="h4" sx={{ marginBottom: theme.spacing(4), fontWeight: 'bold' }}>
                訂單歷史紀錄
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: theme.spacing(4) }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ fontWeight: 'bold' }}>
                    {error}
                </Alert>
            ) : orders.length === 0 ? (
                <Alert severity="info" sx={{ fontWeight: 'bold' }}>
                    您目前沒有任何歷史訂單。
                </Alert>
            ) : (
                <TableContainer sx={{ boxShadow: 3, borderRadius: 2, backgroundColor: '#ffffff' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#87CEFA' }}>訂單編號</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#87CEFA' }}>日期</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#87CEFA' }}>總金額</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#87CEFA' }}>狀態</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#87CEFA' }}>操作</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{new Date(order.created_at).toLocaleDateString('zh-TW')}</TableCell>
                                    <TableCell>${formatAmount(parseInt(order.total_amount, 10))}</TableCell>
                                    <TableCell>
                                        <Typography
                                            sx={{
                                                color:
                                                    order.status === 'completed'
                                                        ? '#388e3c'
                                                        : order.status === 'canceled'
                                                            ? '#d32f2f'
                                                            : '#ffa000',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {order.status === 'completed'
                                                ? '已完成'
                                                : order.status === 'canceled'
                                                    ? '已取消'
                                                    : '進行中'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {order.status === 'completed' && (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                                onClick={() => handleOpenReturnModal(order)}
                                            >
                                                退貨
                                            </Button>
                                        )}
                                        {order.status !== 'completed' && (
                                            <Typography variant="body2" color="textSecondary">
                                                無法退貨
                                            </Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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

            <Modal open={openReturnModal} onClose={handleCloseReturnModal}>
                <Fade in={openReturnModal}>
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
                        <Typography variant="h6" sx={{ marginBottom: theme.spacing(2), fontWeight: 'bold' }}>
                            退貨申請
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: theme.spacing(2) }}>
                            訂單編號：{selectedOrder?.id}
                        </Typography>
                        <TextField
                            label="退貨原因"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={returnReason}
                            onChange={(e) => setReturnReason(e.target.value)}
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
                                marginBottom: theme.spacing(2),
                            }}
                        />
                        {returnError && (
                            <Alert severity="error" sx={{ marginBottom: theme.spacing(2), fontWeight: 'bold' }}>
                                {returnError}
                            </Alert>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ textTransform: 'none', fontWeight: 'bold', marginRight: theme.spacing(2) }}
                                onClick={handleCloseReturnModal}
                            >
                                取消
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                onClick={handleReturnSubmit}
                                disabled={returnLoading}
                            >
                                {returnLoading ? <CircularProgress size={24} /> : '提交'}
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </Container>
    );
};

export default OrderHistory;
