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
import { Grid, Card, CardContent, CardHeader } from '@mui/material';
import { makeStyles } from '@mui/styles';

// 自定義樣式
const useStyles = makeStyles({
    formCard: {
        maxWidth: '85%',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fafafa',
    },
    header: {
        backgroundColor: '#1976d2',
        color: '#fff',
        borderRadius: '8px 8px 0 0',
    },
    gridItem: {
        marginBottom: '16px',
    },
});

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
export const OrderList = (props) => {
    const classes = useStyles();
    return (
        <List {...props} filters={<OrderFilter />} perPage={25} title="訂單列表">
            <Datagrid rowClick="show">
                <TextField source="id" label="ID" />
                {/* 會員名稱 */}
                <ReferenceField source="member_id" reference="members" label="會員" link={false}>
                    <TextField source="name" />
                </ReferenceField>
                {/* 配送地址 */}
                <FunctionField
                    label="配送地址"
                    render={(record) => (
                        <span>
                            {record.delivery_address
                                ? record.delivery_address.address
                                : '無配送地址'}
                        </span>
                    )}
                />
                <TextField source="order_number" label="訂單編號" />
                <SelectField source="status" label="狀態" choices={orderStatusChoices} />
                {/* 顯示訂單品項 */}
                <FunctionField
                    label="訂單品項"
                    render={(record) => (
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            {record.order_items && record.order_items.length > 0 ? (
                                record.order_items.map((item) => (
                                    <li key={item.id}>
                                        {item.product ? item.product.product_name : '無產品名稱'} - 數量: {item.quantity} - 價格: {item.price}
                                    </li>
                                ))
                            ) : (
                                <li>無品項</li>
                            )}
                        </ul>
                    )}
                />
                {/* 訂單總金額 */}
                <TextField source="total_amount" label="總金額" />
                <DateField source="created_at" label="創建時間" />
                <DateField source="updated_at" label="更新時間" />
                <EditButton />
                <DeleteButton />
                <ShowButton />
            </Datagrid>
        </List>
    );
};

// 訂單創建
export const OrderCreate = (props) => {
    const classes = useStyles();
    return (
        <Create {...props} title="新增訂單">
            <Card className={classes.formCard}>
                <CardHeader className={classes.header} title="新增訂單" />
                <CardContent>
                    <SimpleForm>
                        <Grid container>
                            <Grid item xs={12} className={classes.gridItem}>
                                <ReferenceInput source="member_id" reference="members" label="會員" required fullWidth>
                                    <SelectInput optionText="name" />
                                </ReferenceInput>
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <SelectInput source="status" label="狀態" choices={orderStatusChoices} defaultValue="pending" fullWidth />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <TextInput source="payment_method" label="付款方式" fullWidth />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <NumberInput source="shipping_fee" label="運費" fullWidth />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <TextInput source="notes" label="備註" multiline fullWidth />
                            </Grid>
                        </Grid>
                    </SimpleForm>
                </CardContent>
            </Card>
        </Create>
    );
};

// 訂單編輯
export const OrderEdit = (props) => {
    const classes = useStyles();
    return (
        <Edit {...props} title="編輯訂單">
            <Card className={classes.formCard}>
                <CardHeader className={classes.header} title="編輯訂單" />
                <CardContent>
                    <SimpleForm>
                        <Grid container>
                            <Grid item xs={12} className={classes.gridItem}>
                                <ReferenceInput source="member_id" reference="members" label="會員" required fullWidth>
                                    <SelectInput optionText="name" />
                                </ReferenceInput>
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <SelectInput source="status" label="狀態" choices={orderStatusChoices} fullWidth />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <TextInput source="payment_method" label="付款方式" fullWidth />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <NumberInput source="shipping_fee" label="運費" fullWidth />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <TextInput source="notes" label="備註" multiline fullWidth />
                            </Grid>
                        </Grid>
                    </SimpleForm>
                </CardContent>
            </Card>
        </Edit>
    );
};

// 訂單顯示詳情
export const OrderShow = (props) => {
    const classes = useStyles();
    return (
        <Show {...props} title="訂單詳情">
            <SimpleShowLayout>
                <Grid container>
                    <Grid item xs={12} className={classes.gridItem}>
                        <TextField source="id" label="ID" />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <ReferenceField source="member_id" reference="members" label="會員">
                            <TextField source="name" />
                        </ReferenceField>
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <FunctionField
                            label="配送地址"
                            render={(record) => (
                                <span>
                                    {record.delivery_address
                                        ? record.delivery_address.address
                                        : '無配送地址'}
                                </span>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <TextField source="order_number" label="訂單編號" />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <SelectField source="status" label="狀態" choices={orderStatusChoices} />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <TextField source="payment_method" label="付款方式" />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <NumberField source="shipping_fee" label="運費" />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <TextField source="notes" label="備註" />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <DateField source="created_at" label="創建時間" />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <DateField source="updated_at" label="更新時間" />
                    </Grid>
                    {/* 訂單明細 */}
                    <Grid item xs={12} className={classes.gridItem}>
                        <FunctionField
                            label="訂單明細"
                            render={(record) => (
                                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                    {record.order_items && record.order_items.length > 0 ? (
                                        record.order_items.map((item) => (
                                            <li key={item.id}>
                                                {item.product ? item.product.product_name : '無產品名稱'} - 數量: {item.quantity} - 價格: {item.price}
                                            </li>
                                        ))
                                    ) : (
                                        <li>無品項</li>
                                    )}
                                </ul>
                            )}
                        />
                    </Grid>
                </Grid>
            </SimpleShowLayout>
        </Show>
    );
}
