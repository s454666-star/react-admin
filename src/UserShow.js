// src/UserShow.js
import React from 'react';
import { Show, SimpleShowLayout, TextField, EmailField } from 'react-admin';

const UserShow = (props) => (
    <Show title="查看使用者" {...props}>
        <SimpleShowLayout>
            <TextField source="id" label="ID" />
            <TextField source="username" label="帳號" />
            <TextField source="name" label="姓名" />
            <EmailField source="email" label="電子郵件" />
            <TextField source="phone" label="電話" />
            <TextField source="address" label="地址" />
            <TextField source="status" label="狀態" />
        </SimpleShowLayout>
    </Show>
);

export default UserShow;
