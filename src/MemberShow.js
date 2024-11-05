import React from 'react';
import {
    Show,
    SimpleShowLayout,
    TextField,
    EmailField,
    BooleanField,
    DateField,
} from 'react-admin';

// 會員詳情
export const MemberShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="username" label="帳號" />
            <TextField source="name" label="姓名" />
            <EmailField source="email" label="電子郵件" />
            <TextField source="phone" label="電話" />
            <TextField source="address" label="地址" />
            <BooleanField source="is_admin" label="是否管理員" />
            <TextField source="status" label="狀態" />
            <DateField source="created_at" label="創建時間" />
            <DateField source="updated_at" label="更新時間" />
        </SimpleShowLayout>
    </Show>
);
