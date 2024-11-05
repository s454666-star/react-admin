import React from 'react';
import {
    Show,
    SimpleShowLayout,
    TextField,
    ReferenceField,
    DateField,
    SelectField,
    NumberField,
    ArrayField,
    Datagrid,
    NumberInput,
} from 'react-admin';

// 訂單詳情
export const OrderShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="order_number" label="訂單編號" />
            <ReferenceField source="member_id" reference="members" label="會員">
                <TextField source="name" />
            </ReferenceField>
            <SelectField source="status" label="狀態" choices={[
                { id: 'pending', name: '待處理' },
                { id: 'processing', name: '處理中' },
                { id: 'completed', name: '已完成' },
                { id: 'cancelled', name: '已取消' },
            ]} />
            <TextField source="payment_method" label="付款方式" />
            <NumberField source="shipping_fee" label="運費" />
            <TextField source="notes" label="備註" />
            <DateField source="created_at" label="創建時間" />
            <DateField source="updated_at" label="更新時間" />
            <ArrayField source="orderItems" label="訂單明細">
                <Datagrid>
                    <TextField source="id" label="品項ID" />
                    <ReferenceField source="product_id" reference="products" label="產品名稱">
                        <TextField source="name" />
                    </ReferenceField>
                    <NumberField source="quantity" label="數量" />
                    <NumberField source="price" label="價格" />
                </Datagrid>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
);
