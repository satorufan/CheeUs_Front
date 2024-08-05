import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, Edit, SimpleForm, TextInput, Create } from 'react-admin';
import axios from 'axios';
import { stringify } from 'query-string';

const apiUrl = 'http://localhost:8080/admin/AdminReport';

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

export const ReportList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="email" />
            <TextField source="name" />
            <TextField source="nickname" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const ReportEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="email" disabled />
            <TextInput source="name" />
            <TextInput source="nickname" />
        </SimpleForm>
    </Edit>
);

export const ReportCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="email" />
            <TextInput source="name" />
            <TextInput source="nickname" />
        </SimpleForm>
    </Create>
);

/*
import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, Edit, SimpleForm, TextInput, Create } from 'react-admin';

export const UserList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="email" />
            <TextField source="nickname" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const UserEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="name" />
            <TextInput source="email" />
            <TextInput source="nickname" />
        </SimpleForm>
    </Edit>
);

export const UserCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="email" />
            <TextInput source="nickname" />
        </SimpleForm>
    </Create>
);
 */