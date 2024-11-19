// src/ReturnOrderList.js

import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    DateField,
    SelectInput,
    FunctionField,
    Filter,
    useUpdate,
    useNotify,
    useRefresh,
} from 'react-admin';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import * as XLSX from 'xlsx';

// 自定義樣式
const useStyles = makeStyles({
    formControl: {
        minWidth: 120,
    },
});

// 退貨單狀態選項
const returnOrderStatusChoices = [
    { id: '已接收', name: '已接收' },
    { id: '物流運送中', name: '物流運送中' },
    { id: '已完成', name: '已完成' },
    { id: '已取消', name: '已取消' },
];

// 退貨單篩選器
const ReturnOrderFilter = (props) => (
    <Filter {...props}>
        <TextField label="搜尋" source="q" />
        <SelectInput label="狀態" source="status" choices={returnOrderStatusChoices} />
    </Filter>
);

// 自定義狀態編輯欄位
const StatusEditField = ({ record }) => {
    const classes = useStyles();
    const [status, setStatus] = React.useState(record ? record.status : '');
    const [update] = useUpdate();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleChange = (event) => {
        const newStatus = event.target.value;
        if (!record) return;
        update(
            'return-orders',
            { id: record.id, data: { status: newStatus } },
            {
                onSuccess: () => {
                    notify('退貨單狀態已更新', { type: 'info' });
                    refresh();
                },
                onFailure: () => {
                    notify('更新失敗', { type: 'warning' });
                },
            }
        );
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
                {returnOrderStatusChoices.map(choice => (
                    <MenuItem key={choice.id} value={choice.id}>
                        {choice.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

// 自定義匯出為XLSX的函數
const exportToXLSX = (data) => {
    const exportData = data.map(returnOrder => ({
        退貨單號: returnOrder.return_order_number,
        退貨日期: returnOrder.return_date,
        原訂單單號: returnOrder.order.order_number,
        退貨會員: returnOrder.member.name,
        退貨商品: returnOrder.orderItem.product.product_name,
        退貨數量: returnOrder.return_quantity,
        退貨原因: returnOrder.reason,
        會員配送地址: returnOrder.member && returnOrder.member.address ? returnOrder.member.address : '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '退貨單');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'return_orders.xlsx';
    link.click();
    URL.revokeObjectURL(url);
};

// 退貨單列表
export const ReturnOrderList = (props) => (
    <List
        {...props}
        filters={<ReturnOrderFilter />}
        perPage={25}
        title="退貨單列表"
        exporter={exportToXLSX}
        sort={{ field: 'return_date', order: 'DESC' }}
    >
        <Datagrid rowClick={false}>
            <TextField source="return_order_number" label="退貨單號" />
            <DateField source="return_date" label="退貨日期" />
            <ReferenceField source="order_id" reference="orders" label="原訂單單號" link={false}>
                <TextField source="order_number" />
            </ReferenceField>
            <ReferenceField source="member_id" reference="members" label="退貨會員" link={false}>
                <TextField source="name" />
            </ReferenceField>
            <FunctionField
                label="退貨商品"
                render={(record) => record.orderItem && record.orderItem.product ? record.orderItem.product.product_name : ''}
            />
            <TextField source="return_quantity" label="退貨數量" />
            <TextField source="reason" label="退貨原因" />
            <FunctionField
                label="會員配送地址"
                render={(record) => record.member && record.member.address ? record.member.address : ''}
            />
            <FunctionField
                label="狀態"
                render={(record) => <StatusEditField record={record} />}
            />
        </Datagrid>
    </List>
);
