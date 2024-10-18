// src/UserList.js
import React from 'react';
import { List, Datagrid, TextField, EmailField, TextInput, Filter, EditButton, DeleteButton, ShowButton, BulkDeleteButton } from 'react-admin';
import { Checkbox } from '@mui/material';
import { styled } from '@mui/system';

const UserFilter = (props) => (
    <Filter {...props}>
        <TextInput label="搜尋名稱" source="q" alwaysOn />
    </Filter>
);

// 自定義行的樣式 (基數偶數行顏色不同)
const StyledRow = styled('tr')(({ theme, isOdd }) => ({
    backgroundColor: isOdd ? theme.palette.grey[100] : theme.palette.background.paper,
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

// 批次刪除按鈕
const UserBulkActionButtons = (props) => (
    <BulkDeleteButton {...props} label="批次刪除" />
);

const UserList = (props) => (
    <List {...props} filters={<UserFilter />} bulkActionButtons={<UserBulkActionButtons />} title="使用者清單">
        <Datagrid rowClick="edit" rowStyle={(record, index) => ({ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#fff' })}>
            <Checkbox />
            <TextField source="id" label="ID" />
            <TextField source="username" label="帳號" />
            <TextField source="name" label="姓名" />
            <EmailField source="email" label="電子郵件" />
            <TextField source="status" label="狀態" />
            <EditButton basePath="/users" label="編輯" />
            <DeleteButton basePath="/users" label="刪除" />
            <ShowButton basePath="/users" label="查看" />
        </Datagrid>
    </List>
);

export default UserList;
