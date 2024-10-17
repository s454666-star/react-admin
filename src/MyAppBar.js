import React from 'react';
import { AppBar, UserMenu, Logout } from 'react-admin';
import { Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRefresh } from 'react-admin';

const MyUserMenu = props => (
    <UserMenu {...props}>
        <Logout />
    </UserMenu>
);

const MyAppBar = props => {
    const refresh = useRefresh();

    const handleRefresh = () => {
        refresh();
    };

    return (
        <AppBar {...props} userMenu={<MyUserMenu />}>
            <Button color="inherit" onClick={handleRefresh} startIcon={<RefreshIcon />}>
                重整
            </Button>
        </AppBar>
    );
};

export default MyAppBar;
