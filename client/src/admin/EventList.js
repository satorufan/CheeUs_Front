import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, SearchInput } from 'react-admin';
import { Edit, SimpleForm, TextInput, BooleanInput } from 'react-admin';
import { Create } from 'react-admin';
import BooleanField from './BooleanField'; 
import ToggleButton from './ToggleButton'; 
import { FilterSidebar, ListActions } from './FilterSidebar';

const eventFilters = [
    <SearchInput source="q" />,
    <TextInput label="id" source="id" defaultValue="" />,
    <TextInput label="adminId" source="admin_id" defaultValue="" />,
    <TextInput label="adminName" source="admin_name" defaultValue="" />,
    <TextInput label="title" source="title" defaultValue="" />,
    <TextInput label="title2" source="title2" defaultValue="" />,
    <TextInput label="content" source="content" defaultValue="" />,
    <TextInput label="category" source="category" defaultValue="" />,
];


export const EventList = (props) => (
    <List {...props} debounce={1000} actions={<ListActions/>}  filters={eventFilters} aside={<FilterSidebar/>}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="admin_id" />
            <TextField source="admin_name" />
            <TextField source="title" />
            <TextField source="title2" />
            <TextField source="content" />
            <TextField source="writeday" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const EventCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="admin_id" />
            <TextInput source="admin_name" />
            <TextInput source="title" />
            <TextInput source="title2" />
            <TextInput source="content" />
            <TextInput source="writeday" />
        </SimpleForm>
    </Create>
);

export const EventEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="admin_id" />
            <TextInput source="admin_name" />
            <TextInput source="title" />
            <TextInput source="title2" />
            <TextInput source="content" />
            <TextInput source="writeday" />
        </SimpleForm>
    </Edit>
);