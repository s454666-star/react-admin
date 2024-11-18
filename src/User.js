// src/User.js

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
    BulkDeleteButton,
    Edit,
    SimpleForm,
    SelectInput,
    required,
    Toolbar,
    SaveButton,
    useNotify,
    useRedirect,
    useRefresh,
    Create,
    Show,
    SimpleShowLayout,
} from 'react-admin';
import { makeStyles } from '@mui/styles';
import { Card, CardContent, CardHeader, Box, Typography, Grid } from '@mui/material';
import { useRecordContext, useInput } from 'react-admin';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet';

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
    dropzone: {
        border: '2px dashed #1976d2',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: '#f0f8ff',
        borderRadius: '8px',
        transition: 'background-color 0.3s',
    },
    dropzoneActive: {
        backgroundColor: '#e0f7fa',
    },
    previewImage: {
        marginTop: '20px',
        textAlign: 'center',
    },
    formGrid: {
        width: '100%',
    },
    formItem: {
        marginBottom: '20px',
    },
    rowEven: {
        backgroundColor: '#f5f5f5',
        '&:hover': {
            backgroundColor: '#e0e0e0',
        },
    },
    rowOdd: {
        backgroundColor: '#ffffff',
        '&:hover': {
            backgroundColor: '#e0e0e0',
        },
    },
});

// 自定義 Toolbar
const CustomToolbar = props => (
    <Toolbar {...props}>
        <SaveButton />
    </Toolbar>
);

// 自定義的 ImageBase64Input 組件
const ImageBase64Input = (props) => {
    const classes = useStyles();
    const {
        field: { value, onChange },
        fieldState: { isTouched, error },
    } = useInput(props);

    const onDrop = useCallback(
        (acceptedFiles, fileRejections) => {
            if (fileRejections.length > 0) {
                const rejection = fileRejections[0];
                if (rejection.errors.some(e => e.code === 'file-too-large')) {
                    alert('圖片大小不能超過 2MB');
                } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
                    alert('僅支持 JPEG 和 PNG 格式的圖片');
                }
                return;
            }

            const file = acceptedFiles[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    onChange(reader.result); // 更新表單的 image_base64 欄位
                };
                reader.readAsDataURL(file);
            }
        },
        [onChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
        },
        multiple: false,
        maxSize: 2 * 1024 * 1024, // 2MB
    });

    return (
        <Box>
            <Box
                {...getRootProps()}
                className={`${classes.dropzone} ${
                    isDragActive ? classes.dropzoneActive : ''
                }`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <Typography>釋放圖片以上傳</Typography>
                ) : (
                    <Typography>拖放圖片到此處，或點擊以選擇圖片</Typography>
                )}
            </Box>
            {value && (
                <Box className={classes.previewImage}>
                    <img src={value} alt="預覽圖片" width="200" />
                </Box>
            )}
            {isTouched && error && (
                <Typography color="error" variant="caption">
                    {error.message || error}
                </Typography>
            )}
        </Box>
    );
};

// 自定義圖片顯示組件
const MyImageField = ({ source }) => {
    const record = useRecordContext();
    if (!record || !record[source]) return null;
    return (
        <img
            src={record[source]}
            alt="使用者圖片"
            style={{
                maxWidth: 100,
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
                borderRadius: '8px',
            }}
        />
    );
};

// 使用者篩選器
const UserFilter = (props) => (
    <Filter {...props}>
        <TextInput label="搜尋名稱" source="q" alwaysOn />
    </Filter>
);

