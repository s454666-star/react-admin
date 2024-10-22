import React, { useState } from 'react';
import {
    List,
    Datagrid,
    TextField,
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
} from 'react-admin';
import { Card, CardContent, CardHeader } from '@mui/material';
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

// 自定義 Toolbar
const CustomToolbar = props => (
    <Toolbar {...props}>
        <SaveButton />
    </Toolbar>
);

// 商品清單頁面
export const ProductList = (props) => {
    const classes = useStyles();
    return (
        <List {...props} title="商品清單">
            <Card className={classes.card}>
                <CardHeader className={classes.header} title="商品清單" />
                <CardContent>
                    <Datagrid rowClick="edit">
                        <TextField source="id" label="編號" />
                        <TextField source="product_name" label="商品名稱" />
                        <TextField source="price" label="價格" />
                        <TextField source="stock_quantity" label="庫存數量" />
                        <TextField source="status" label="狀態" />
                        <EditButton />
                        <DeleteButton />
                    </Datagrid>
                </CardContent>
            </Card>
        </List>
    );
};

// 商品新增頁面
export const ProductCreate = (props) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const [imageBase64, setImageBase64] = useState(''); // 用來保存圖片的 Base64 字符串
    const classes = useStyles();

    const onSuccess = () => {
        notify('新增成功', { type: 'success' });
        redirect('/products');
        refresh();
    };

    const handleImageChange = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageBase64(reader.result); // 將 Base64 字符串保存到狀態
        };
        reader.readAsDataURL(file); // 將圖片轉換為 Base64
    };

    return (
        <Create {...props} mutationOptions={{ onSuccess }} title="新增商品">
            <Card className={classes.card}>
                <CardHeader className={classes.header} title="新增商品" />
                <CardContent>
                    <SimpleForm toolbar={<CustomToolbar />} redirect="list">
                        <ReferenceInput source="category_id" reference="product-categories" label="商品類別" validate={required()}>
                            <SelectInput optionText="category_name" />
                        </ReferenceInput>
                        <TextInput source="product_name" label="商品名稱" validate={required()} />
                        <NumberInput source="price" label="價格" validate={required()} />
                        <NumberInput source="stock_quantity" label="庫存數量" validate={required()} />

                        {/* 圖片上傳處理 */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e.target.files[0])}
                        />
                        {imageBase64 && <img src={imageBase64} alt="預覽圖片" width="100" />}

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

                        {/* 傳遞 Base64 字符串到後端 */}
                        <TextInput source="image_base64" value={imageBase64} style={{ display: 'none' }} />
                    </SimpleForm>
                </CardContent>
            </Card>
        </Create>
    );
};

// 商品編輯頁面
export const ProductEdit = (props) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const [imageBase64, setImageBase64] = useState(''); // 用來保存編輯圖片的 Base64 字符串
    const classes = useStyles();

    const onSuccess = () => {
        notify('更新成功', { type: 'success' });
        redirect('list', 'products');
        refresh();
    };

    const handleImageChange = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageBase64(reader.result); // 將 Base64 字符串保存到狀態
        };
        reader.readAsDataURL(file); // 將圖片轉換為 Base64
    };

    return (
        <Edit {...props} onSuccess={onSuccess} title="編輯商品">
            <Card className={classes.card}>
                <CardHeader className={classes.header} title="編輯商品" />
                <CardContent>
                    <SimpleForm toolbar={<CustomToolbar />}>
                        <ReferenceInput source="category_id" reference="product-categories" label="商品類別" validate={required()}>
                            <SelectInput optionText="category_name" />
                        </ReferenceInput>
                        <TextInput source="product_name" label="商品名稱" validate={required()} />
                        <NumberInput source="price" label="價格" validate={required()} />
                        <NumberInput source="stock_quantity" label="庫存數量" validate={required()} />

                        {/* 圖片上傳處理 */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e.target.files[0])}
                        />
                        {imageBase64 && <img src={imageBase64} alt="預覽圖片" width="100" />}

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

                        {/* 傳遞 Base64 字符串到後端 */}
                        <TextInput source="image_base64" value={imageBase64} style={{ display: 'none' }} />
                    </SimpleForm>
                </CardContent>
            </Card>
        </Edit>
    );
};
