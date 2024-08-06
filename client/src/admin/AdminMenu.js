import { Menu } from 'react-admin';
import HomeIcon from '@mui/icons-material/Home';
import React from 'react';
import { Link } from 'react-router-dom';

export const AdminMenu = () => (
    <Menu>
        <Menu.Item
            to="/admin/"
            primaryText="Home"
            leftIcon={<HomeIcon />}
            component={Link}
        />
        <Menu.ResourceItem name="users" />
        <Menu.ResourceItem name="posts" />
        <Menu.ResourceItem name="reports" />
        <Menu.ResourceItem name="events" />
        <Menu.ResourceItem name="magazines" />
    </Menu>
);
