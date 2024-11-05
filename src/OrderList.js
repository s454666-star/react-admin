import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    DateField,
    SelectField,
    EditButton,
    DeleteButton,
    ShowButton,
    Filter,
    TextInput,
    SelectInput,
    ReferenceInput,
} from 'react-admin';

// 訂單狀態選項
const orderStatusChoices = [
    { id: 'pending', name: '待處理' },
    { id: 'processing', name: '處理中' },
    { id: 'completed', name: '已完成' },
    { id: 'cancelled', name: '已取消' },
];

// 訂單列表篩選器
const OrderFilter = (props) => (
    <Filter {...props}>
        <TextInput label="搜尋" source="q" alwaysOn />
        <SelectInput label="狀態" source="status" choices={orderStatusChoices} />
        <ReferenceInput label="會員" source="member_id" reference="members">
            <SelectInput optionText="name" />
        </ReferenceInput>
    </Filter>
);

// 訂單列表
export const OrderList = (props) => (
    <List {...props} filters={<OrderFilter />} perPage={25}>
        <Datagrid rowClick="show">
            <TextField source="id" />
            <TextField source="order_number" label="訂單編號" />
            <ReferenceField source="member_id" reference="members" label="會員">
                <TextField source="name" />
            </ReferenceField>
            <SelectField source="status" label="狀態" choices={orderStatusChoices} />
            <TextField source="payment_method" label="付款方式" />
            <TextField source="shipping_fee" label="運費" />
            <DateField source="created_at" label="創建時間" />
            <DateField source="updated_at" label="更新時間" />
            <EditButton />
            <DeleteButton />
            <ShowButton />
        </Datagrid>
    </List>
);
