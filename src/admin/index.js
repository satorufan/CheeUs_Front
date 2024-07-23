import React from 'react';
import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { UserList, UserEdit, UserCreate } from './UserList';
import { PostList } from './PostList';
import { PostEdit } from './PostEdit';
import { PostCreate } from './PostCreate';
import UserIcon from '@material-ui/icons/Group';
import PostIcon from '@material-ui/icons/Book';

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

const AdminDashboard = () => (
    <Admin basename="/admin" dataProvider={dataProvider}>
        <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} icon={UserIcon} />
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon} />
    </Admin>
);

export default AdminDashboard;
