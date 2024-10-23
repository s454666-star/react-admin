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
    const [loadingPhotos, setLoadingPhotos] = useState(false);

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
            setLoadingPhotos(true); // 加載圖片期間設置 loading 狀態
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
        } finally {
            setLoadingPhotos(false); // 結束加載
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
        <Box sx={{ padding: 2, overflow: 'hidden' }}> {/* 確保主容器不產生額外滾動 */}
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
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CircularProgress />
                    </Box>
                }
                endMessage={
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                        已顯示所有相片
                    </Typography>
                }
                // 移除 scrollableTarget 和內部滾動樣式，讓整個頁面使用單一滾動條
            >
                <Grid container spacing={2}>
                    {sortedPhotos.map((photo) => (
                        <Grid item xs={12} sm={6} md={4} key={photo.id}>
                            <Box
                                sx={{
                                    border: '2px solid #b39ddb',
                                    borderRadius: '10px',
                                    overflow: 'hidden', // 禁止容器內滾動條
                                    boxShadow: 5,
                                    transition: 'transform 0.4s, box-shadow 0.4s',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: 12,
                                    },
                                    position: 'relative', // 設定為 relative 以便處理加載動畫
                                    // 移除 maxHeight 以避免內部滾動條
                                }}
                            >
                                {loadingPhotos && (
                                    <CircularProgress
                                        size={60}
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                        }}
                                    />
                                )}
                                {isVideo(photo.photo_path) ? (
                                    <video
                                        controls
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'cover',
                                            display: loadingPhotos ? 'none' : 'block',
                                        }}
                                        onLoadedData={() => setLoadingPhotos(false)}
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
                                            height: 'auto',
                                            objectFit: 'cover',
                                            display: loadingPhotos ? 'none' : 'block', // 在圖片加載前隱藏圖片
                                        }}
                                        onLoad={() => setLoadingPhotos(false)} // 圖片加載完成後隱藏 loading
                                    />
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </InfiniteScroll>
        </Box>
    );
};

export default AlbumDetail;
