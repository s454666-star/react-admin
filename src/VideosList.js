import React, { useEffect, useState } from 'react';
import './VideosList.css'; // 引入 CSS 檔案

const VideosList = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        fetch('https://mystar.monster/api/screenshots')
            .then(response => response.json())
            .then(data => setVideos(data))
            .catch(error => console.error('Error fetching videos:', error));
    }, []);

    return (
        <div className="videos-container">
            <h2 className="title">Video Screenshots List</h2>
            {videos.length > 0 ? (
                videos.map(video => (
                    <div key={video.id} className="video-card">
                        <h3 className="video-title">{video.file_name}</h3>
                        <video className="video-player" controls width="600" src={video.file_path}>
                            Your browser does not support the video tag.
                        </video>
                        <div className="screenshots">
                            {video.screenshot_paths.split(',').map((screenshot, index) => (
                                <img key={index} className="screenshot-image" src={screenshot} alt={`Screenshot ${index}`} />
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>Loading videos...</p>
            )}
        </div>
    );
};

export default VideosList;
