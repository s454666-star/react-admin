// src/UserCreate.js
import React from 'react';
import {Create, SimpleForm, TextInput, SelectInput, required, useNotify, useRedirect} from 'react-admin';

const validateEmail = [required(), (value) => (/.+@.+\..+/.test(value) ? undefined : '請輸入有效的電子郵件')];

const UserCreate = (props) => {
    const notify = useNotify();
    const redirect = useRedirect();

    // 在保存成功後顯示通知並跳轉回列表頁
    const onSuccess = () => {
        notify('新增成功', {type: 'info'});
        redirect('/users'); // 確保正確跳轉到列表頁
    };

    return (
        <Create title="新增使用者" {...props} mutationOptions={{onSuccess}}>
            <SimpleForm>
                <TextInput source="username" label="帳號" validate={required()}/>
                <TextInput source="password" label="密碼" validate={required()}/>
                <TextInput source="name" label="姓名" validate={required()}/>
                <TextInput source="email" label="電子郵件" validate={validateEmail}/>
                <TextInput source="phone" label="電話"/>
                <TextInput source="address" label="地址"/>
                <SelectInput source="status" label="狀態" choices={[
                    {id: 'active', name: '啟用'},
                    {id: 'inactive', name: '停用'},
                    {id: 'banned', name: '封鎖'}
                ]}/>
            </SimpleForm>
        </Create>
    );
};

export default UserCreate;
