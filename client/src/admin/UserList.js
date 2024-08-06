import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, Edit, SimpleForm, TextInput, Create } from 'react-admin';
import { stringify } from 'query-string';

export const UserList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="email" type="email"/>
            <TextField source="name" />
            <TextField source="nickname" />
            <TextField source="tel" />
            <TextField source="birth" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const UserEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="email" type="email"/>
            <TextInput source="name" />
            <TextInput source="nickname" />
            <TextInput source="tel" />
            <TextInput source="birth" />
        </SimpleForm>
    </Edit>
);

export const UserCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="email" type="email"/>
            <TextInput source="name" />
            <TextInput source="nickname" />
            <TextInput source="tel" />
            <TextInput source="birth" />s
        </SimpleForm>
    </Create>
);
