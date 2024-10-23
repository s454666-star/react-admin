// utils.js
export const getFullImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/200'; // 或您希望的預設圖片
    // 檢查 path 是否已經是完整的 URL
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    return `https://star-admin.mystar.monster/${path}`;
};
