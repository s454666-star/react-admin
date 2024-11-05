import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    DateField,
    SelectInput,
    EditButton,
    DeleteButton,
    Create,
    SimpleForm,
    ReferenceInput,
    TextInput,
    SelectArrayInput,
    Edit,
    Filter,
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
    <List {...props} filters={<OrderFilter />}>
        <Datagrid>
            <TextField source="id" />
            <ReferenceField source="member_id" reference="members" label="會員">
                <TextField source="name" />
            </ReferenceField>
            <TextField source="status" label="狀態" />
            <DateField source="created_at" label="創建時間" />
            <DateField source="updated_at" label="更新時間" />
            <EditButton />
            <DeleteButton />
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
            <TextInput source="notes" label="備註" multiline />
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
            <TextInput source="notes" label="備註" multiline />
        </SimpleForm>
    </Edit>
);
