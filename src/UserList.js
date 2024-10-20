import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    EmailField,
    TextInput,
    Filter,
    EditButton,
    DeleteButton,
    ShowButton,
    BulkDeleteButton
} from 'react-admin';
import { makeStyles } from '@mui/styles';

// 自定義樣式 (滑鼠移到哪裡  哪個row就高亮效果)
const useStyles = makeStyles({
    rowEven: {
        backgroundColor: '#f5f5f5',
        '&:hover': {
            backgroundColor: '#e0e0e0', // 高亮效果
        },
    },
    rowOdd: {
        backgroundColor: '#ffffff',
        '&:hover': {
            backgroundColor: '#e0e0e0', // 高亮效果
        },
    },
});

const UserFilter = (props) => (
    <Filter {...props}>
        <TextInput label="搜尋名稱" source="q" alwaysOn />
    </Filter>
);

const UserList = (props) => {
    const classes = useStyles();

    return (
        <List {...props} filters={<UserFilter />} bulkActionButtons={<BulkDeleteButton label="批次刪除" />} title="使用者清單">
            <Datagrid
                rowClick="edit"
                rowStyle={(record, index) => ({
                    className: index % 2 === 0 ? classes.rowEven : classes.rowOdd,
                })}
            >
                <TextField source="id" label="ID" />
                <TextField source="username" label="帳號" />
                <TextField source="name" label="姓名" />
                <EmailField source="email" label="電子郵件" />
                <TextField source="status" label="狀態" />
                <EditButton basePath="/users" label="編輯" />
                <DeleteButton basePath="/users" label="刪除" />
                <ShowButton basePath="/users" label="查看" />
            </Datagrid>
        </List>
    );
};

export default UserList;
