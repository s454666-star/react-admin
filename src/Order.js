// src/Order.js

import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    DateField,
    SelectInput,
    SelectField,
    EditButton,
    DeleteButton,
    ShowButton,
    Create,
    SimpleForm,
    ReferenceInput,
    TextInput,
    Edit,
    Filter,
    Show,
    SimpleShowLayout,
    NumberInput,
    FunctionField,
    NumberField,
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
    <List {...props} filters={<OrderFilter />} perPage={25} title="訂單列表">
        <Datagrid rowClick="show">
            <TextField source="id" label="ID" />
            {/* 會員名稱和地址 */}
            <ReferenceField source="member_id" reference="members" label="會員" link={false}>
                <FunctionField
                    render={(record) => (
                        <span>
                            <div><strong>姓名:</strong> {record.name}</div>
                            <div><strong>地址:</strong> {record.address}</div>
                        </span>
                    )}
                />
            </ReferenceField>
            <TextField source="order_number" label="訂單編號" />
            <SelectField source="status" label="狀態" choices={orderStatusChoices} />
            {/* 顯示訂單品項 */}
            <FunctionField
                label="訂單品項"
                render={(record) => (
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        {record.orderItems && record.orderItems.length > 0 ? (
                            record.orderItems.map((item) => (
                                <li key={item.id}>
                                    {item.product ? item.product.name : '無產品名稱'} - 數量: {item.quantity} - 價格: {item.price}
                                </li>
                            ))
                        ) : (
                            <li>無品項</li>
                        )}
                    </ul>
                )}
            />
            {/* 訂單總金額 */}
            <FunctionField
                label="總金額"
                render={(record) => {
                    const totalItemsPrice = record.orderItems
                        ? record.orderItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
                        : 0;
                    const totalAmount = totalItemsPrice + Number(record.shipping_fee || 0);
                    return `${totalAmount.toFixed(2)} 元`;
                }}
            />
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
    <Create {...props} title="建立訂單">
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
    <Edit {...props} title="編輯訂單">
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
    <Show {...props} title="訂單詳情">
        <SimpleShowLayout>
            <TextField source="id" label="ID" />
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
            {/* 訂單明細 */}
            <FunctionField
                label="訂單明細"
                render={(record) => (
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        {record.orderItems && record.orderItems.length > 0 ? (
                            record.orderItems.map((item) => (
                                <li key={item.id}>
                                    {item.product ? item.product.name : '無產品名稱'} - 數量: {item.quantity} - 價格: {item.price}
                                </li>
                            ))
                        ) : (
                            <li>無品項</li>
                        )}
                    </ul>
                )}
            />
        </SimpleShowLayout>
    </Show>
);
