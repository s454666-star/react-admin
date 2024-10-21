import React from 'react';
import ReactDOM from 'react-dom';
import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import MyAppBar from './MyAppBar';
import Login from './Login';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import UserList from './UserList';
import UserCreate from './UserCreate';
import UserEdit from './UserEdit';
import UserShow from './UserShow';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import httpClient from './dataProvider';
import VideosList from './VideosList';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// 引入商品類別 CRUD 頁面
import { ProductCategoryList, ProductCategoryCreate, ProductCategoryEdit } from './ProductCategory';

const customTraditionalChineseMessages = {
    ra: {
        action: {
            delete: '刪除',
            show: '查看',
            list: '列表',
            save: '儲存',
            create: '新增',
            edit: '編輯',
            cancel: '取消',
            refresh: '重新整理',
            add_filter: '添加篩選器',
            remove_filter: '移除篩選器',
            back: '返回',
            export: '匯出',
        },
        message: {
            yes: '是',
            no: '否',
            are_you_sure: '您確定嗎？',
            about: '關於',
            not_found: '未找到',
            loading: '正在加載',
            invalid_form: '表單無效',
            error: '發生錯誤',
            saved: '儲存成功',
            deleted: '刪除成功',
        },
    },
};

// 設定繁體中文翻譯，並使用 polyglotI18nProvider
const i18nProvider = polyglotI18nProvider(() => customTraditionalChineseMessages, 'zh');

const API_URL = 'https://mystar.monster/api';
const dataProvider = simpleRestProvider(API_URL, httpClient);

const authProvider = {
    login: async ({ username, password }) => {
        const request = new Request(`${API_URL}/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });

        try {
            const response = await fetch(request);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }
            const { user, access_token, token_type } = await response.json();

            // 儲存 token 和 user 信息到 localStorage
            localStorage.setItem('auth', JSON.stringify({ user, token: `${token_type} ${access_token}` }));
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error.message);
        }
    },
    logout: () => {
        localStorage.removeItem('auth');
        return Promise.resolve();
    },
    checkError: ({ status }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem('auth');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    checkAuth: () => {
        return localStorage.getItem('auth') ? Promise.resolve() : Promise.reject();
    },
    getPermissions: () => Promise.resolve(),
};

// 主題設置
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        background: {
            default: '#f4f6f8',
        },
    },
});

const App = () => (
    <ThemeProvider theme={theme}>
        <BrowserRouter>
            <Routes>
                <Route exact path="/videos-list" element={<VideosList />} />
                <Route
                    path="*"
                    element={(
                        <Admin
                            authProvider={authProvider}
                            dataProvider={dataProvider}
                            loginPage={Login}
                            appBar={MyAppBar}
                            i18nProvider={i18nProvider}
                        >
                            <Resource
                                name="users"
                                list={UserList}
                                create={UserCreate}
                                edit={UserEdit}
                                show={UserShow}
                            />
                            {/* 添加商品類別資源 */}
                            <Resource
                                name="product-categories"
                                list={ProductCategoryList}
                                create={ProductCategoryCreate}
                                edit={ProductCategoryEdit}
                            />
                        </Admin>
                    )}
                />
            </Routes>
        </BrowserRouter>
    </ThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
