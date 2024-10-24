import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    CssBaseline,
    AppBar,
    Toolbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import AlbumDetail from './AlbumDetail'; // 相簿詳情頁面組件
import InfiniteScroll from 'react-infinite-scroll-component';
import { getFullImageUrl } from './utils'; // 引入輔助函數
import { API_BASE_URL } from './config';

// 定義星夜主題
const starryNightTheme = createTheme({
    palette: {
        primary: {
            main: '#3f51b5', // 星夜藍色
        },
        secondary: {
            main: '#7986cb',
        },
        background: {
            default: '#e8eaf6',
        },
    },
    typography: {
        fontFamily: 'Arial, sans-serif',
    },
});

// 主要內容的樣式
const Main = styled('main')(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
}));

// AppBar 的樣式調整
const MyAppBar = styled(AppBar)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.primary.main,
}));

const StarAlbum = () => {
    const [actors, setActors] = useState([]);
    const [selectedActor, setSelectedActor] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchActors();
    }, []);

    const fetchActors = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}actors`);
            setActors(response.data);
        } catch (error) {
            console.error('Error fetching actors:', error);
        }
    };

    const handleActorSelect = (actorId) => {
        setSelectedActor(actorId);
        if (actorId === 'all') {
            navigate(`/star-album`);
        } else {
            navigate(`/star-album/actor/${actorId}`);
        }
    };

    return (
        <ThemeProvider theme={starryNightTheme}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CssBaseline />
                <MyAppBar position="fixed">
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" noWrap component="div">
                            星夜相簿
                        </Typography>
                        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                            <InputLabel id="actor-select-label">選擇演員</InputLabel>
                            <Select
                                labelId="actor-select-label"
                                value={selectedActor}
                                onChange={(event) => handleActorSelect(event.target.value)}
                                label="選擇演員"
                            >
                                <MenuItem value="all">全部演員</MenuItem>
                                {actors.map((actor) => (
                                    <MenuItem key={actor.id} value={actor.id}>
                                        {actor.actor_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Toolbar>
                </MyAppBar>
                <Main>
                    <Toolbar />
                    <Routes>
                        <Route path="/" element={<AlbumsList actorId="all" />} />
                        <Route path="actor/:actorId" element={<AlbumsListWrapper />} />
                        <Route path="album/:albumId" element={<AlbumDetail />} />
                    </Routes>
                </Main>
            </Box>
        </ThemeProvider>
    );
};

// 包裝組件，用於從 URL 參數獲取 actorId
const AlbumsListWrapper = () => {
    const { actorId } = useParams();
    return <AlbumsList actorId={actorId} />;
};

// AlbumsList 組件
const AlbumsList = ({ actorId }) => {
    const [albums, setAlbums] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setAlbums([]);
        setPage(1);
        setHasMore(true);
        fetchAlbums(1, actorId, true);
    }, [actorId]);

    const fetchAlbums = async (pageNumber, actorId, reset = false) => {
        try {
            const params = {
                page: pageNumber,
                per_page: 20, // 確保每頁 20 條
            };
            if (actorId !== 'all') {
                params.actor = actorId;
            }
            const response = await axios.get(`${API_BASE_URL}albums`, { params });
            const newAlbums = response.data;

            if (reset) {
                setAlbums(newAlbums);
            } else {
                setAlbums((prev) => [...prev, ...newAlbums]);
            }

            if (newAlbums.length < 20) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching albums:', error);
        }
    };

    const fetchMoreData = () => {
        const nextPage = page + 1;
        fetchAlbums(nextPage, actorId);
        setPage(nextPage);
    };

    const handleAlbumClick = (album) => {
        navigate(`/star-album/album/${album.id}`, {
            state: {
                albumTitleFromMain: album.title,
                albumThemeFromMain: album.name, // 使用 album.name 作為主題
            },
        });
    };

    return (
        <InfiniteScroll
            dataLength={albums.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CircularProgress />
                </Box>
            }
            endMessage={
                <Typography variant="body2" color="text.secondary" align="center">
                    已顯示所有相簿
                </Typography>
            }
            style={{ overflow: 'visible' }} // 防止產生內部滾動條
        >
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(2, 1fr)', // 手機，每行顯示 2 個
                        sm: 'repeat(3, 1fr)', // 小螢幕，每行顯示 3 個
                        md: 'repeat(4, 1fr)', // 中等螢幕，每行顯示 4 個
                    },
                    gap: 2,
                    padding: 0,
                    margin: 0,
                }}
            >
                {albums.map((album) => (
                    <Box
                        key={album.id}
                        sx={{
                            border: '1px solid #7986cb',
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: 3,
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: 6,
                            },
                            cursor: 'pointer',
                        }}
                        onClick={() => handleAlbumClick(album)}
                    >
                        <img
                            src={getFullImageUrl(album.cover_path)}
                            alt={album.title}
                            style={{
                                width: '100%',
                                height: '200px',
                                objectFit: 'cover',
                            }}
                        />
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6" component="div" gutterBottom>
                                {album.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {album.name} {/* 顯示主題 */}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </InfiniteScroll>
    );
};

export default StarAlbum;
