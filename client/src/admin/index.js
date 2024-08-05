import React from 'react';
import { Admin, Resource } from 'react-admin';
import UserIcon from '@material-ui/icons/Group';
import PostIcon from '@material-ui/icons/Book';
import ReportIcon from '@material-ui/icons/Report';
import InputIcon from '@material-ui/icons/Input';
import { UserList, UserEdit, UserCreate } from './UserList';
import { PostList, PostEdit, PostCreate } from './PostList';
import { ReportList, ReportEdit, ReportCreate } from './ReportList';
import dataProvider from './dataProvider';

const AdminDashboard = () => (
    <Admin basename="/admin" dataProvider={dataProvider}>
        <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} icon={UserIcon} />
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon} />
        <Resource name="reports" list={ReportList} edit={ReportEdit} create={ReportCreate} icon={ReportIcon} />
    </Admin>
);

export default AdminDashboard;