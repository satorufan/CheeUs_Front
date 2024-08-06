import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, Edit, SimpleForm, TextInput, Create, FilterButton,SearchInput, CreateButton} from 'react-admin';
import { stringify } from 'query-string';
import { FilterSidebar, ListActions } from './FilterSidebar';

const userFilters = [
    <SearchInput source="q" alwaysOn />,
    <TextInput label="Email" source="email" defaultValue="" />,
    <TextInput label="Name" source="namel" defaultValue="" />,
    <TextInput label="NickName" source="nickname" defaultValue="" />,
    <TextInput label="Tel" source="tel" defaultValue="" />,
    <TextInput label="Birth" source="birth" defaultValue="" />,
];

export const UserList = (props) => (
    <List {...props} debounce={1000} actions={<ListActions/>} filters={userFilters} aside={<FilterSidebar/>}> 
        <Datagrid rowClick="edit">
            <TextField source="email" />
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
            <TextInput source="email" disabled />
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
            <TextInput source="email" />
            <TextInput source="name" />
            <TextInput source="nickname" />
        </SimpleForm>
    </Create>
);
