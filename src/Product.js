import React, { useState, useEffect, useCallback } from 'react';
import {
    List,
    Datagrid,
    TextField,
    NumberField,
    EditButton,
    DeleteButton,
    Create,
    SimpleForm,
    TextInput,
    NumberInput,
    Edit,
    SelectInput,
    required,
    Toolbar,
    SaveButton,
    useNotify,
    useRedirect,
    useRefresh,
    ReferenceInput,
    useRecordContext,
    useInput,
    SimpleList
} from 'react-admin';
import {
    Card,
    CardContent,
    CardHeader,
    Box,
    Typography,
    Avatar
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Custom styles
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
    dropzone: {
        border: '2px dashed #ccc',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: '#fff',
    },
    dropzoneActive: {
        backgroundColor: '#fafafa',
    },
    previewImage: {
        marginTop: '20px',
    },
    hiddenInput: {
        display: 'none',
    },
});

// Custom Toolbar
const CustomToolbar = props => (
    <Toolbar {...props}>
        <SaveButton />
    </Toolbar>
);

// Custom ImageBase64Input component
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
                    onChange(reader.result); // Update the image_base64 field
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

// Custom Image Field for base64 images
const MyImageField = ({ source, record = {} }) => (
    <img
        src={record[source]}
        alt=""
        style={{
            maxWidth: 100,
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
            margin: '0 auto',
        }}
    />
);

// Product List Page
export const ProductList = (props) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            <Helmet>
                <title>星夜後台</title>
                <link rel="icon" href="/icon_198x278.png" type="image/png" />
            </Helmet>
            <List {...props} title="商品清單">
                {isSmall ? (
                    <SimpleList
                        primaryText={record => record.product_name}
                        secondaryText={record => `$${record.price}`}
                        tertiaryText={record => record.status}
                        leftAvatar={record => <Avatar src={record.image_base64} />}
                        linkType="edit"
                    />
                ) : (
                    <Datagrid rowClick="edit">
                        <TextField source="id" label="編號" />
                        <MyImageField source="image_base64" label="商品圖片" />
                        <TextField source="product_name" label="商品名稱" />
                        <NumberField source="price" label="價格" />
                        <NumberField source="stock_quantity" label="庫存數量" />
                        <TextField source="status" label="狀態" />
                        <EditButton />
                        <DeleteButton />
                    </Datagrid>
                )}
            </List>
        </>
    );
};

// Product Create Page
export const ProductCreate = (props) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const classes = useStyles();

    const onSuccess = () => {
        notify('新增成功', { type: 'success' });
        redirect('/products');
        refresh();
    };

    return (
        <>
            <Helmet>
                <title>星夜後台</title>
                <link rel="icon" href="/icon_198x278.png" type="image/png" />
            </Helmet>
            <Create {...props} mutationOptions={{ onSuccess }} title="新增商品">
                <SimpleForm toolbar={<CustomToolbar />} redirect="list">
                    <Card className={classes.card}>
                        <CardHeader className={classes.header} title="新增商品" />
                        <CardContent>
                            <ReferenceInput
                                source="category_id"
                                reference="product-categories"
                                label="商品類別"
                                validate={required()}
                            >
                                <SelectInput optionText="category_name" />
                            </ReferenceInput>
                            <TextInput source="product_name" label="商品名稱" validate={required()} />
                            <NumberInput source="price" label="價格" validate={required()} />
                            <NumberInput source="stock_quantity" label="庫存數量" validate={required()} />

                            {/* Use the custom image input component */}
                            <ImageBase64Input source="image_base64" validate={required()} />

                            <SelectInput
                                source="status"
                                label="狀態"
                                choices={[
                                    { id: 'available', name: '可用' },
                                    { id: 'out_of_stock', name: '缺貨' },
                                    { id: 'discontinued', name: '已停產' },
                                ]}
                                validate={required()}
                            />
                        </CardContent>
                    </Card>
                </SimpleForm>
            </Create>
        </>
    );
};

// Product Edit Page
export const ProductEdit = (props) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const classes = useStyles();

    const onSuccess = () => {
        notify('更新成功', { type: 'success' });
        redirect('/products');
        refresh();
    };

    return (
        <>
            <Helmet>
                <title>星夜後台</title>
                <link rel="icon" href="/icon_198x278.png" type="image/png" />
            </Helmet>
            <Edit {...props} mutationOptions={{ onSuccess }} title="編輯商品">
                <SimpleForm toolbar={<CustomToolbar />}>
                    <Card className={classes.card}>
                        <CardHeader className={classes.header} title="編輯商品" />
                        <CardContent>
                            <ReferenceInput
                                source="category_id"
                                reference="product-categories"
                                label="商品類別"
                                validate={required()}
                            >
                                <SelectInput optionText="category_name" />
                            </ReferenceInput>
                            <TextInput source="product_name" label="商品名稱" validate={required()} />
                            <NumberInput source="price" label="價格" validate={required()} />
                            <NumberInput source="stock_quantity" label="庫存數量" validate={required()} />

                            {/* Use the custom image input component */}
                            <ImageBase64Input source="image_base64" validate={required()} />

                            <SelectInput
                                source="status"
                                label="狀態"
                                choices={[
                                    { id: 'available', name: '可用' },
                                    { id: 'out_of_stock', name: '缺貨' },
                                    { id: 'discontinued', name: '已停產' },
                                ]}
                                validate={required()}
                            />
                        </CardContent>
                    </Card>
                </SimpleForm>
            </Edit>
        </>
    );
};
