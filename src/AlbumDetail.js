import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getFullImageUrl } from './utils';
import { API_BASE_URL } from './config';

const AlbumDetail = () => {
    const { albumId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { albumTitleFromMain, albumThemeFromMain } = location.state || {};
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
            console.error('取得相簿詳情時發生錯誤:', error);
        }
    };

    const fetchPhotos = async (pageNumber, albumId, reset = false) => {
        try {
            const params = {
                page: pageNumber,
                per_page: 10,
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
                // 在所有相片加載完畢後，更新 is_viewed 狀態
                updateIsViewedStatus();
            }
        } catch (error) {
            console.error('取得相片時發生錯誤:', error);
        }
    };

    const updateIsViewedStatus = async () => {
        try {
            await axios.put(`${API_BASE_URL}albums/${albumId}/updateIsViewed`, {
                is_viewed: true,
            });
            console.log('相簿已更新為已瀏覽');
        } catch (error) {
            console.error('更新相簿狀態時發生錯誤:', error);
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
        <Box
            sx={{
                padding: 2,
                marginX: {
                    xs: '0%',
                    md: '20%',
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ marginRight: 2 }}
                >
                    返回上頁
                </Button>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontSize: {
                            xs: '1.5rem',
                            md: '2.5rem',
                        },
                    }}
                >
                    {albumTitleFromMain || album.title}
                </Typography>
            </Box>
            <Typography
                variant="h5"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    color: 'text.secondary',
                    fontSize: {
                        xs: '1.2rem',
                        md: '2rem',
                    },
                }}
            >
                {albumThemeFromMain || album.name}
            </Typography>
            <InfiniteScroll
                dataLength={photos.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                        <CircularProgress />
                    </Box>
                }
                endMessage={
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                        已顯示所有相片
                    </Typography>
                }
                style={{ overflow: 'visible' }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                    }}
                >
                    {sortedPhotos.map((photo) => (
                        <Box
                            key={photo.id}
                            sx={{
                                width: '100%',
                                maxWidth: {
                                    xs: '100%',
                                    md: '100%',
                                },
                                marginBottom: 2,
                                overflow: 'hidden',
                                boxShadow: 3,
                                borderRadius: 2,
                            }}
                        >
                            {isVideo(photo.photo_path) ? (
                                <video
                                    controls
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        borderRadius: '8px',
                                    }}
                                >
                                    <source
                                        src={getFullImageUrl(photo.photo_path)}
                                        type={`video/${photo.photo_path.split('.').pop().toLowerCase()}`}
                                    />
                                    您的瀏覽器不支援視頻標籤。
                                </video>
                            ) : (
                                <img
                                    src={getFullImageUrl(photo.photo_path)}
                                    alt=""
                                    loading="lazy"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        borderRadius: '8px',
                                    }}
                                />
                            )}
                        </Box>
                    ))}
                </Box>
            </InfiniteScroll>
        </Box>
    );
};

export default AlbumDetail;
