import React, {useState, useEffect} from 'react';
import {
    Container,
    Typography,
    Card,
    CardMedia,
    Grid,
    AppBar,
    Toolbar,
    IconButton,
    Snackbar,
    Alert
} from '@mui/material';
import {ToggleButton} from '@mui/lab'; // Import ToggleButton
import {useParams, useNavigate} from 'react-router-dom';
import ReactPlayer from 'react-player';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import {API_BASE_URL} from './config';

const FileScreenshotDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [album, setAlbum] = useState(null);
    const [isHolding, setIsHolding] = useState(false);
    const [holdStart, setHoldStart] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [rating, setRating] = useState(0); // 評分狀態

    useEffect(() => {
        // Fetch album details
        const fetchAlbum = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}file-screenshots/${id}`);
                const data = await response.json();
                setAlbum(data);
                setRating(Number(data.rating) === 1 ? 1 : 0); // 將 rating 轉為數字並初始化評分狀態
            } catch (error) {
                console.error("Error fetching album:", error);
            }
        };

        // Update is_view status on page load
        const updateIsViewStatus = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}file-screenshots/${id}/is-view`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({is_view: true}),
                });

                if (!response.ok) {
                    console.error('Error updating is_view status');
                }
            } catch (error) {
                console.error('Error updating is_view:', error);
            }
        };

        fetchAlbum();
        updateIsViewStatus();
    }, [id]);

    // Handle long press start for cover image update
    const handleLongPressStart = (url) => {
        setIsHolding(true);
        setHoldStart(Date.now());
    };

    // Handle long press end for cover image update
    const handleLongPressEnd = async (url) => {
        setIsHolding(false);
        const holdDuration = Date.now() - holdStart;
        if (holdDuration >= 500) { // 超過0.5秒
            try {
                const response = await fetch(`${API_BASE_URL}file-screenshots/${id}/cover-image`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({cover_image: url}),
                });

                if (response.ok) {
                    const updatedAlbum = await response.json();
                    setAlbum((prev) => ({...prev, cover_image: updatedAlbum.cover_image}));
                    setOpenSnackbar(true); // 開啟 Snackbar 成功訊息
                }
            } catch (error) {
                console.error('Error updating cover image:', error);
            }
        }
    };

    // Toggle rating (1 or 0) and update API
    const handleRatingToggle = async () => {
        const newRating = rating === 1 ? 0 : 1; // 切換評分狀態
        setRating(newRating);

        try {
            const response = await fetch(`${API_BASE_URL}file-screenshots/${id}/rating`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({rating: newRating}),
            });

            if (!response.ok) {
                console.error('Error updating rating');
            }
        } catch (error) {
            console.error('Error updating rating:', error);
        }
    };

    if (!album) return <Typography>載入中...</Typography>;

    const screenshotUrls = album.screenshot_paths ? album.screenshot_paths.split(',') : [];

    return (
        <div style={{backgroundColor: '#FFE6F1', minHeight: '100vh'}}>
            <AppBar position="sticky" sx={{backgroundColor: '#FFD0FF'}}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
                        <ArrowBackIcon/>
                    </IconButton>
                    <StarOutlineIcon sx={{color: '#FF69B4', marginRight: '8px'}}/>
                    <Typography variant="h6" component="div" sx={{color: '#FF69B4', flexGrow: 1}}>
                        星夜剪影
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container sx={{paddingTop: '20px'}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Typography variant="h4" gutterBottom sx={{color: '#FF69B4', marginRight: '8px'}}>
                        {album.file_name}
                    </Typography>

                    {/* 評分 ToggleButton 放置於標題旁邊 */}
                    <ToggleButton
                        value="check"
                        selected={rating === 1}
                        onChange={handleRatingToggle}
                        sx={{
                            color: '#FF69B4',
                            '&.Mui-selected': {
                                backgroundColor: '#FF69B4',
                                color: '#FFF',
                            },
                        }}
                    >
                        精選
                    </ToggleButton>
                </div>

                <div style={{marginBottom: '20px'}}>
                    <ReactPlayer
                        url={album.file_path}
                        controls
                        width="100%"
                        height="400px"
                        style={{
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(255, 105, 180, 0.4)',
                        }}
                    />
                </div>

                <Grid container spacing={2}>
                    {screenshotUrls.map((url, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                sx={{
                                    maxWidth: 345,
                                    borderRadius: '8px',
                                    backgroundColor: '#FFF0F5',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 4px 20px rgba(255, 105, 180, 0.4)',
                                    },
                                }}
                                onMouseDown={() => handleLongPressStart(url)}
                                onMouseUp={() => handleLongPressEnd(url)}
                                onMouseLeave={() => setIsHolding(false)}
                            >
                                <CardMedia component="img" height="200" image={url} alt={`Screenshot ${index + 1}`}/>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Snackbar for success message */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                >
                    <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{width: '100%'}}>
                        封面圖片已更新
                    </Alert>
                </Snackbar>
            </Container>
        </div>
    );
};

export default FileScreenshotDetail;
