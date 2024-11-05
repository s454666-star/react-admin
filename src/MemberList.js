import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    EmailField,
    EditButton,
    DeleteButton,
    ShowButton,
    TextInput,
    Filter,
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
            <TextField source="status" label="狀態" />
            <TextField source="is_admin" label="是否管理員" />
            <EditButton />
            <DeleteButton />
            <ShowButton />
        </Datagrid>
    </List>
);
