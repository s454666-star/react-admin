// src/index.js
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
import { mergeTranslations, defaultI18nProvider } from 'react-admin'; // 引入正確的 i18n provider 工具

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
    },
};

// 設定繁體中文翻譯
const i18nProvider = defaultI18nProvider({
    locale: 'zh',
    messages: {
        zh: customTraditionalChineseMessages,
    },
    getLocale: () => 'zh', // 返回當前使用的語言
});

// 使用您提供的 API 作為資料來源的 provider
const dataProvider = simpleRestProvider('https://mystar.monster/api');

// 自定義 authProvider
const authProvider = {
    login: ({ username, password }) => {
        if (username === 'admin' && password === 'password') {
            console.log('Login successful');
            localStorage.setItem('auth', 'true');
            return Promise.resolve();
        }
        console.log('Login failed');
        return Promise.reject('Invalid username or password');
    },
    logout: () => {
        console.log('Logged out');
        localStorage.removeItem('auth');
        return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: () =>
        localStorage.getItem('auth') ? Promise.resolve() : Promise.reject(),
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
        <Admin
            authProvider={authProvider}
            dataProvider={dataProvider}
            loginPage={Login}
            appBar={MyAppBar}
            i18nProvider={i18nProvider}  // 使用繁體中文翻譯
        >
            <Resource
                name="users"
                list={UserList}
                create={UserCreate}
                edit={UserEdit}
                show={UserShow}
            />
        </Admin>
    </ThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
