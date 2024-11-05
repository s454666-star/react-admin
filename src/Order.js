import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    DateField,
    SelectInput,
    SelectField, // 已添加
    EditButton,
    DeleteButton,
    ShowButton, // 已添加
    Create,
    SimpleForm,
    ReferenceInput,
    TextInput,
    Edit,
    Filter,
    Show,
    SimpleShowLayout,
    NumberInput, // 已更改
} from 'react-admin';

// 訂單狀態選項
const orderStatusChoices = [
    { id: 'pending', name: '待處理' },
    { id: 'processing', name: '處理中' },
    { id: 'completed', name: '已完成' },
    { id: 'cancelled', name: '已取消' },
];

// 訂單篩選器
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
            <ReferenceField source="member_id" reference="members" label="會員">
                <TextField source="name" />
            </ReferenceField>
            <TextField source="order_number" label="訂單編號" />
            <SelectField source="status" label="狀態" choices={orderStatusChoices} />
            <DateField source="created_at" label="創建時間" />
            <DateField source="updated_at" label="更新時間" />
            <EditButton />
            <DeleteButton />
            <ShowButton />
        </Datagrid>
    </List>
);

// 訂單創建
export const OrderCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <ReferenceInput source="member_id" reference="members" label="會員" required>
                <SelectInput optionText="name" />
            </ReferenceInput>
            <SelectInput source="status" label="狀態" choices={orderStatusChoices} defaultValue="pending" />
            <TextInput source="payment_method" label="付款方式" />
            <TextInput source="notes" label="備註" multiline />
            <NumberInput source="shipping_fee" label="運費" />
            {/* 如果需要訂單明細，可以使用 ArrayInput */}
        </SimpleForm>
    </Create>
);

// 訂單編輯
export const OrderEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <ReferenceInput source="member_id" reference="members" label="會員" required>
                <SelectInput optionText="name" />
            </ReferenceInput>
            <SelectInput source="status" label="狀態" choices={orderStatusChoices} />
            <TextInput source="payment_method" label="付款方式" />
            <TextInput source="notes" label="備註" multiline />
            <NumberInput source="shipping_fee" label="運費" />
        </SimpleForm>
    </Edit>
);

// 訂單顯示詳情
export const OrderShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <ReferenceField source="member_id" reference="members" label="會員">
                <TextField source="name" />
            </ReferenceField>
            <TextField source="order_number" label="訂單編號" />
            <SelectField source="status" label="狀態" choices={orderStatusChoices} />
            <TextField source="payment_method" label="付款方式" />
            <TextField source="notes" label="備註" />
            <NumberField source="shipping_fee" label="運費" />
            <DateField source="created_at" label="創建時間" />
            <DateField source="updated_at" label="更新時間" />
            {/* 如果有訂單明細，可以使用 ArrayField */}
            {/* <ArrayField source="orderItems" label="訂單明細">
                <Datagrid>
                    <TextField source="id" label="品項ID" />
                    <ReferenceField source="product_id" reference="products" label="產品名稱">
                        <TextField source="name" />
                    </ReferenceField>
                    <NumberField source="quantity" label="數量" />
                    <NumberField source="price" label="價格" />
                </Datagrid>
            </ArrayField> */}
        </SimpleShowLayout>
    </Show>
);
