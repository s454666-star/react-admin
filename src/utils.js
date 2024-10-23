// src/utils.js
import { IMAGE_BASE_URL } from './config';

export const getFullImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/200'; // 或您希望的預設圖片
    // 檢查 path 是否已經是完整的 URL
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    return `${IMAGE_BASE_URL}${path}`;
};
