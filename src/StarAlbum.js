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
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import AlbumDetail from './AlbumDetail'; // 相簿詳情頁面組件
import InfiniteScroll from 'react-infinite-scroll-component';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

// 左側 Drawer 的寬度
const drawerWidth = 240;

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
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="actor-list-content"
                                id="actor-list-header"
                            >
                                <Typography>演員列表</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List>
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            selected={selectedActor === 'all'}
                                            onClick={() => handleActorSelect('all')}
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
                                            >
                                                <ListItemText primary={actor.actor_name} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </Drawer>
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

// Wrapper 組件，用於從 URL 參數獲取 actorId
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
                per_page: 20, // 確保每頁 20 筆
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
                albumThemeFromMain: album.theme,
            },
        });
    };

    return (
        <InfiniteScroll
            dataLength={albums.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<CircularProgress />}
            endMessage={
                <Typography variant="body2" color="text.secondary" align="center">
                    已顯示所有相簿
                </Typography>
            }
        >
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: 2,
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
                            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                        />
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6" component="div" gutterBottom>
                                {album.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {album.theme}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </InfiniteScroll>
    );
};

export default StarAlbum;
