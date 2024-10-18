// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest'; // 使用 simple rest provider
import MyAppBar from './MyAppBar';
import Login from './Login';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import UserList from './UserList';
import UserCreate from './UserCreate';
import UserEdit from './UserEdit';
import UserShow from './UserShow';

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
