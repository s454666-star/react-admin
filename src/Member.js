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
    EmailInput,
    Edit,
    Filter,
} from 'react-admin';

// 會員列表篩選器
const MemberFilter = (props) => (
    <Filter {...props}>
        <TextInput label="搜尋" source="q" alwaysOn />
        <TextInput label="姓名" source="name" />
        <EmailInput label="電子郵件" source="email" />
    </Filter>
);

// 會員列表
export const MemberList = (props) => (
    <List {...props} filters={<MemberFilter />}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" label="姓名" />
            <EmailField source="email" label="電子郵件" />
            <TextField source="phone" label="電話" />
            <TextField source="address" label="地址" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

// 會員創建
export const MemberCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" label="姓名" required />
            <EmailInput source="email" label="電子郵件" required />
            <TextInput source="phone" label="電話" />
            <TextInput source="address" label="地址" />
        </SimpleForm>
    </Create>
);

// 會員編輯
export const MemberEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" label="姓名" required />
            <EmailInput source="email" label="電子郵件" required />
            <TextInput source="phone" label="電話" />
            <TextInput source="address" label="地址" />
        </SimpleForm>
    </Edit>
);
