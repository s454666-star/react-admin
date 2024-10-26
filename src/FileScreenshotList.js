// FileScreenshotList.js
import React, {useState, useEffect} from 'react';
import {useRedirect} from 'react-admin';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Card, CardMedia, CardContent, Typography, Grid, AppBar, Toolbar, Box, Chip} from '@mui/material';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import {API_BASE_URL} from './config';

const FileScreenshotList = () => {
    const redirect = useRedirect();

    const [albums, setAlbums] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchAlbums = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}file-screenshots?page=${page}&perPage=20`);
            const result = await response.json();
            const {data} = result;

            if (!Array.isArray(data) || data.length === 0) {
                setHasMore(false);
            } else {
                setAlbums((prev) => [...prev, ...data]);
                setPage((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Failed to fetch albums:", error);
            setHasMore(false);
        }
    };

    useEffect(() => {
        fetchAlbums();
    }, []);

    return (
        <div style={{backgroundColor: '#FFE6F1', minHeight: '100vh'}}>
            <AppBar position="sticky" sx={{backgroundColor: '#FFD0FF'}}>
                <Toolbar>
                    <StarOutlineIcon sx={{color: '#FF69B4', marginRight: '8px'}}/>
                    <Typography variant="h6" component="div" sx={{color: '#FF69B4', flexGrow: 1}}>
                        星夜剪影
                    </Typography>
                </Toolbar>
            </AppBar>

            <InfiniteScroll
                dataLength={albums.length}
                next={fetchAlbums}
                hasMore={hasMore}
                loader={<h4 style={{textAlign: 'center', color: '#FF69B4'}}>載入中...</h4>}
                endMessage={<p style={{textAlign: 'center', color: '#FF69B4'}}>已無更多相簿</p>}
            >
                <Box sx={{marginX: '10%'}}>  {/* 設置 10% 的左右留白 */}
                    <Grid container spacing={2} justifyContent="center">
                        {albums.map((album) => (
                            <Grid item xs={6} sm={4} md={3} key={album.id}  // 電腦版四張，手機版兩張
                                  onClick={() => redirect(`/file-screenshots/${album.id}`)}>
                                <Card sx={{
                                    width: '100%',
                                    borderRadius: '8px',
                                    backgroundColor: '#FFF0F5',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 4px 20px rgba(255, 105, 180, 0.4)',
                                    }
                                }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={album.cover_image || '/default-cover.jpg'}
                                        alt={album.file_name}
                                        sx={{width: '100%'}}
                                    />
                                    <CardContent sx={{display: 'flex', alignItems: 'center'}}>
                                        <Typography variant="body1" component="div" color="#880E4F" fontWeight="bold">
                                            {album.file_name}
                                        </Typography>
                                        {album.is_view && (
                                            <Chip
                                                label="已觀看"
                                                size="small"
                                                sx={{
                                                    ml: 1,
                                                    backgroundColor: '#FF69B4',
                                                    color: '#FFF',
                                                    fontWeight: 'bold',
                                                }}
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </InfiniteScroll>
        </div>
    );
};

export default FileScreenshotList;
