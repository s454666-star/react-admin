import React from 'react';
import ReactDOM from 'react-dom';
import { Admin, Resource, ListGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import MyAppBar from './MyAppBar';
import Login from './Login';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { List, Datagrid, TextField, EmailField, Filter, TextInput } from 'react-admin';

// 引入商品類別頁面
import { ProductCategoryList, ProductCategoryCreate, ProductCategoryEdit } from './ProductCategory';

// 使用 JSONPlaceholder 作為資料來源的 provider
const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

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
    },
});

const App = () => (
    <ThemeProvider theme={theme}>
        <Admin
            authProvider={authProvider}
            dataProvider={dataProvider}
            loginPage={Login}
            appBar={MyAppBar}
        >
            {/* 商品類別資源 */}
            <Resource
                name="product-categories"
                list={ProductCategoryList}
                create={ProductCategoryCreate}
                edit={ProductCategoryEdit}
            />
        </Admin>
    </ThemeProvider>
);

// 使用 ReactDOM.render 渲染應用程式
ReactDOM.render(<App />, document.getElementById('root'));
