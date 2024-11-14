// src/Member.js

import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    EmailField,
    EditButton,
    DeleteButton,
    Create,
    SimpleForm,
    TextInput,
    Edit,
    Filter,
    Show,
    SimpleShowLayout,
    BooleanInput,
    DateField,
} from 'react-admin';

// 會員列表篩選器
const MemberFilter = (props) => (
    <Filter {...props}>
        <TextInput label="搜尋" source="q" alwaysOn />
        <TextInput label="姓名" source="name" />
        <TextInput label="電子郵件" source="email" type="email" />
    </Filter>
);

// 會員列表
export const MemberList = (props) => (
    <List {...props} filters={<MemberFilter />} perPage={25}>
        <Datagrid rowClick="show">
            <TextField source="id" />
            <TextField source="username" label="帳號" />
            <TextField source="name" label="姓名" />
            <EmailField source="email" label="電子郵件" />
            <TextField source="phone" label="電話" />
            <TextField source="address" label="地址" />
            <BooleanInput source="is_admin" label="是否管理員" disabled />
            <TextField source="status" label="狀態" />
            <DateField source="created_at" label="創建時間" />
            <DateField source="updated_at" label="更新時間" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

// 會員創建
export const MemberCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="username" label="帳號" required />
            <TextInput source="password" label="密碼" type="password" required />
            <TextInput source="name" label="姓名" required />
            <TextInput source="email" label="電子郵件" type="email" required />
            <TextInput source="phone" label="電話" />
            <TextInput source="address" label="地址" />
            <BooleanInput source="is_admin" label="是否管理員" />
            <TextInput source="status" label="狀態" defaultValue="active" />
        </SimpleForm>
    </Create>
);

// 會員編輯
export const MemberEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextField source="id" label="ID" />
            <TextInput source="username" label="帳號" disabled />
            <TextInput source="password" label="密碼" type="password" helperText="留空則不更改" />
            <TextInput source="name" label="姓名" required />
            <TextInput source="email" label="電子郵件" type="email" required />
            <TextInput source="phone" label="電話" />
            <TextInput source="address" label="地址" />
            <BooleanInput source="is_admin" label="是否管理員" />
            <TextInput source="status" label="狀態" />
            <DateField source="created_at" label="創建時間" />
            <DateField source="updated_at" label="更新時間" />
        </SimpleForm>
    </Edit>
);

// 會員顯示詳情
export const MemberShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="username" label="帳號" />
            <TextField source="name" label="姓名" />
            <EmailField source="email" label="電子郵件" />
            <TextField source="phone" label="電話" />
            <TextField source="address" label="地址" />
            <BooleanInput source="is_admin" label="是否管理員" disabled />
            <TextField source="status" label="狀態" />
            <DateField source="created_at" label="創建時間" />
            <DateField source="updated_at" label="更新時間" />
        </SimpleShowLayout>
    </Show>
);
