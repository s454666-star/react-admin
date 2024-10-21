import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, Create, SimpleForm, TextInput, Edit, required } from 'react-admin';
import { Card, CardContent, CardHeader, Button, Typography } from '@mui/material';
import { useNotify, useRedirect, useRefresh } from 'react-admin';
import { makeStyles } from '@mui/styles';

// 自定義樣式
const useStyles = makeStyles({
    card: {
        backgroundColor: '#f5f5f5',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        '&:hover': {
            boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
        },
    },
    header: {
        color: '#1976d2',
    },
});

// 商品類別清單頁面
export const ProductCategoryList = (props) => {
    const classes = useStyles();
    return (
        <List {...props} title="商品類別清單">
            <Card className={classes.card}>
                <CardHeader className={classes.header} title="商品類別" />
                <CardContent>
                    <Datagrid rowClick="edit">
                        <TextField source="id" label="編號" />
                        <TextField source="category_name" label="名稱" />
                        <TextField source="description" label="描述" />
                        <EditButton />
                        <DeleteButton />
                    </Datagrid>
                </CardContent>
            </Card>
        </List>
    );
};

// 商品類別新增頁面
export const ProductCategoryCreate = (props) => {
    const classes = useStyles();
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();

    const onSuccess = () => {
        notify('新增成功', { type: 'success' });
        redirect('/product-categories');
        refresh();
    };

    return (
        <Create {...props} onSuccess={onSuccess} title="新增商品類別">
            <Card className={classes.card}>
                <CardHeader className={classes.header} title="新增商品類別" />
                <CardContent>
                    <SimpleForm>
                        <TextInput source="category_name" label="名稱" validate={required()} />
                        <TextInput source="description" label="描述" />
                    </SimpleForm>
                </CardContent>
            </Card>
        </Create>
    );
};

// 商品類別編輯頁面
export const ProductCategoryEdit = (props) => {
    const classes = useStyles();
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();

    const onSuccess = () => {
        notify('更新成功', { type: 'success' });
        redirect('/product-categories');
        refresh();
    };

    return (
        <Edit {...props} onSuccess={onSuccess} title="編輯商品類別">
            <Card className={classes.card}>
                <CardHeader className={classes.header} title="編輯商品類別" />
                <CardContent>
                    <SimpleForm>
                        <TextInput source="category_name" label="名稱" validate={required()} />
                        <TextInput source="description" label="描述" />
                    </SimpleForm>
                </CardContent>
            </Card>
        </Edit>
    );
};
