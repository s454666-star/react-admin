// src/index.js

import React from 'react';
import { createRoot } from 'react-dom/client'; // 更新的引入方式
import {
    Admin,
    Resource,
    MenuItemLink,
    Menu,
    fetchUtils,
} from 'react-admin';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Login from './Login';
import MyAppBar from './MyAppBar';
import { ProductCreate, ProductEdit, ProductList } from './Product';
import { ProductCategoryCreate, ProductCategoryEdit, ProductCategoryList } from './ProductCategory';
import { UserList, UserCreate, UserEdit, UserShow } from './User';
import {
    MemberList,
    MemberCreate,
    MemberEdit,
    MemberShow,
} from './Member';
import {
    OrderList,
    OrderCreate,
    OrderEdit,
    OrderShow,
} from './Order';
import VideosList from './VideosList';
import StarAlbum from './StarAlbum';
import FileScreenshotList from './FileScreenshotList';
import FileScreenshotDetail from './FileScreenshotDetail';
import ProductFront from './ProductFront';
import MemberRegister from './MemberRegister';
import OrderCart from './OrderCart';
import OrderHistory from "./OrderHistory.js"; // 更新匯入路徑

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
            fields: {
                id: 'ID',
                username: '帳號',
                name: '姓名',
                email: '電子郵件',
                phone: '電話',
                address: '地址',
                status: '狀態',
            },
        },
        products: {
            name: '商品',
            fields: {
                id: '編號',
                image_base64: '商品圖片',
                product_name: '商品名稱',
                price: '價格',
                stock_quantity: '庫存數量',
                status: '狀態',
                category_id: '商品類別',
            },
        },
        'product-categories': {
            name: '產品類別',
            fields: {
                id: '編號',
                category_name: '名稱',
                description: '描述',
                status: '狀態',
            },
        },
    },
};

// 設定繁體中文翻譯
const i18nProvider = polyglotI18nProvider(
    () => customTraditionalChineseMessages,
    'zh'
);

// API 基本 URL
const API_URL = 'https://mystar.monster/api';
const LOGIN_URL = 'https://mystar.monster';

// 自訂資料提供者
import { stringify } from 'query-string';

const customHttpClient = (url, options = {}) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (auth && auth.token) {
        options.headers = new Headers({
            Accept: 'application/json',
            Authorization: `Bearer ${auth.token}`,
            'Content-Type': 'application/json',
        });
    } else {
        options.headers = new Headers({
            Accept: 'application/json',
            'Content-Type': 'application/json',
        });
    }
    return fetchUtils.fetchJson(url, options);
};

const customDataProvider = {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            page: page,
            per_page: perPage,
            sort_by: field,
            sort_order: order,
            ...params.filter,
        };
        const url = `${API_URL}/${resource}?${stringify(query)}`;
        return customHttpClient(url).then(({ json }) => {
            const data = json.data || json;
            return {
                data: Array.isArray(data) ? data : [data],
                total: json.total || (Array.isArray(data) ? data.length : 0),
            };
        });
    },
    getOne: (resource, params) =>
        customHttpClient(`${API_URL}/${resource}/${params.id}`).then(({ json }) => ({
            data: json.data || json,
        })),
    getMany: (resource, params) => {
        const query = {
            ids: params.ids.join(','),
        };
        const url = `${API_URL}/${resource}?${stringify(query)}`;
        return customHttpClient(url).then(({ json }) => ({
            data: json.data || json,
        }));
    },
    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            page: page,
            per_page: perPage,
            sort_by: field,
            sort_order: order,
            [params.target]: params.id,
            ...params.filter,
        };
        const url = `${API_URL}/${resource}?${stringify(query)}`;
        return customHttpClient(url).then(({ json }) => {
            const data = json.data || json;
            return {
                data: Array.isArray(data) ? data : [data],
                total: json.total || (Array.isArray(data) ? data.length : 0),
            };
        });
    },
    update: (resource, params) =>
        customHttpClient(`${API_URL}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json.data || json })),
    updateMany: (resource, params) => {
        const query = {
            ids: params.ids,
        };
        return customHttpClient(`${API_URL}/${resource}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
            query,
        }).then(({ json }) => ({ data: json.data || json }));
    },
    create: (resource, params) =>
        customHttpClient(`${API_URL}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...params.data, id: json.data.id || json.id },
        })),
    delete: (resource, params) =>
        customHttpClient(`${API_URL}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json.data || json })),
    deleteMany: (resource, params) => {
        const query = {
            ids: params.ids,
        };
        return customHttpClient(`${API_URL}/${resource}`, {
            method: 'DELETE',
            query,
        }).then(({ json }) => ({ data: json.data || json }));
    },
};

const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
};

// 認證提供者
const authProvider = {
    login: async ({ username, password }) => {
        try {
            const response = await fetch(`${API_URL}/admin-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || '登入失敗');
            }

            const { user, access_token } = await response.json();

            localStorage.setItem('auth', JSON.stringify({ user, token: access_token }));
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

// 自訂菜單組件，移除首頁選項
const MyMenu = () => (
    <Menu hasDashboard={false}>
        <MenuItemLink to="/members" primaryText="會員" />
        <MenuItemLink to="/orders" primaryText="訂單" />
        <MenuItemLink to="/users" primaryText="使用者" />
        <MenuItemLink to="/products" primaryText="商品" />
        <MenuItemLink to="/product-categories" primaryText="產品類別" />
    </Menu>
);

// 後台 Admin 組件
const AdminApp = () => (
    <Admin
        basename="/star-admin"
        authProvider={authProvider}
        dataProvider={customDataProvider}
        loginPage={Login}
        appBar={MyAppBar}
        i18nProvider={i18nProvider}
        theme={theme}
        dashboard={null} // 移除 Dashboard
        menu={MyMenu}
    >
        <Resource
            name="members"
            list={MemberList}
            create={MemberCreate}
            edit={MemberEdit}
            show={MemberShow}
            options={{ label: '會員' }}
        />
        <Resource
            name="orders"
            list={OrderList}
            create={OrderCreate}
            edit={OrderEdit}
            show={OrderShow}
            options={{ label: '訂單' }}
        />
        <Resource
            name="users"
            list={UserList}
            create={UserCreate}
            edit={UserEdit}
            show={UserShow}
            options={{ label: '使用者' }}
        />
        <Resource
            name="products"
            list={ProductList}
            create={ProductCreate}
            edit={ProductEdit}
            options={{ label: '商品' }}
        />
        <Resource
            name="product-categories"
            list={ProductCategoryList}
            create={ProductCategoryCreate}
            edit={ProductCategoryEdit}
            options={{ label: '產品類別' }}
        />
    </Admin>
);

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
                <Route path="/star-admin/*" element={<AdminApp />} />

                {/* 前台路由 */}
                <Route path="/videos-list" element={<VideosList />} />
                <Route path="/star-album/*" element={<StarAlbum />} />
                <Route path="/star-video/*" element={<FileScreenshotList />} />
                <Route
                    path="/file-screenshots/:id"
                    element={<FileScreenshotDetail />}
                />
                <Route path="/star-mall" element={<ProductFront />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/member-register" element={<MemberRegister />} />
                <Route path="/order-cart" element={<OrderCart />} />

                {/* 預設路由 */}
                <Route path="*" element={<ProductFront />} />
            </Routes>
        </ThemeProvider>
    </BrowserRouter>
);

// 使用 createRoot 來渲染應用
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
