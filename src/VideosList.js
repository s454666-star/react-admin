import React, { useEffect, useState } from 'react';
import ReactStars from 'react-stars';
import './VideosList.css'; // 引入 CSS 檔案

const VideosList = () => {
    const [videos, setVideos] = useState([]);
    const [selectedScreenshots, setSelectedScreenshots] = useState([]);

    useEffect(() => {
        fetch('https://mystar.monster/api/screenshots')
            .then(response => response.json())
            .then(data => setVideos(data.data))  // 修改為分頁的 data
            .catch(error => console.error('Error fetching videos:', error));
    }, []);

    const updateRating = (newRating, id) => {
        fetch(`https://mystar.monster/api/screenshots/${id}/update-rating`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rating: newRating }),
        })
            .then(response => response.json())
            .then(() => {
                setVideos(videos.map(video => video.id === id ? { ...video, rating: newRating } : video));
            })
            .catch(error => console.error('Error updating rating:', error));
    };

    const updateNotes = (id, notes) => {
        fetch(`https://mystar.monster/api/screenshots/${id}/update-notes`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notes }),
        })
            .then(response => response.json())
            .catch(error => console.error('Error updating notes:', error));
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
                            <p><strong>Rating:</strong>
                                <ReactStars
                                    count={10} // 設為10顆星
                                    value={video.rating || 0}
                                    onChange={(newRating) => updateRating(newRating, video.id)}
                                    size={24}
                                    color2={'#ffd700'} // 黃色星星
                                />
                            </p>
                            <p><strong>Notes:</strong></p>
                            <textarea
                                className="notes-textarea"
                                defaultValue={video.notes || ''}
                                onBlur={(e) => updateNotes(video.id, e.target.value)} // 滑鼠移開時自動更新
                            />
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
