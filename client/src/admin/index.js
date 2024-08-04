import React from 'react';
import { Admin, Resource } from 'react-admin';
import { UserList, UserEdit, UserCreate } from './UserList';
import { PostList } from './PostList';
import { PostEdit } from './PostEdit';
import { PostCreate } from './PostCreate';
import UserIcon from '@material-ui/icons/Group';
import PostIcon from '@material-ui/icons/Book';
import ReportIcon from '@material-ui/icons/Report';
import InputIcon from '@material-ui/icons/Input';
import axios from 'axios';
import { stringify } from 'query-string';

const apiUrl = 'http://localhost:8080/admin';

const dataProvider = {
    getList: async (resource, params) => {
        const { data } = await axios.get(apiUrl);
        return {
            data: data.map(item => ({ ...item, id: item.email })),
            total: data.length,
        };
    },
    getOne: async (resource, params) => {
        const { data } = await axios.get(`${apiUrl}/${params.id}`);
        return { data: { ...data, id: data.email } };
    },
    getMany: async (resource, params) => {
        const { data } = await axios.get(`${apiUrl}?${stringify(params)}`);
        return { data: data.map(item => ({ ...item, id: item.email })) };
    },
    getManyReference: async (resource, params) => {
        const { data } = await axios.get(`${apiUrl}?${stringify(params)}`);
        return { data: data.map(item => ({ ...item, id: item.email })) };
    },
    update: async (resource, params) => {
        await axios.put(`${apiUrl}/${params.id}`, params.data);
        return { data: { ...params.data, id: params.data.email } };
    },
    updateMany: async (resource, params) => {
        await Promise.all(params.ids.map(id => axios.put(`${apiUrl}/${id}`, params.data)));
        return { data: params.ids };
    },
    create: async (resource, params) => {
        const { data } = await axios.post(apiUrl, params.data);
        return { data: { ...params.data, id: data.email } };
    },
    delete: async (resource, params) => {
        await axios.delete(`${apiUrl}/${params.id}`);
        return { data: params.previousData };
    },
    deleteMany: async (resource, params) => {
        await Promise.all(params.ids.map(id => axios.delete(`${apiUrl}/${id}`)));
        return { data: params.ids };
    }
};

const AdminDashboard = () => (
    <Admin basename="/admin" dataProvider={dataProvider}>
        <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} icon={UserIcon} />
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon} />
        <Resource name="report" list={UserList} edit={UserEdit} create={UserCreate} icon={ReportIcon} />
    </Admin>
);

export default AdminDashboard;

/*
import React from 'react';
import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { UserList, UserEdit, UserCreate } from './UserList';
import { PostList } from './PostList';
import { PostEdit } from './PostEdit';
import { PostCreate } from './PostCreate';
import UserIcon from '@material-ui/icons/Group';
import PostIcon from '@material-ui/icons/Book';
import ReportIcon from '@material-ui/icons/Report';

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

const AdminDashboard = () => (
    <Admin basename="/admin" dataProvider={dataProvider}>
        <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} icon={UserIcon} />
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon} />
        <Resource name="report" list={UserList} edit={UserEdit} create={UserCreate} icon={ReportIcon} />
    </Admin>
);

export default AdminDashboard;
*/