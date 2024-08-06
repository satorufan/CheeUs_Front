import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, Edit, SimpleForm, TextInput, Create } from 'react-admin';
import axios from 'axios';
import { stringify } from 'query-string';

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