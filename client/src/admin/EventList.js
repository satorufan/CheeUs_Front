import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, SearchInput } from 'react-admin';
import { Edit, SimpleForm, TextInput, BooleanInput } from 'react-admin';
import { Create } from 'react-admin';
import BooleanField from './BooleanField'; 
import ToggleButton from './ToggleButton'; 
import { FilterSidebar, ListActions } from './FilterSidebar';

const eventFilters = [
    <SearchInput source="q" />,
    <TextInput label="Email" source="email" defaultValue="" />,
    <TextInput label="Category" source="category" defaultValue="" />,
    <TextInput label="NickName" source="nickname" defaultValue="" />,
];



export const EventList = (props) => (
    <List {...props} debounce={1000} actions={<ListActions/>}  filters={eventFilters} aside={<FilterSidebar/>}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="admin_id" />
            <TextField source="title" />
            <TextField source="admin_name" />
            <TextField source="content" />
            <TextField source="title2" />
            <TextField source="writeday" />
            <TextField source="catagory" />
            <BooleanField source="pinned" />
            <BooleanField source="hidden" />
            <ToggleButton field="pinned" />
            <ToggleButton field="hidden" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const EventEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="title" />
            <TextInput source="content" />
            <TextInput source="title2" />
            <TextInput source="category" />
            <BooleanInput source="pinned" label="Pinned" />
            <BooleanInput source="hidden" label="Hidden" />
        </SimpleForm>
    </Edit>
);

export const EventCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="content" />
            <TextInput source="title2" />
            <TextInput source="category" />
            <BooleanInput source="pinned" label="Pinned" />
            <BooleanInput source="hidden" label="Hidden" />
        </SimpleForm>
    </Create>
);