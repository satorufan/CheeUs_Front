import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, Edit, SimpleForm, TextInput, SearchInput, DateField, ShowButton } from 'react-admin';
import { FilterSidebar, ListActions } from './FilterSidebar';


const reportFilters = [
    <SearchInput source="q" />,
    <TextInput label="Reporter" source="reporter_id" defaultValue="" />,
    <TextInput label="Reported User" source="reported_id" defaultValue="" />,
    <TextInput label="Content" source="content" defaultValue="" />,
    <TextInput label="Writeday" source="writeday" defaultValue="" />,
];

export const ReportList = (props) => (
    <List {...props} debounce={1000} actions={<ListActions/>}  filters={reportFilters} aside={<FilterSidebar/>}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="reporter_id" />
            <TextField source="reported_id" />
            <TextField source="content" />
            <TextField source="writeday" />
            <ShowButton/>
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
