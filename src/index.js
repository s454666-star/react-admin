// src/index.js

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import MyAppBar from './MyAppBar';
import Login from './Login';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import httpClient from './dataProvider';
import { ProductCreate, ProductEdit, ProductList } from './Product';
import { ProductCategoryCreate, ProductCategoryEdit, ProductCategoryList } from './ProductCategory';
import UserList from './UserList';
import UserCreate from './UserCreate';
import UserEdit from './UserEdit';
import UserShow from './UserShow';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { MemberList, MemberCreate, MemberEdit, MemberShow } from './Member';
import { OrderList, OrderCreate, OrderEdit, OrderShow } from './Order';
import { Helmet } from 'react-helmet';

// 繁體中文翻譯訊息
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
        input: {
            file: {
                upload_several: '將文件拖放到此處或點擊進行上傳。',
                upload_single: '將文件拖放到此處或點擊進行上傳。',
            },
            image: {
                upload_several: '將圖片拖放到此處或點擊進行上傳。',
                upload_single: '將圖片拖放到此處或點擊進行上傳。',
            },
        },
        auth: {
            username: '帳號',
            password: '密碼',
            sign_in: '登入',
            sign_in_error: '登入失敗，請重試',
            logout: '登出',
        },
        notification: {
            updated: '已更新',
            created: '已新增',
            deleted: '已刪除',
            item_doesnt_exist: '該項目不存在',
        },
        validation: {
            required: '必填',
            minLength: '最小長度為 %{min}',
            maxLength: '最大長度為 %{max}',
            minValue: '最小值為 %{min}',
            maxValue: '最大值為 %{max}',
            number: '必須是數字',
            email: '必須是有效的電子郵件',
        },
        navigation: {
            no_results: '未找到結果',
            page_out_of_boundaries: '頁數 %{page} 超出範圍',
            page_out_from_end: '已到達最後一頁',
            page_out_from_begin: '已到達第一頁',
            page_range_info: '%{offsetBegin}-%{offsetEnd} 筆，共 %{total} 筆',
            next: '下一頁',
            prev: '上一頁',
            page_rows_per_page: '每頁顯示筆數',
        },
        page: {
            list: '%{name} 列表',
            create: '建立 %{name}',
            edit: '編輯 %{name}',
            show: '查看 %{name}',
            empty: '目前沒有資料',
            invite: '',
            error: '發生錯誤',
            not_found: '頁面未找到',
            unauthorized: '未授權',
        },
    },
    resources: {
        members: {
            name: '會員',
            fields: {
                id: 'ID',
                username: '帳號',
                name: '姓名',
                email: '電子郵件',
                phone: '電話',
                address: '地址',
                is_admin: '是否管理員',
                status: '狀態',
                created_at: '創建時間',
                updated_at: '更新時間',
            },
        },
        orders: {
            name: '訂單',
            fields: {
                id: 'ID',
                member_id: '會員',
                order_number: '訂單編號',
                status: '狀態',
                payment_method: '付款方式',
                notes: '備註',
                shipping_fee: '運費',
                created_at: '創建時間',
                updated_at: '更新時間',
                orderItems: '訂單品項',
                totalAmount: '總金額',
            },
        },
        users: {
            name: '使用者',
        },
        products: {
            name: '商品',
        },
        'product-categories': {
            name: '產品類別',
        },
    },
};

// 設定繁體中文翻譯
const i18nProvider = polyglotI18nProvider(() => customTraditionalChineseMessages, 'zh');

// API 基本 URL
const API_URL = 'https://mystar.monster/api';

// 資料提供者
const dataProvider = simpleRestProvider(API_URL, httpClient);

// 認證提供者
const authProvider = {
    login: async ({ username, password }) => {
        const request = new Request(`${API_URL}/login`, {
            method: 'POST',
            body: JSON.stringify({ email: username, password }), // 根據您的後端需求，可能需要使用 email 而非 username
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });

        try {
            const response = await fetch(request);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }
            const { user, access_token, token_type } = await response.json();

            // 儲存 token 和 user 資訊到 localStorage
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

// Dashboard 組件，用於重定向到 /orders
const Dashboard = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/orders', { replace: true });
    }, [navigate]);
    return null;
};

const App = () => (
    <BrowserRouter>
        <ThemeProvider theme={theme}>
            <Helmet>
                <title>星夜商城後台</title>
                <link rel="icon" href="/icon_198x278.png" type="image/png" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap"
                    rel="stylesheet"
                />
            </Helmet>
            <Routes>
                {/* 後台路由 */}
                <Route
                    path="/star-admin/*"
                    element={
                        <Admin
                            basename="/star-admin"
                            authProvider={authProvider}
                            dataProvider={dataProvider}
                            loginPage={Login}
                            appBar={MyAppBar}
                            i18nProvider={i18nProvider}
                            theme={theme}
                            dashboard={Dashboard}
                        >
                            <Resource
                                name="members"
                                list={MemberList}
                                create={MemberCreate}
                                edit={MemberEdit}
                                show={MemberShow}
                            />
                            <Resource
                                name="orders"
                                list={OrderList}
                                create={OrderCreate}
                                edit={OrderEdit}
                                show={OrderShow}
                            />
                            <Resource
                                name="users"
                                list={UserList}
                                create={UserCreate}
                                edit={UserEdit}
                                show={UserShow}
                            />
                            <Resource
                                name="products"
                                list={ProductList}
                                create={ProductCreate}
                                edit={ProductEdit}
                            />
                            <Resource
                                name="product-categories"
                                list={ProductCategoryList}
                                create={ProductCategoryCreate}
                                edit={ProductCategoryEdit}
                            />
                        </Admin>
                    }
                />
            </Routes>
        </ThemeProvider>
    </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById('root'));
