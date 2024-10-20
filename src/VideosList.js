import React, { useEffect, useState } from 'react';

const VideosList = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        fetch('https://mystar.monster/api/screenshots')
            .then(response => response.json())
            .then(data => setVideos(data))
            .catch(error => console.error('Error fetching videos:', error));
    }, []);

    return (
        <div>
            <h2>Video Screenshots List</h2>
            {videos.length > 0 ? (
                videos.map(video => (
                    <div key={video.id}>
                        <h3>{video.file_name}</h3>
                        <video controls width="600" src={video.file_path}>
                            Your browser does not support the video tag.
                        </video>
                        <div>
                            {video.screenshot_paths.split(',').map((screenshot, index) => (
                                <img key={index} src={screenshot} alt={`Screenshot ${index}`} width="100" />
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
