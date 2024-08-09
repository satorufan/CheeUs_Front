import { AppBar, Layout, ThemeProvider, UserMenu, useLogout } from 'react-admin';
import { AdminMenu } from './AdminMenu';
import { forwardRef } from 'react';
import { MenuItem, createTheme } from '@mui/material';
import ExitIcon from '@mui/icons-material/PowerSettingsNew';

const AdminLogoutButton = forwardRef((props, ref) => {
    const logout = useLogout();
    const handleClick = () => logout();
    return (
        <MenuItem
            onClick={handleClick}
            ref={ref}
            // It's important to pass the props to allow Material UI to manage the keyboard navigation
            {...props}
        >
            <ExitIcon /> Logout
        </MenuItem>
    );
});


const AdminUserMenu = () => (
    <UserMenu>
        <AdminLogoutButton />
    </UserMenu>
);

const MyAppBar = () => <AppBar userMenu={<AdminUserMenu />} />;

export const AdminMenuLayout = ({ children }) => {
    const lightTheme = createTheme({
        palette: {
            mode: 'light',
        },
    });

    return (
        <ThemeProvider theme={lightTheme}>
            <Layout menu={AdminMenu} appBar={MyAppBar}>
                {children}
            </Layout>
        </ThemeProvider>
    );
};