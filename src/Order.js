// src/Order.js
import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    DateField,
    SelectInput,
    Create,
    SimpleForm,
    ReferenceInput,
    TextInput,
    Filter,
    FunctionField,
    NumberInput,
    useUpdate,
    useNotify,
    useRefresh,
} from 'react-admin';
import { Grid, Card, CardContent, CardHeader, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { formatAmount } from './utils';

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
    formControl: {
        width: '100%',
    },
});

// 訂單狀態選項
const orderStatusChoices = [
    { id: 'pending', name: '購物車 (未付款)' },
    { id: 'processing', name: '已付款' },
    { id: 'shipped', name: '已出貨' },
    { id: 'completed', name: '已完成訂單' },
    { id: 'cancelled', name: '已取消訂單' },
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

// 自定義狀態編輯欄位
const StatusEditField = ({ record }) => {
    const classes = useStyles();
    const [status, setStatus] = React.useState(record ? record.status : '');
    const update = useUpdate();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleChange = (event) => {
        const newStatus = event.target.value;
        if (!record) return;
        update('orders', record.id, { status: newStatus }, {
            onSuccess: () => {
                notify('訂單狀態已更新', 'info');
                refresh();
            },
            onFailure: () => {
                notify('更新失敗', 'warning');
            },
        });
        setStatus(newStatus);
    };

    if (!record) return null;

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id={`status-select-label-${record.id}`}>狀態</InputLabel>
            <Select
                labelId={`status-select-label-${record.id}`}
                value={status}
                onChange={handleChange}
                label="狀態"
            >
                {orderStatusChoices.map(choice => (
                    <MenuItem key={choice.id} value={choice.id}>
                        {choice.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

// 訂單列表
export const OrderList = (props) => {
    const classes = useStyles();
    return (
        <List {...props} filters={<OrderFilter />} perPage={25} title="訂單列表">
            <Datagrid>
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
                            {record.delivery_address && (record.delivery_address.city || record.delivery_address.address)
                                ? `${record.delivery_address.city || ''} ${record.delivery_address.address || ''}`
                                : '無配送地址'}
                        </span>
                    )}
                />
                <TextField source="order_number" label="訂單編號" />
                {/* 狀態編輯 */}
                <FunctionField
                    label="狀態"
                    render={(record) => <StatusEditField record={record} />}
                />
                {/* 訂單總金額 */}
                <FunctionField
                    label="總金額"
                    render={(record) => formatAmount(Math.round(record.total_amount))}
                />
                <DateField source="created_at" label="創建時間" />
                <DateField source="updated_at" label="更新時間" />
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

// 訂單編輯（移除編輯功能）
export const OrderEdit = (props) => {
    return null;
};

// 訂單顯示詳情（移除訪問）
export const OrderShow = (props) => {
    return null;
};
