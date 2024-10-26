// FileScreenshotDetail.js
import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Container, Typography, Card, CardMedia, Grid} from '@mui/material';
import ReactPlayer from 'react-player';
import {API_BASE_URL} from './config'; // 引入 API 基礎 URL

const FileScreenshotDetail = () => {
    const {id} = useParams();
    const [album, setAlbum] = useState(null);

    // 取得相簿詳細資料
    useEffect(() => {
        const fetchAlbum = async () => {
            const response = await fetch(`${API_BASE_URL}file-screenshots/${id}`);
            const data = await response.json();
            setAlbum(data);
        };
        fetchAlbum();
    }, [id]);

    if (!album) return <Typography>載入中...</Typography>;

    // 解析圖片連結
    const screenshotUrls = album.screenshot_paths ? album.screenshot_paths.split(',') : [];

    return (
        <Container sx={{paddingTop: '20px', backgroundColor: '#ffe6f1', minHeight: '100vh'}}>
            <Typography variant="h4" gutterBottom color="#ff69b4">
                {album.file_name}
            </Typography>

            {/* 影片播放器 */}
            <div style={{marginBottom: '20px'}}>
                <ReactPlayer
                    url={album.file_path}
                    controls
                    width="100%"
                    height="400px"
                    style={{borderRadius: '8px', overflow: 'hidden'}}
                />
            </div>

            {/* 圖片列表 */}
            <Grid container spacing={2}>
                {screenshotUrls.map((url, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{maxWidth: 345, borderRadius: '8px', backgroundColor: '#fff0f5'}}>
                            <CardMedia component="img" height="200" image={url} alt={`Screenshot ${index + 1}`}/>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default FileScreenshotDetail;
