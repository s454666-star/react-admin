import React, { useEffect, useState } from 'react';
import './VideosList.css'; // 引入 CSS 檔案

const VideosList = () => {
    const [videos, setVideos] = useState([]);
    const [selectedScreenshots, setSelectedScreenshots] = useState([]);

    useEffect(() => {
        fetch('https://mystar.monster/api/screenshots')
            .then(response => response.json())
            .then(data => setVideos(data))
            .catch(error => console.error('Error fetching videos:', error));
    }, []);

    const toggleSelect = (screenshot) => {
        setSelectedScreenshots(prev =>
            prev.includes(screenshot) ? prev.filter(s => s !== screenshot) : [...prev, screenshot]
        );
    };

    const handleDelete = () => {
        setSelectedScreenshots([]);
    };

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
                        <div className="video-info">
                            <p><strong>ID:</strong> {video.id}</p>
                            <p><strong>Rating:</strong> {video.rating || 'N/A'}</p>
                            <p><strong>Notes:</strong> {video.notes || 'None'}</p>
                        </div>
                        <div className="screenshots">
                            {video.screenshot_paths.split(',').map((screenshot, index) => (
                                <div
                                    key={index}
                                    className={`screenshot-wrapper ${selectedScreenshots.includes(screenshot) ? 'selected' : ''}`}
                                    onClick={() => toggleSelect(screenshot)}
                                >
                                    <img
                                        className="screenshot-image"
                                        src={screenshot}
                                        alt={`Screenshot ${index}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>Loading videos...</p>
            )}
            {selectedScreenshots.length > 0 && (
                <button className="delete-button" onClick={handleDelete}>Delete Selected Screenshots</button>
            )}
        </div>
    );
};

export default VideosList;
