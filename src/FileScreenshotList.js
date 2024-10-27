import React, {useState, useEffect} from 'react';
import {useRedirect} from 'react-admin';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Grid,
    AppBar,
    Toolbar,
    Box,
    Chip,
    Switch,
    FormControlLabel,
    FormGroup
} from '@mui/material';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import {Helmet} from 'react-helmet';
import {API_BASE_URL} from './config';
import {keyframes} from '@mui/system';

const FileScreenshotList = () => {
    const redirect = useRedirect();

    const [albums, setAlbums] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [featuredOnly, setFeaturedOnly] = useState(false); // 「精選」開關狀態
    const [viewedOnly, setViewedOnly] = useState(false); // 「已觀看」開關狀態

    // 定義脈動動畫
    const pulse = keyframes`
        0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 105, 180, 0.7);
        }
        70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(255, 105, 180, 0);
        }
        100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 105, 180, 0);
        }
    `;

    const fetchAlbums = async () => {
        try {
            // 構建查詢參數
            let query = `page=${page}&perPage=20`;
            if (featuredOnly) {
                query += `&rating=1.00`;
            }
            if (viewedOnly) {
                query += `&is_view=1`;
            }

            const response = await fetch(`${API_BASE_URL}file-screenshots?${query}`);
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

    // 當開關狀態改變時，重置相本列表並重新抓取數據
    useEffect(() => {
        // 重置狀態
        setAlbums([]);
        setPage(1);
        setHasMore(true);
    }, [featuredOnly, viewedOnly]);

    useEffect(() => {
        fetchAlbums();
    }, [featuredOnly, viewedOnly, page]);

    return (
        <div style={{backgroundColor: '#FFE6F1', minHeight: '100vh'}}>
            {/* 設置頁面標題 */}
            <Helmet>
                <title>星夜剪影</title>
            </Helmet>

            <AppBar position="sticky" sx={{backgroundColor: '#FFD0FF'}}>
                <Toolbar sx={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <StarOutlineIcon sx={{color: '#FF69B4', mr: 1}}/>
                        <Typography variant="h6" component="div"
                                    sx={{color: '#FF69B4', flexGrow: 1, textAlign: 'center'}}>
                            星夜剪影
                        </Typography>
                    </Box>
                    {/* Toggle 開關區域 */}
                    <FormGroup sx={{display: 'flex', flexDirection: 'row'}}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={featuredOnly}
                                    onChange={(e) => setFeaturedOnly(e.target.checked)}
                                    color="secondary"
                                />
                            }
                            label="精選"
                            sx={{
                                mr: 2,
                                '& .MuiFormControlLabel-label': {
                                    color: '#FF69B4',
                                    fontWeight: 'bold',
                                    fontSize: {
                                        xs: '0.8rem',
                                        sm: '1rem',
                                    },
                                },
                            }}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={viewedOnly}
                                    onChange={(e) => setViewedOnly(e.target.checked)}
                                    color="secondary"
                                />
                            }
                            label="已觀看"
                            sx={{
                                '& .MuiFormControlLabel-label': {
                                    color: '#FF69B4',
                                    fontWeight: 'bold',
                                    fontSize: {
                                        xs: '0.8rem',
                                        sm: '1rem',
                                    },
                                },
                            }}
                        />
                    </FormGroup>
                </Toolbar>
            </AppBar>

            <InfiniteScroll
                dataLength={albums.length}
                next={fetchAlbums}
                hasMore={hasMore}
                loader={<h4 style={{textAlign: 'center', color: '#FF69B4'}}>載入中...</h4>}
                endMessage={<p style={{textAlign: 'center', color: '#FF69B4'}}>已無更多相簿</p>}
            >
                <Box sx={{px: {xs: 2, sm: 5, md: '10%'}}}>  {/* 設置不同裝置的左右留白 */}
                    <Grid container spacing={2} justifyContent="center">
                        {albums.map((album) => (
                            <Grid item xs={12} sm={6} md={4} key={album.id}
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
                                    <CardContent sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap'
                                    }}>
                                        <Box sx={{display: 'flex', alignItems: 'center', flexWrap: 'nowrap'}}>
                                            {(album.rating === "1.00" || album.rating === 1) && (
                                                <Chip
                                                    label="精選"
                                                    size="small"
                                                    sx={{
                                                        mr: 1,
                                                        backgroundColor: album.theme_color || '#FF69B4',
                                                        color: '#FFF',
                                                        fontWeight: 'bold',
                                                        animation: `${pulse} 2s infinite`,
                                                        boxShadow: `0 0 10px ${album.theme_color || '#FF69B4'}`,
                                                    }}
                                                />
                                            )}
                                            <Typography variant="body1" component="div" color="#880E4F"
                                                        fontWeight="bold"
                                                        sx={{
                                                            flexGrow: 1,
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            fontSize: {
                                                                xs: '0.9rem',
                                                                sm: '1rem',
                                                                md: '1.1rem',
                                                            },
                                                        }}
                                                        title={album.file_name}>
                                                {album.file_name}
                                            </Typography>
                                        </Box>
                                        {album.is_view === 1 && (
                                            <Chip
                                                label="已觀看"
                                                size="small"
                                                sx={{
                                                    mt: {xs: 1, sm: 0},
                                                    backgroundColor: '#FF69B4',
                                                    color: '#FFF',
                                                    fontWeight: 'bold',
                                                    textAlign: 'center',
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