// 使用者清單頁面
export const UserList = (props) => {
    const classes = useStyles();

    return (
        <>
            <Helmet>
                <title>星夜後台 - 使用者清單</title>
                <link rel="icon" href="/icon_198x278.png" type="image/png" />
            </Helmet>
            <List
                {...props}
                filters={<UserFilter />}
                bulkActionButtons={<BulkDeleteButton label="批次刪除" />}
                title="使用者清單"
            >
                <Datagrid
                    rowClick="edit"
                    rowStyle={(record, index) => ({
                        backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff',
                        '&:hover': {
                            backgroundColor: '#e0e0e0',
                        },
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
        </>
    );
};

// 使用者編輯頁面
export const UserEdit = (props) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const classes = useStyles();

    // 在保存成功後顯示通知並跳轉回列表頁
    const onSuccess = () => {
        notify('修改成功', { type: 'info' });
        redirect('/users'); // 確保跳轉到列表頁
        refresh();
    };

    return (
        <>
            <Helmet>
                <title>星夜後台 - 編輯使用者</title>
                <link rel="icon" href="/icon_198x278.png" type="image/png" />
            </Helmet>
            <Edit {...props} mutationOptions={{ onSuccess }} title="編輯使用者">
                <Card className={classes.card}>
                    <CardHeader className={classes.header} title="編輯使用者" />
                    <CardContent>
                        <SimpleForm toolbar={<CustomToolbar />}>
                            <Grid container className={classes.formGrid}>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextInput
                                        source="username"
                                        label="帳號"
                                        validate={required()}
                                        disabled
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextInput
                                        source="password"
                                        label="密碼"
                                        type="password"
                                        helperText="留空則不更改"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextInput
                                        source="name"
                                        label="姓名"
                                        validate={required()}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextInput
                                        source="email"
                                        label="電子郵件"
                                        validate={[required(), (value) => (/.+@.+\..+/.test(value) ? undefined : '請輸入有效的電子郵件')]}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextInput
                                        source="phone"
                                        label="電話"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextInput
                                        source="address"
                                        label="地址"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <SelectInput
                                        source="status"
                                        label="狀態"
                                        choices={[
                                            { id: 'active', name: '啟用' },
                                            { id: 'inactive', name: '停用' },
                                            { id: 'banned', name: '封鎖' },
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

// 使用者新增頁面
export const UserCreate = (props) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const classes = useStyles();

    // 在保存成功後顯示通知並跳轉回列表頁
    const onSuccess = () => {
        notify('新增成功', { type: 'info' });
        redirect('/users'); // 確保正確跳轉到列表頁
        refresh();
    };

    return (
        <>
            <Helmet>
                <title>星夜後台 - 新增使用者</title>
                <link rel="icon" href="/icon_198x278.png" type="image/png" />
            </Helmet>
            <Create {...props} mutationOptions={{ onSuccess }} title="新增使用者">
                <Card className={classes.card}>
                    <CardHeader className={classes.header} title="新增使用者" />
                    <CardContent>
                        <SimpleForm toolbar={<CustomToolbar />} redirect="list">
                            <Grid container className={classes.formGrid}>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextInput
                                        source="username"
                                        label="帳號"
                                        validate={required()}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextInput
                                        source="password"
                                        label="密碼"
                                        type="password"
                                        validate={required()}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextInput
                                        source="name"
                                        label="姓名"
                                        validate={required()}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextInput
                                        source="email"
                                        label="電子郵件"
                                        validate={[required(), (value) => (/.+@.+\..+/.test(value) ? undefined : '請輸入有效的電子郵件')]}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextInput
                                        source="phone"
                                        label="電話"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextInput
                                        source="address"
                                        label="地址"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <SelectInput
                                        source="status"
                                        label="狀態"
                                        choices={[
                                            { id: 'active', name: '啟用' },
                                            { id: 'inactive', name: '停用' },
                                            { id: 'banned', name: '封鎖' },
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

// 使用者顯示詳情頁面
export const UserShow = (props) => {
    const classes = useStyles();

    return (
        <>
            <Helmet>
                <title>星夜後台 - 查看使用者</title>
                <link rel="icon" href="/icon_198x278.png" type="image/png" />
            </Helmet>
            <Show title="查看使用者" {...props}>
                <SimpleShowLayout>
                    <Card className={classes.card}>
                        <CardHeader className={classes.header} title="使用者詳情" />
                        <CardContent>
                            <Grid container className={classes.formGrid}>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextField source="id" label="ID" />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextField source="username" label="帳號" />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextField source="name" label="姓名" />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <EmailField source="email" label="電子郵件" />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextField source="phone" label="電話" />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextField source="address" label="地址" />
                                </Grid>
                                <Grid item xs={12} className={classes.formItem}>
                                    <TextField source="status" label="狀態" />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </SimpleShowLayout>
            </Show>
        </>
    );
};
