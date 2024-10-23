import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Grid,
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getFullImageUrl } from './utils';
import { API_BASE_URL } from './config'; // 引入輔助函數

const AlbumDetail = () => {
    const { albumId } = useParams();
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [album, setAlbum] = useState(null);

    useEffect(() => {
        fetchAlbumDetails();
        fetchPhotos(1, albumId, true);
    }, [albumId]);

    const fetchAlbumDetails = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}albums/${albumId}`);
            setAlbum(response.data);
        } catch (error) {
            console.error('Error fetching album details:', error);
        }
    };

    const fetchPhotos = async (pageNumber, albumId, reset = false) => {
        try {
            const params = {
                page: pageNumber,
                per_page: 10, // 改為每頁 10 筆
                album_id: albumId,
            };
            const response = await axios.get(`${API_BASE_URL}album-photos`, { params });
            const newPhotos = response.data;

            if (reset) {
                setPhotos(newPhotos);
            } else {
                setPhotos((prev) => [...prev, ...newPhotos]);
            }

            if (newPhotos.length < 10) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };

    const fetchMoreData = () => {
        const nextPage = page + 1;
        fetchPhotos(nextPage, albumId);
        setPage(nextPage);
    };

    if (!album) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {album.title} - 相簿詳情
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                主題：{album.theme}
            </Typography>
            <InfiniteScroll
                dataLength={photos.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<CircularProgress />}
                endMessage={
                    <Typography variant="body2" color="text.secondary" align="center">
                        已顯示所有相片
                    </Typography>
                }
            >
                <Grid container spacing={2}>
                    {photos.map((photo) => (
                        <Grid item xs={12} key={photo.id}>
                            <Box
                                sx={{
                                    border: '2px solid #b39ddb',
                                    borderRadius: '10px',
                                    overflow: 'hidden',  // 禁止容器內滾動條
                                    boxShadow: 5,
                                    transition: 'transform 0.4s, box-shadow 0.4s',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: 12,
                                    },
                                    maxHeight: 'calc(100vh - 100px)', // 根據螢幕大小限制圖片高度
                                }}
                            >
                                <img
                                    src={getFullImageUrl(photo.photo_path)}
                                    alt=""
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        maxHeight: '100%', // 確保圖片在容器內不超過高度
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </InfiniteScroll>
        </Box>
    );
};

export default AlbumDetail;
