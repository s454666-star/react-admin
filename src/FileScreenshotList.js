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
    Alert,
    useMediaQuery
} from '@mui/material';
import {ToggleButton} from '@mui/lab';
import {useParams, useNavigate} from 'react-router-dom';
import ReactPlayer from 'react-player';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import {API_BASE_URL} from './config';
import {useTheme} from '@mui/material/styles';

const FileScreenshotDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [album, setAlbum] = useState(null);
    const [isHolding, setIsHolding] = useState(false);
    const [holdStart, setHoldStart] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [rating, setRating] = useState(0);

    // Theme and media query for responsive adjustments
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}file-screenshots/${id}`);
                const data = await response.json();
                setAlbum(data);
                setRating(Number(data.rating) === 1 ? 1 : 0);
            } catch (error) {
                console.error("Error fetching album:", error);
            }
        };

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

    const handleLongPressStart = (url) => {
        setIsHolding(true);
        setHoldStart(Date.now());
    };

    const handleLongPressEnd = async (url) => {
        setIsHolding(false);
        const holdDuration = Date.now() - holdStart;
        if (holdDuration >= 500) {
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
                    setOpenSnackbar(true);
                }
            } catch (error) {
                console.error('Error updating cover image:', error);
            }
        }
    };

    const handleRatingToggle = async () => {
        const newRating = rating === 1 ? 0 : 1;
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
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isMobile ? 'center' : 'flex-start',
                        gap: isMobile ? '4px' : '8px',
                        flexDirection: isMobile ? 'column' : 'row',
                        textAlign: isMobile ? 'center' : 'left',
                        paddingBottom: isMobile ? '10px' : '20px'
                    }}
                >
                    <Typography
                        variant={isMobile ? 'h6' : 'h5'} // 手機字體較小
                        sx={{color: '#FF69B4', fontSize: isMobile ? '1rem' : '1.2rem'}}
                    >
                        {album.file_name}
                    </Typography>

                    {/* 精選 ToggleButton，縮小按鈕 */}
                    <ToggleButton
                        value="check"
                        selected={rating === 1}
                        onChange={handleRatingToggle}
                        sx={{
                            color: '#FF69B4',
                            padding: isMobile ? '3px 6px' : '4px 8px',
                            fontSize: isMobile ? '0.7rem' : '0.8rem', // 手機字體更小
                            minWidth: 'fit-content',
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
