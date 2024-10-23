// AlbumDetail.js

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
import {API_BASE_URL} from "./config"; // 引入輔助函數

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
                per_page: 20, // 確保每頁 20 筆
                album_id: albumId,
            };
            const response = await axios.get(`${API_BASE_URL}album-photos`, { params });
            const newPhotos = response.data;

            if (reset) {
                setPhotos(newPhotos);
            } else {
                setPhotos((prev) => [...prev, ...newPhotos]);
            }

            if (newPhotos.length < 20) {
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
                        <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
                            <Box
                                sx={{
                                    border: '1px solid #b39ddb',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: 3,
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <img
                                    src={getFullImageUrl(photo.url)}
                                    alt={photo.title}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                />
                                <Box sx={{ p: 1 }}>
                                    <Typography variant="body1">{photo.title}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </InfiniteScroll>
        </Box>
    );
};

export default AlbumDetail;
