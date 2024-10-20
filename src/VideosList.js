import React, { useEffect, useState } from 'react';
import ReactStars from 'react-stars';
import './VideosList.css'; // 引入 CSS 檔案

const VideosList = () => {
    const [videos, setVideos] = useState([]);
    const [selectedScreenshots, setSelectedScreenshots] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [ratingFilter, setRatingFilter] = useState('');
    const [sortByColumn, setSortByColumn] = useState('rating'); // 新增排序欄位
    const [sortDirection, setSortDirection] = useState('asc'); // 新增排序方向
    const [notesFilter, setNotesFilter] = useState('');
    const perPage = 20;

    useEffect(() => {
        fetchVideos();
    }, [currentPage, ratingFilter, sortByColumn, sortDirection, notesFilter]);

    const fetchVideos = () => {
        const queryParams = new URLSearchParams({
            page: currentPage,
            per_page: perPage,
            notes: notesFilter,
            sort_by: sortByColumn,
            sort_direction: sortDirection,
        });

        // 僅在 ratingFilter 不為空時加入 rating 參數
        if (ratingFilter && ratingFilter !== 'all') {
            queryParams.append('rating', ratingFilter);
        }

        fetch(`https://mystar.monster/api/screenshots?${queryParams.toString()}`)
            .then(response => response.json())
            .then(data => {
                setVideos(data.data);
                setTotalPages(data.last_page);
            })
            .catch(error => console.error('獲取影片時出錯:', error));
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
            .catch(error => console.error('更新評分時出錯:', error));
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
            .catch(error => console.error('更新備註時出錯:', error));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="videos-container">
            <h2 className="title">影片庫</h2>

            <div className="filters">
                <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
                    <option value="all">全選</option>
                    <option value="unrated">未評分</option>
                    <option value="1">1 星</option>
                    <option value="2">2 星</option>
                    <option value="3">3 星</option>
                    <option value="4">4 星</option>
                    <option value="5">5 星</option>
                    {/* 可以加入更多選項 */}
                </select>

                <div className="sort-controls">
                    <select value={sortByColumn} onChange={(e) => setSortByColumn(e.target.value)}>
                        <option value="id">依ID排序</option>
                        <option value="file_name">依檔名排序</option>
                        <option value="rating">依評分排序</option>
                        {/* 可以加入更多排序欄位 */}
                    </select>

                    <select value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
                        <option value="asc">升序</option>
                        <option value="desc">降序</option>
                    </select>
                </div>

                <input
                    type="text"
                    placeholder="按備註篩選"
                    value={notesFilter}
                    onChange={(e) => setNotesFilter(e.target.value)}
                />
            </div>

            {videos.length > 0 ? (
                videos.map(video => (
                    <div key={video.id} className="video-card">
                        <h3 className="video-title">{video.file_name}</h3>
                        <video className="video-player" controls width="600" src={video.file_path}>
                            您的瀏覽器不支援影片標籤。
                        </video>
                        <div className="video-info">
                            <p><strong>ID:</strong> {video.id}</p>
                            <p><strong>評分:</strong>
                                <ReactStars
                                    count={5} // 根據需要調整星數
                                    value={video.rating || 0}
                                    onChange={(newRating) => updateRating(newRating, video.id)}
                                    size={24}
                                    color2={'#ffd700'}
                                />
                            </p>
                            <p><strong>備註:</strong></p>
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
                                        alt={`截圖 ${index}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>載入影片中...</p>
            )}

            <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>上一頁</button>
                <span>第 {currentPage} 頁，共 {totalPages} 頁</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>下一頁</button>
            </div>
        </div>
    );
};

export default VideosList;
