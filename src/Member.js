// src/Member.js

import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    EmailField,
    EditButton,
    DeleteButton,
    Create,
    SimpleForm,
    TextInput,
    Edit,
    Filter,
    Show,
    SimpleShowLayout,
    BooleanInput,
    BooleanField,
    DateField,
} from 'react-admin';
import { Grid, Card, CardContent, CardHeader, Box, Typography } from '@mui/material';
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


// 會員列表篩選器
const MemberFilter = (props) => (
    <Filter {...props}>
        <TextInput label="搜尋" source="q" alwaysOn />
        <TextInput label="姓名" source="name" />
        <TextInput label="電子郵件" source="email" type="email" />
    </Filter>
);

// 會員列表
export const MemberList = (props) => {
    const classes = useStyles();
    return (
        <List {...props} filters={<MemberFilter />} perPage={25} title="會員列表">
            <Datagrid rowClick="show">
                <TextField source="id" label="ID" />
                <TextField source="username" label="帳號" />
                <TextField source="name" label="姓名" />
                <EmailField source="email" label="電子郵件" />
                <TextField source="phone" label="電話" />
                <TextField source="address" label="地址" />
                <BooleanField source="is_admin" label="是否管理員" />
                <TextField source="status" label="狀態" />
                <DateField source="created_at" label="創建時間" />
                <DateField source="updated_at" label="更新時間" />
                <EditButton />
                <DeleteButton />
            </Datagrid>
        </List>
    );
};

// 會員創建
export const MemberCreate = (props) => {
    const classes = useStyles();
    return (
        <Create {...props} title="新增會員">
            <Card className={classes.formCard}>
                <CardHeader className={classes.header} title="新增會員" />
                <CardContent>
                    <SimpleForm>
                        <Grid container>
                            <Grid item xs={12} className={classes.gridItem}>
                                <TextInput source="username" label="帳號" required fullWidth />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <TextInput source="password" label="密碼" type="password" required fullWidth />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <TextInput source="name" label="姓名" required fullWidth />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <TextInput source="email" label="電子郵件" type="email" required fullWidth />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <TextInput source="phone" label="電話" fullWidth />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <TextInput source="address" label="地址" fullWidth />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <BooleanInput source="is_admin" label="是否管理員" />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <TextInput source="status" label="狀態" defaultValue="active" fullWidth />
                            </Grid>
                        </Grid>
                    </SimpleForm>
                </CardContent>
            </Card>
        </Create>
    );
};

// 會員編輯
export const MemberEdit = (props) => {
    const classes = useStyles();
    return (
        <Edit {...props} title="編輯會員">
            <Card className={classes.formCard}>
                <CardHeader className={classes.header} title="編輯會員" />
                <CardContent>
                    <SimpleForm>
                        <Grid container>
                            <Grid item xs={12} className={classes.gridItem}>
                                <TextField source="id" label="ID" />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <TextInput source="username" label="帳號" disabled fullWidth />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <TextInput source="password" label="密碼" type="password" helperText="留空則不更改" fullWidth />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <TextInput source="name" label="姓名" required fullWidth />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <TextInput source="email" label="電子郵件" type="email" required fullWidth />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <TextInput source="phone" label="電話" fullWidth />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <TextInput source="address" label="地址" fullWidth />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <BooleanInput source="is_admin" label="是否管理員" />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <TextInput source="status" label="狀態" fullWidth />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <DateField source="created_at" label="創建時間" />
                            </Grid>
                            <Grid item xs={12} className={classes.gridItem}>
                                <DateField source="updated_at" label="更新時間" />
                            </Grid>
                        </Grid>
                    </SimpleForm>
                </CardContent>
            </Card>
        </Edit>
    );
};

// 會員顯示詳情
export const MemberShow = (props) => {
    const classes = useStyles();
    return (
        <Show {...props} title="會員詳情">
            <SimpleShowLayout>
                <Grid container>
                    <Grid item xs={12} className={classes.gridItem}>
                        <TextField source="id" label="ID" />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <TextField source="username" label="帳號" />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <TextField source="name" label="姓名" />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <EmailField source="email" label="電子郵件" />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <TextField source="phone" label="電話" />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <TextField source="address" label="地址" />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <BooleanField source="is_admin" label="是否管理員" />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <TextField source="status" label="狀態" />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <DateField source="created_at" label="創建時間" />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <DateField source="updated_at" label="更新時間" />
                    </Grid>
                </Grid>
            </SimpleShowLayout>
        </Show>
    );
}
