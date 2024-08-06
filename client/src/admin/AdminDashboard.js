import React from 'react';
import { Admin, CustomRoutes, Resource, EditGuesser } from 'react-admin';
import UserIcon from '@material-ui/icons/Group';
import PostIcon from '@material-ui/icons/Book';
import ReportIcon from '@material-ui/icons/Report';
import { AdminMenuLayout } from './AdminMenuLayout';
import { Route } from 'react-router-dom';
import dataProvider from './dataProvider';
import AdminLogin from './AdminLogin';
import AdminHome from './AdminHome';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext';
import { UserCreate, UserEdit, UserList } from './UserList';
import { PostCreate, PostEdit, PostList } from './PostList';
import { ReportCreate, ReportEdit, ReportList } from './ReportList';

const AdminDashboard = () => (
    <AuthProvider>
        <Admin basename="/admin" dataProvider={dataProvider} layout={AdminMenuLayout}>
            <CustomRoutes>
                <Route path="/adminlogin" element={<AdminLogin />} />
                <Route path="/" element={<AdminHome />} />
                <Route path="/*" element={<PrivateRoute />}>
					<Route path="users" element={<UserList resource="users" />} />
					<Route path="users/create" element={<UserCreate resource="users" />} />
					<Route path="users/edit/:id" element={<UserEdit resource="users" />} />
					<Route path="posts" element={<PostList resource="posts" />} />
					<Route path="posts/create" element={<PostCreate resource="posts" />} />
					<Route path="posts/edit/:id" element={<PostEdit resource="posts" />} />
					<Route path="report" element={<ReportList resource="report" />} />
                </Route>
            </CustomRoutes>
            <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} icon={UserIcon} />
            <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon} />
            <Resource name="report" list={ReportList} edit={ReportEdit} create={ReportCreate} icon={ReportIcon} />
        </Admin>
    </AuthProvider>
);

export default AdminDashboard;