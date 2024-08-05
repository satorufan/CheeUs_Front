import React from 'react';
import { Admin, CustomRoutes, Resource } from 'react-admin';
import UserIcon from '@material-ui/icons/Group';
import PostIcon from '@material-ui/icons/Book';
import ReportIcon from '@material-ui/icons/Report';
import EventIcon from '@material-ui/icons/Event';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
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
import { EventCreate, EventEdit, EventList } from './EventList';
import { MagazineCreate, MagazineEdit, MagazineList } from './MagazineList';

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
					<Route path="report/create" element={<ReportCreate resource="report" />} />
					<Route path="report/edit/:id" element={<ReportEdit resource="report" />} />
					<Route path="event" element={<EventList resource="event" />} />
					<Route path="event/create" element={<EventCreate resource="event" />} />
					<Route path="event/edit/:id" element={<EventEdit resource="event" />} />
					<Route path="magazine" element={<MagazineList resource="magazine" />} />
					<Route path="magazine/create" element={<MagazineCreate resource="magazine" />} />
					<Route path="magazine/edit/:id" element={<MagazineEdit resource="magazine" />} />
                </Route>
            </CustomRoutes>
            <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} icon={UserIcon} />
            <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon} />
            <Resource name="report" list={ReportList} edit={ReportEdit} create={ReportCreate} icon={ReportIcon} />
            <Resource name="event" list={EventList} edit={EventEdit} create={EventCreate} icon={EventIcon} />
            <Resource name="magazine" list={MagazineList} edit={MagazineEdit} create={MagazineCreate} icon={ImportContactsIcon} />
        </Admin>
    </AuthProvider>
);

export default AdminDashboard;