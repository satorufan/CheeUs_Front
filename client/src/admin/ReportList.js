import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, Edit, SimpleForm, TextInput, Create, SearchInput, DateField, ShowButton } from 'react-admin';
import { stringify } from 'query-string';
import { FilterSidebar, ListActions } from './FilterSidebar';

const apiUrl = 'http://localhost:8080/admin/AdminReport';

const reportFilters = [
    <SearchInput source="q" />,
    <TextInput label="id" source="id" defaultValue="" />,
    <TextInput label="reporterId" source="reporter_id" defaultValue="" />,
    <TextInput label="reportedId" source="reported_id" defaultValue="" />,
    <TextInput label="content" source="content" defaultValue="" />,
    <TextInput label="writeday" source="writeday" defaultValue="" />,
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
            <TextInput source="id" />
            <TextInput source="reporter_id" />
            <TextInput source="reported_id" />
            <TextInput source="content" />
            <TextInput source="writeday" />
        </SimpleForm>
    </Edit>
);

export const ReportCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="reporter_id" />
            <TextInput source="reported_id" />
            <TextInput source="content" />
            <TextInput source="writeday" />
        </SimpleForm>
    </Create>
);
