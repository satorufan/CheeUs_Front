import React from 'react';
import { List, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, SearchInput, BooleanField, ShowButton, BooleanInput} from 'react-admin';
import { FilterSidebar, ListActions } from './FilterSidebar';

const userFilters = [
    <SearchInput source="q" alwaysOn />,
    <TextInput label="Email" source="email" defaultValue="" />,
    <TextInput label="Name" source="namel" defaultValue="" />,
    <TextInput label="NickName" source="nickname" defaultValue="" />,
    <TextInput label="Tel" source="tel" defaultValue="" />,
    <TextInput label="Birth" source="birth" defaultValue="" />,
    <BooleanInput label ="Banned" source="banned" defaultValue={true}/>,    
];

export const UserList = (props) => (
    <List {...props} debounce={1000} actions={<ListActions/>} filters={userFilters} aside={<FilterSidebar/>}> 
        <Datagrid rowClick="edit">
            <TextField source="email" />
            <TextField source="name" />
            <TextField source="nickname" />
            <TextField source="tel" />
            <TextField source="birth" />
            <BooleanField source='banned'/>
            <ShowButton/>
            <EditButton />
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
            <BooleanInput source='banned' label="Banned"/>
        </SimpleForm>
    </Edit>
);
