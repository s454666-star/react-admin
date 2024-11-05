import React from 'react';
import {
    Edit,
    SimpleForm,
    TextInput,
    BooleanInput,
    SelectInput,
    PasswordInput,
} from 'react-admin';

// 會員編輯
export const MemberEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="username" label="帳號" disabled />
            <PasswordInput source="password" label="密碼" helperText="留空則不更改" />
            <TextInput source="name" label="姓名" required />
            <TextInput source="email" label="電子郵件" type="email" required />
            <TextInput source="phone" label="電話" />
            <TextInput source="address" label="地址" />
            <BooleanInput source="is_admin" label="是否管理員" />
            <SelectInput
                source="status"
                label="狀態"
                choices={[
                    { id: 'active', name: '啟用' },
                    { id: 'inactive', name: '停用' },
                ]}
            />
        </SimpleForm>
    </Edit>
);
