import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    CssBaseline,
    AppBar,
    Toolbar,
    FormControl,
    Select,
    MenuItem,
    Button,
    Switch,
    FormControlLabel,
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import AlbumDetail from './AlbumDetail';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getFullImageUrl } from './utils';
import { API_BASE_URL } from './config';

// 定義星夜主題
const starryNightTheme = createTheme({
    palette: {
        primary: {
            main: '#3f51b5',
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
    const [selectedAlbums, setSelectedAlbums] = useState([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);
    const [reload, setReload] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchActors();
    }, []);

    const fetchActors = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}actors`);
            setActors(response.data);
        } catch (error) {
            console.error('取得 Coser 列表時發生錯誤:', error);
        }
    };

    const handleActorSelect = (actorId) => {
        setSelectedActor(actorId);
        if (actorId === 'all') {
            navigate(`/star-album`);
        } else {
            navigate(`/star-album/actor/${actorId}`);
        }
        setSelectedAlbums([]);
    };

    const toggleShowDeleted = () => {
        setShowDeleted(!showDeleted);
        setSelectedAlbums([]);
    };

    const handleLongPress = (albumId) => {
        setSelectedAlbums((prevSelected) => {
            if (prevSelected.includes(albumId)) {
                return prevSelected.filter((id) => id !== albumId);
            } else {
                return [...prevSelected, albumId];
            }
        });
    };

    useEffect(() => {
        if (selectedAlbums.length > 0) {
            setIsSelecting(true);
        } else {
            setIsSelecting(false);
        }
    }, [selectedAlbums]);

    const handleDeleteAlbums = async () => {
        try {
            await axios.put(`${API_BASE_URL}albums/updateDeleted`, {
                album_ids: selectedAlbums,
                deleted: 1,
            });
            setSelectedAlbums([]);
            setReload((prev) => !prev);
        } catch (error) {
            console.error('刪除相簿時發生錯誤:', error);
        }
    };

    return (
        <ThemeProvider theme={starryNightTheme}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CssBaseline />
                <MyAppBar position="fixed">
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" noWrap component="div">
                            星空相簿
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <FormControl variant="outlined" size="small" sx={{ minWidth: 150, color: 'white' }}>
                                <Select
                                    value={selectedActor}
                                    onChange={(event) => handleActorSelect(event.target.value)}
                                    sx={{ color: 'white' }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: '#3f51b5',
                                                color: 'white',
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="all">全部 Coser</MenuItem>
                                    {actors.map((actor) => (
                                        <MenuItem key={actor.id} value={actor.id}>
                                            {actor.secondary_actor_name
                                                ? `${actor.actor_name} - ${actor.secondary_actor_name}`
                                                : actor.actor_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={showDeleted}
                                        onChange={toggleShowDeleted}
                                        name="showDeletedSwitch"
                                        color="secondary"
                                    />
                                }
                                label={
                                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'white' }}>
                                        已刪除
                                    </Typography>
                                }
                            />
                        </Box>
                    </Toolbar>

                    {selectedAlbums.length > 0 && (
                        <Box sx={{ textAlign: 'center', mt: 1 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleDeleteAlbums}
                            >
                                刪除選中的相簿
                            </Button>
                        </Box>
                    )}
                </MyAppBar>

                <Main>
                    <Toolbar />
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <AlbumsList
                                    actorId="all"
                                    showDeleted={showDeleted}
                                    isSelecting={isSelecting}
                                    selectedAlbums={selectedAlbums}
                                    onLongPress={handleLongPress}
                                    reload={reload}
                                />
                            }
                        />
                        <Route
                            path="actor/:actorId"
                            element={
                                <AlbumsListWrapper
                                    showDeleted={showDeleted}
                                    isSelecting={isSelecting}
                                    selectedAlbums={selectedAlbums}
                                    onLongPress={handleLongPress}
                                    reload={reload}
                                />
                            }
                        />
                        <Route path="album/:albumId" element={<AlbumDetail />} />
                    </Routes>
                </Main>
            </Box>
        </ThemeProvider>
    );
};

// 包裝組件，用於從 URL 參數獲取 actorId
const AlbumsListWrapper = ({ showDeleted, isSelecting, selectedAlbums, onLongPress, reload }) => {
    const { actorId } = useParams();
    return (
        <AlbumsList
            actorId={actorId}
            showDeleted={showDeleted}
            isSelecting={isSelecting}
            selectedAlbums={selectedAlbums}
            onLongPress={onLongPress}
            reload={reload}
        />
    );
};

// AlbumsList 組件
const AlbumsList = ({ actorId, showDeleted, isSelecting, selectedAlbums, onLongPress, reload }) => {
    const [albums, setAlbums] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();
    const timerRef = useRef(null);

    useEffect(() => {
        setAlbums([]);
        setPage(1);
        setHasMore(true);
        fetchAlbums(1, actorId, showDeleted, true);
    }, [actorId, showDeleted, reload]);

    const fetchAlbums = async (pageNumber, actorId, showDeleted, reset = false) => {
        try {
            const params = {
                page: pageNumber,
                per_page: 20,
                deleted: showDeleted ? 1 : 0,
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
            console.error('取得相簿時發生錯誤:', error);
        }
    };

    const fetchMoreData = () => {
        const nextPage = page + 1;
        fetchAlbums(nextPage, actorId, showDeleted);
        setPage(nextPage);
    };

    const handleAlbumClick = (album) => {
        if (isSelecting) {
            onLongPress(album.id);
        } else {
            navigate(`/star-album/album/${album.id}`);
        }
    };

    const handleLongPressStart = (albumId) => {
        timerRef.current = setTimeout(() => {
            onLongPress(albumId);
        }, 3000);
    };

    const handleLongPressEnd = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
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
            style={{ overflow: 'visible' }}
        >
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(2, 1fr)',
                        sm: 'repeat(3, 1fr)',
                        md: 'repeat(4, 1fr)',
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
                            border: isSelecting && selectedAlbums.includes(album.id) ? '2px solid red' : '1px solid #7986cb',
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: 3,
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: 6,
                            },
                            cursor: 'pointer',
                            position: 'relative',
                        }}
                        onClick={() => handleAlbumClick(album)}
                        onMouseDown={() => handleLongPressStart(album.id)}
                        onMouseUp={handleLongPressEnd}
                        onMouseLeave={handleLongPressEnd}
                        onTouchStart={() => handleLongPressStart(album.id)}
                        onTouchEnd={handleLongPressEnd}
                    >
                        {isSelecting && selectedAlbums.includes(album.id) && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    backgroundColor: 'red',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                }}
                            >
                                ✓
                            </Box>
                        )}
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
                                        xs: '1rem',
                                        md: '1.5rem',
                                    },
                                }}
                            >
                                {album.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {album.name}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </InfiniteScroll>
    );
};

export default StarAlbum;