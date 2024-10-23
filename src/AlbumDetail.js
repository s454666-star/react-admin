import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getFullImageUrl } from './utils';
import { API_BASE_URL } from './config';

const AlbumDetail = () => {
    const { albumId } = useParams();
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [album, setAlbum] = useState(null);

    // 判斷是否為視頻文件
    const isVideo = (path) => {
        const ext = path.split('.').pop().toLowerCase();
        return ext === 'mp4' || ext === 'mov';
    };

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
                per_page: 10, // 每頁 10 筆
                album_id: albumId,
            };
            const response = await axios.get(`${API_BASE_URL}album-photos`, { params });
            let newPhotos = response.data;

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
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // 將視頻文件放在最上方
    const sortedPhotos = [...photos].sort((a, b) => {
        const aIsVideo = isVideo(a.photo_path);
        const bIsVideo = isVideo(b.photo_path);
        if (aIsVideo && !bIsVideo) return -1;
        if (!aIsVideo && bIsVideo) return 1;
        return 0;
    });

    return (
        <Box sx={{ padding: 0, margin: 0 }}> {/* 移除多餘的內邊距和外邊距 */}
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
                loader={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CircularProgress />
                    </Box>
                }
                endMessage={
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                        已顯示所有相片
                    </Typography>
                }
                style={{ overflow: 'visible' }} // 防止產生內部滾動條
            >
                {sortedPhotos.map((photo) => (
                    <Box
                        key={photo.id}
                        sx={{
                            width: '100vw',
                            height: '100vh',
                            position: 'relative',
                        }}
                    >
                        {isVideo(photo.photo_path) ? (
                            <video
                                controls
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            >
                                <source src={getFullImageUrl(photo.photo_path)} type={`video/${photo.photo_path.split('.').pop().toLowerCase()}`} />
                                您的瀏覽器不支持視頻標籤。
                            </video>
                        ) : (
                            <img
                                src={getFullImageUrl(photo.photo_path)}
                                alt=""
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        )}
                    </Box>
                ))}
            </InfiniteScroll>
        </Box>
    );
};

export default AlbumDetail;
