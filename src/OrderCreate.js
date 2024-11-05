import React from 'react';
import {
    Edit,
    SimpleForm,
    ReferenceInput,
    SelectInput,
    TextInput,
    NumberInput,
    BooleanInput,
} from 'react-admin';

// 訂單編輯
export const OrderEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="order_number" label="訂單編號" disabled />
            <ReferenceInput source="member_id" reference="members" label="會員" required>
                <SelectInput optionText="name" />
            </ReferenceInput>
            <SelectInput source="status" label="狀態" choices={[
                { id: 'pending', name: '待處理' },
                { id: 'processing', name: '處理中' },
                { id: 'completed', name: '已完成' },
                { id: 'cancelled', name: '已取消' },
            ]} />
            <TextInput source="payment_method" label="付款方式" />
            <NumberInput source="shipping_fee" label="運費" />
            <TextInput source="notes" label="備註" multiline />
        </SimpleForm>
    </Edit>
);
