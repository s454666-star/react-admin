import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Container, Typography, Card, CardMedia, Grid, AppBar, Toolbar, IconButton} from '@mui/material';
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

    useEffect(() => {
        const fetchAlbum = async () => {
            const response = await fetch(`${API_BASE_URL}file-screenshots/${id}`);
            const data = await response.json();
            setAlbum(data);
        };
        fetchAlbum();
    }, [id]);

    const handleLongPressStart = (url) => {
        setIsHolding(true);
        setHoldStart(Date.now());
    };

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
                    setAlbum((prev) => ({...prev, cover_image: url}));
                    alert('封面圖片已更新');
                } else {
                    alert('更新失敗');
                }
            } catch (error) {
                console.error('Error updating cover image:', error);
                alert('更新失敗');
            }
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
                <Typography variant="h4" gutterBottom sx={{color: '#FF69B4'}}>
                    {album.file_name}
                </Typography>

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
                                    }
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
            </Container>
        </div>
    );
};

export default FileScreenshotDetail;
