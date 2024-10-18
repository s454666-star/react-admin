// src/UserEdit.js
import React from 'react';
import { Edit, SimpleForm, TextInput, SelectInput, required } from 'react-admin';

const validateEmail = [required(), (value) => (/.+@.+\..+/.test(value) ? undefined : '請輸入有效的電子郵件')];

const UserEdit = (props) => (
    <Edit title="編輯使用者" {...props}>
        <SimpleForm>
            <TextInput source="username" label="帳號" validate={required()} />
            <TextInput source="name" label="姓名" validate={required()} />
            <TextInput source="email" label="電子郵件" validate={validateEmail} />
            <TextInput source="phone" label="電話" />
            <TextInput source="address" label="地址" />
            <SelectInput source="status" label="狀態" choices={[
                { id: 'active', name: '啟用' },
                { id: 'inactive', name: '停用' },
                { id: 'banned', name: '封鎖' }
            ]} />
        </SimpleForm>
    </Edit>
);

export default UserEdit;
