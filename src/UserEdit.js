// src/UserEdit.js
import React from 'react';
import { Edit, SimpleForm, TextInput, SelectInput, EmailInput, required } from 'react-admin';

const validateEmail = [required(), (value) => (/.+@.+\..+/.test(value) ? undefined : '請輸入有效的電子郵件')];
const validateUsername = required('帳號為必填項');
const validateName = required('姓名為必填項');

const UserEdit = (props) => (
    <Edit title="編輯使用者" {...props}>
        <SimpleForm>
            <TextInput source="username" label="帳號" validate={validateUsername} />
            <TextInput source="name" label="姓名" validate={validateName} />
            <EmailInput source="email" label="電子郵件" validate={validateEmail} />
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
