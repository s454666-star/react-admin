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
    ListSubheader,
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Routes, Route, useNavigate, useParams, BrowserRouter as Router } from 'react-router-dom';
import AlbumDetail from './AlbumDetail';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getFullImageUrl } from './utils';
import { API_BASE_URL } from './config';
import { Autocomplete, TextField } from '@mui/material';

// 定義星夜主題
const starryNightTheme = createTheme({
    palette: {
        primary: {
            main: '#3f51b5', // 星空藍色
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
    const [groupedActors, setGroupedActors] = useState({});
    const [selectedActor, setSelectedActor] = useState('all');
    const navigate = useNavigate();
    const actorOptions = [
        { id: 'all', label: '全部Coser', group: '全部' },
        ...actors.map((actor) => ({
            id: actor.id,
            label: actor.secondary_actor_name || actor.actor_name,
            group: actor.secondary_actor_name ? actor.actor_name : '主演員',
        })),
    ];

    useEffect(() => {
        fetchActors();
    }, []);

    const fetchActors = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}actors`);
            const actorsData = response.data;
            setActors(actorsData);

            // 根據演員資料動態分組
            const groups = {};
            actorsData.forEach((actor) => {
                if (actor.secondary_actor_name) {
                    // 次演員
                    if (!groups[actor.actor_name]) {
                        groups[actor.actor_name] = [];
                    }
                    groups[actor.actor_name].push(actor);
                } else {
                    // 主演員
                    if (!groups['主演員']) {
                        groups['主演員'] = [];
                    }
                    groups['主演員'].push(actor);
                }
            });
            setGroupedActors(groups);

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
                    <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            星空相簿
                        </Typography>
                        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                            <InputLabel sx={{ color: 'white' }}>選擇演員</InputLabel>
                            <Select
                                value={selectedActor}
                                onChange={(event) => handleActorSelect(event.target.value)}
                                displayEmpty
                                sx={{
                                    color: 'white',
                                    '.MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white',
                                    },
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: '#3f51b5',
                                            color: 'white',
                                        },
                                    },
                                }}
                                renderValue={(selected) => {
                                    if (selected === 'all') {
                                        return '全部Coser';
                                    }
                                    const selectedActor = actors.find((actor) => actor.id === selected);
                                    return selectedActor ? (selectedActor.secondary_actor_name || selectedActor.actor_name) : '';
                                }}
                            >
                                {/* 全部選項 */}
                                <MenuItem value="all" sx={{ fontWeight: 'bold' }}>全部Coser</MenuItem>

                                {/* 分組顯示演員 */}
                                {Object.keys(groupedActors).map((groupName) => (
                                    <React.Fragment key={groupName}>
                                        <ListSubheader
                                            sx={{
                                                backgroundColor: '#3f51b5',
                                                color: 'white',
                                                fontSize: '1rem',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {groupName}
                                        </ListSubheader>
                                        {groupedActors[groupName].map((actor) => (
                                            <MenuItem
                                                key={actor.id}
                                                value={actor.id}
                                                sx={{
                                                    pl: actor.secondary_actor_name ? 4 : 2, // 次演員縮進
                                                    fontSize: actor.secondary_actor_name ? '0.9rem' : '1rem',
                                                    fontWeight: actor.secondary_actor_name ? 'normal' : 'bold',
                                                }}
                                            >
                                                {actor.secondary_actor_name || actor.actor_name}
                                            </MenuItem>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ flexGrow: 1 }} /> {/* 佔位元素，使選單居中 */}
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
                per_page: 20,
            };
            if (actorId && actorId !== 'all') {
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
                            <Typography
                                component="div"
                                gutterBottom
                                sx={{
                                    fontSize: {
                                        xs: '1rem',   // 手機版字體大小
                                        md: '1.5rem', // 電腦版字體大小
                                    },
                                }}
                            >
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

const App = () => (
    <Router>
        <Routes>
            <Route path="/*" element={<StarAlbum />} />
        </Routes>
    </Router>
);

export default App;
