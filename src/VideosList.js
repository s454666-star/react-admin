import React, { useEffect, useState } from 'react';
import ReactStars from 'react-stars';
import './VideosList.css'; // 引入 CSS 檔案

const VideosList = () => {
    const [videos, setVideos] = useState([]);
    const [selectedScreenshots, setSelectedScreenshots] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [ratingFilter, setRatingFilter] = useState('');
    const [sortByRating, setSortByRating] = useState('asc');
    const [notesFilter, setNotesFilter] = useState('');
    const perPage = 20;

    useEffect(() => {
        fetchVideos();
    }, [currentPage, ratingFilter, sortByRating, notesFilter]);

    const fetchVideos = () => {
        const queryParams = new URLSearchParams({
            page: currentPage,
            per_page: perPage,
            rating: ratingFilter,
            sort_by_rating: sortByRating,
            notes: notesFilter,
        });

        fetch(`https://mystar.monster/api/screenshots?${queryParams.toString()}`)
            .then(response => response.json())
            .then(data => {
                setVideos(data.data);
                setTotalPages(data.last_page);
            })
            .catch(error => console.error('Error fetching videos:', error));
    };

    const toggleSelect = (screenshot) => {
        setSelectedScreenshots(prev =>
            prev.includes(screenshot) ? prev.filter(s => s !== screenshot) : [...prev, screenshot]
        );
    };

    const updateRating = (newRating, id) => {
        fetch(`https://mystar.monster/api/screenshots/${id}/rating`, {
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
        fetch(`https://mystar.monster/api/screenshots/${id}/notes`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notes }),
        })
            .then(response => response.json())
            .catch(error => console.error('Error updating notes:', error));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="videos-container">
            <h2 className="title">Video Screenshots List</h2>

            <div className="filters">
                <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
                    <option value="">All Ratings</option>
                    <option value="unrated">Unrated</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    {/* 可以加入更多選項 */}
                </select>

                <select value={sortByRating} onChange={(e) => setSortByRating(e.target.value)}>
                    <option value="asc">Sort by Rating Ascending</option>
                    <option value="desc">Sort by Rating Descending</option>
                </select>

                <input
                    type="text"
                    placeholder="Filter by Notes"
                    value={notesFilter}
                    onChange={(e) => setNotesFilter(e.target.value)}
                />
            </div>

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
                                    count={10}
                                    value={video.rating || 0}
                                    onChange={(newRating) => updateRating(newRating, video.id)}
                                    size={24}
                                    color2={'#ffd700'}
                                />
                            </p>
                            <p><strong>Notes:</strong></p>
                            <textarea
                                className="notes-textarea"
                                defaultValue={video.notes || ''}
                                onBlur={(e) => updateNotes(video.id, e.target.value)}
                            />
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

            <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
};

export default VideosList;
