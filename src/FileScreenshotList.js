// FileScreenshotList.js
import React, {useState, useEffect} from 'react';
import {useRedirect} from 'react-admin';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Card, CardMedia, CardContent, Typography, Grid, AppBar, Toolbar} from '@mui/material';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import {API_BASE_URL} from './config'; // 引入 API 基礎 URL

const FileScreenshotList = () => {
    const redirect = useRedirect();

    const [albums, setAlbums] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // API 請求，分頁加載相簿資料
    const fetchAlbums = async () => {
        const response = await fetch(`${API_BASE_URL}file-screenshots?page=${page}&perPage=20`);
        const {data, total} = await response.json();

        if (data.length === 0 || albums.length >= total) {
            setHasMore(false);
        } else {
            setAlbums((prev) => [...prev, ...data]);
            setPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        fetchAlbums();
    }, []);

    return (
        <div style={{backgroundColor: '#ffe6f1', minHeight: '100vh'}}>
            {/* 表頭 - 主題欄 */}
            <AppBar position="sticky" color="secondary" sx={{backgroundColor: '#191970'}}>
                <Toolbar>
                    <StarOutlineIcon sx={{color: '#ff69b4', marginRight: '8px'}}/>
                    <Typography variant="h6" component="div" sx={{color: '#ff69b4', flexGrow: 1}}>
                        星夜剪影
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* 相簿列表 */}
            <InfiniteScroll
                dataLength={albums.length}
                next={fetchAlbums}
                hasMore={hasMore}
                loader={<h4 style={{textAlign: 'center', color: '#ff69b4'}}>載入中...</h4>}
                endMessage={<p style={{textAlign: 'center', color: '#ff69b4'}}>已無更多相簿</p>}
            >
                <Grid
                    container
                    spacing={2}
                    sx={{
                        padding: '16px',
                    }}
                >
                    {albums.map((album) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                            key={album.id}
                            onClick={() => redirect(`/file-screenshots/${album.id}`)}
                        >
                            <Card
                                sx={{
                                    maxWidth: 345,
                                    borderRadius: '8px',
                                    backgroundColor: '#fff0f5',
                                    transition: 'transform 0.2s',
                                    '&:hover': {transform: 'scale(1.05)'},
                                }}
                            >
                                {/* 顯示相簿封面 */}
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={album.cover_image || '/default-cover.jpg'}
                                    alt={album.file_name}
                                />
                                <CardContent>
                                    <Typography variant="body1" component="div" color="#191970">
                                        {album.file_name}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </InfiniteScroll>
        </div>
    );
};

export default FileScreenshotList;
