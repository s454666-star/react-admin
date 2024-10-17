import React from 'react';
import ReactDOM from 'react-dom';
import { Admin, Resource, ListGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import MyAppBar from './MyAppBar';
import Login from './Login';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { List, Datagrid, TextField, EmailField, Filter, TextInput } from 'react-admin';

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

// 定義過濾器組件
const UserFilter = (props) => (
    <Filter {...props}>
        <TextInput label="搜尋名稱" source="q" alwaysOn />
    </Filter>
);

// 定義使用者清單組件，並添加搜尋功能
const UserList = (props) => (
    <List {...props} filters={<UserFilter />} title="使用者清單">
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
            <EmailField source="email" />
            <TextField source="phone" />
            <TextField source="website" />
        </Datagrid>
    </List>
);

// 主題設置（可選）
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
            <Resource name="users" list={UserList} />
        </Admin>
    </ThemeProvider>
);

// 使用 ReactDOM.render 渲染應用程式
ReactDOM.render(<App />, document.getElementById('root'));
