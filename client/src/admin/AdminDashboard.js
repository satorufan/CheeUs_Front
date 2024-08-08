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
import { UserEdit, UserList } from './UserList';
import { PostEdit, PostList } from './PostList';
import { ReportEdit, ReportList } from './ReportList';
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
					<Route path="users/edit/:id" element={<UserEdit resource="users" />} />
					<Route path="posts" element={<PostList resource="posts" />} />
					<Route path="posts/edit/:id" element={<PostEdit resource="posts" />} />
					<Route path="reports" element={<ReportList resource="reports" />} />
					<Route path="reports/edit/:id" element={<ReportEdit resource="reports" />} />
					<Route path="events" element={<EventList resource="events" />} />
					<Route path="events/create" element={<EventCreate resource="events" />} />
					<Route path="events/edit/:id" element={<EventEdit resource="events" />} />
					<Route path="magazines" element={<MagazineList resource="magazines" />} />
					<Route path="magazines/create" element={<MagazineCreate resource="magazines" />} />
					<Route path="magazines/edit/:id" element={<MagazineEdit resource="magazines" />} />
                </Route>
            </CustomRoutes>
            <Resource name="users" list={UserList} edit={UserEdit} icon={UserIcon} />
            <Resource name="posts" list={PostList} edit={PostEdit} icon={PostIcon} />
            <Resource name="reports" list={ReportList} edit={ReportEdit} icon={ReportIcon} />
            <Resource name="events" list={EventList} edit={EventEdit} create={EventCreate} icon={EventIcon} />
            <Resource name="magazines" list={MagazineList} edit={MagazineEdit} create={MagazineCreate} icon={ImportContactsIcon} />
        </Admin>
    </AuthProvider>
);

export default AdminDashboard;