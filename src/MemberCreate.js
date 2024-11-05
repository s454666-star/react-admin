import React from 'react';
import {
    Create,
    SimpleForm,
    TextInput,
    BooleanInput,
    SelectInput,
} from 'react-admin';

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
            <SelectInput
                source="status"
                label="狀態"
                choices={[
                    { id: 'active', name: '啟用' },
                    { id: 'inactive', name: '停用' },
                ]}
                defaultValue="active"
            />
        </SimpleForm>
    </Create>
);
