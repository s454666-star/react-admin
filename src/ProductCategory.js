// src/ProductCategory.js

import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    EditButton,
    DeleteButton,
    Create,
    SimpleForm,
    TextInput,
    Edit,
    SelectInput,
    required,
    Toolbar,
    SaveButton,
    useNotify,
    useRedirect,
    useRefresh,
    Show,
    SimpleShowLayout,
} from 'react-admin';
import { Card, CardContent, CardHeader, Grid, Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Helmet } from 'react-helmet';
import * as XLSX from 'xlsx';

// 自定義樣式
const useStyles = makeStyles({
    card: {
        maxWidth: '85%',
        margin: '40px auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        backgroundColor: '#ffffff',
    },
    header: {
        backgroundColor: '#1976d2',
        color: '#ffffff',
        padding: '10px 20px',
        borderRadius: '10px 10px 0 0',
    },
    formGrid: {
        width: '100%',
    },
    formItem: {
        marginBottom: '20px',
    },
});

// 自定義 Toolbar
const CustomToolbar = props => (
    <Toolbar {...props}>
        <SaveButton />
    </Toolbar>
);

// 自定義匯出為XLSX的函數
const exportToXLSX = (data) => {
    const exportData = data.map(category => ({
        編號: category.id,
        名稱: category.category_name,
        描述: category.description || '無',
        狀態: category.status === 1 ? '啟用' : '停用',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '商品類別');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'product_categories.xlsx';
    link.click();
    URL.revokeObjectURL(url);
};

// 商品類別清單頁面
export const ProductCategoryList = (props) => {
    const classes = useStyles();
    return (
        <>
            <Helmet>
                <title>星夜後台</title>
                <link rel="icon" href="/icon_198x278.png" type="image/png" />
            </Helmet>
            <List
                {...props}
                title="商品類別清單"
                exporter={exportToXLSX}
                perPage={25}
                sort={{ field: 'id', order: 'ASC' }}
            >
                <Card className={classes.card}>
                    <CardHeader className={classes.header} title="商品類別清單" />
                    <CardContent>
                        <Datagrid rowClick="edit">
                            <TextField source="id" label="編號" />
                            <TextField source="category_name" label="名稱" />
                            <TextField source="description" label="描述" />
                            <TextField source="status" label="狀態" />
                            <EditButton />
                            <DeleteButton />
                        </Datagrid>
                    </CardContent>
                </Card>
            </List>
        </>
    );
};

// 商品類別新增頁面
export const ProductCategoryCreate = (props) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const classes = useStyles();

    const onSuccess = () => {
        notify('新增成功', { type: 'success' });
        redirect('/product-categories');
        refresh();
    };

    return (
        <>
            <Helmet>
                <title>星夜後台</title>
                <link rel="icon" href="/icon_198x278.png" type="image/png" />
            </Helmet>
            <Create {...props} mutationOptions={{ onSuccess }} title="新增商品類別">
                <Card className={classes.card}>
                    <CardHeader className={classes.header} title="新增商品類別" />
                    <CardContent>
                        <SimpleForm toolbar={<CustomToolbar />} redirect="list">
                            <Grid container className={classes.formGrid}>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextInput
                                        source="category_name"
                                        label="名稱"
                                        validate={required()}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextInput
                                        source="description"
                                        label="描述"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <SelectInput
                                        source="status"
                                        label="狀態"
                                        choices={[
                                            { id: 1, name: '啟用' },
                                            { id: 0, name: '停用' },
                                        ]}
                                        validate={required()}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </SimpleForm>
                    </CardContent>
                </Card>
            </Create>
        </>
    );
};

// 商品類別編輯頁面
export const ProductCategoryEdit = (props) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const classes = useStyles();

    const onSuccess = () => {
        notify('更新成功', { type: 'success' });
        redirect('/product-categories');
        refresh();
    };

    return (
        <>
            <Helmet>
                <title>星夜後台</title>
                <link rel="icon" href="/icon_198x278.png" type="image/png" />
            </Helmet>
            <Edit {...props} mutationOptions={{ onSuccess }} title="編輯商品類別">
                <Card className={classes.card}>
                    <CardHeader className={classes.header} title="編輯商品類別" />
                    <CardContent>
                        <SimpleForm toolbar={<CustomToolbar />}>
                            <Grid container className={classes.formGrid}>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextInput
                                        source="category_name"
                                        label="名稱"
                                        validate={required()}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextInput
                                        source="description"
                                        label="描述"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <SelectInput
                                        source="status"
                                        label="狀態"
                                        choices={[
                                            { id: 1, name: '啟用' },
                                            { id: 0, name: '停用' },
                                        ]}
                                        validate={required()}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </SimpleForm>
                    </CardContent>
                </Card>
            </Edit>
        </>
    );
};

// 商品類別顯示詳情頁面
export const ProductCategoryShow = (props) => {
    const classes = useStyles();
    return (
        <Show {...props} title="商品類別詳情">
            <SimpleShowLayout>
                <Card className={classes.card}>
                    <CardHeader className={classes.header} title="商品類別詳情" />
                    <CardContent>
                        <Grid container>
                            <Grid item xs={12} className={classes.formItem}>
                                <TextField source="id" label="編號" />
                            </Grid>
                            <Grid item xs={12} className={classes.formItem}>
                                <TextField source="category_name" label="名稱" />
                            </Grid>
                            <Grid item xs={12} className={classes.formItem}>
                                <TextField source="description" label="描述" />
                            </Grid>
                            <Grid item xs={12} className={classes.formItem}>
                                <TextField source="status" label="狀態" />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </SimpleShowLayout>
        </Show>
    );
}
