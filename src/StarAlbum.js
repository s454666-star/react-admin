import React, { useState, useEffect } from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    CircularProgress,
    Divider,
    CssBaseline,
    AppBar,
    Toolbar,
    IconButton,
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import AlbumDetail from './AlbumDetail'; // 相簿詳情頁面組件
import InfiniteScroll from 'react-infinite-scroll-component';
import MenuIcon from '@mui/icons-material/Menu';
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

// 左側 Drawer 的寬度，調整為原來的65%
const drawerWidth = 240 * 0.65; // 縮小65%

// 主要內容的樣式，根據 Drawer 的開啟狀態調整寬度
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        // 根據選單的開關狀態調整 marginLeft
        marginLeft: open ? `${drawerWidth}px` : 0,
    }),
);

// AppBar 的樣式調整
const MyAppBar = styled(AppBar)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.primary.main,
}));

const StarAlbum = () => {
    const [actors, setActors] = useState([]);
    const [selectedActor, setSelectedActor] = useState('all');
    const [drawerOpen, setDrawerOpen] = useState(true);
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

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <ThemeProvider theme={starryNightTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <MyAppBar position="fixed">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={toggleDrawer}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            星夜相簿
                        </Typography>
                    </Toolbar>
                </MyAppBar>
                <Drawer
                    variant="persistent"
                    open={drawerOpen}
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            backgroundColor: '#e8eaf6',
                        },
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: 'auto' }}>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton
                                    selected={selectedActor === 'all'}
                                    onClick={() => handleActorSelect('all')}
                                    sx={{ fontSize: '0.8rem' }} // 縮小文字
                                >
                                    <ListItemText primary="全部演員" />
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                            {actors.map((actor) => (
                                <ListItem key={actor.id} disablePadding>
                                    <ListItemButton
                                        selected={selectedActor === actor.id}
                                        onClick={() => handleActorSelect(actor.id)}
                                        sx={{ fontSize: '0.8rem' }} // 縮小文字
                                    >
                                        <ListItemText primary={actor.actor_name} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>
                <Main open={drawerOpen}>
                    <Toolbar />
                    <Routes>
                        <Route path="/" element={<AlbumsList actorId="all" drawerOpen={drawerOpen} />} />
                        <Route path="actor/:actorId" element={<AlbumsListWrapper drawerOpen={drawerOpen} />} />
                        <Route path="album/:albumId" element={<AlbumDetail drawerOpen={drawerOpen} />} />
                    </Routes>
                </Main>
            </Box>
        </ThemeProvider>
    );
};

// 包裝組件，用於從 URL 參數獲取 actorId
const AlbumsListWrapper = ({ drawerOpen }) => {
    const { actorId } = useParams();
    return <AlbumsList actorId={actorId} drawerOpen={drawerOpen} />;
};

// AlbumsList 組件
const AlbumsList = ({ actorId, drawerOpen }) => {
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
                        xs: 'repeat(1, 1fr)', // 手機，每行顯示 1 個
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
