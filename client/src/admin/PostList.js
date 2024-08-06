import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton } from 'react-admin';
import { Edit, SimpleForm, TextInput, BooleanInput } from 'react-admin';
import { DateInput, NumberInput, ReferenceInput } from 'react-admin';
import { Create } from 'react-admin';
import BooleanField from './BooleanField'; 
import ToggleButton from './ToggleButton'; 

export const PostList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="author_id" />
            <TextField source="nickname" />
            <TextField source="category" />
            <TextField source="title" />
            <TextField source="content" />
            <TextField source="writeday" />
            <BooleanField source="pinned" />
            <BooleanField source="hidden" />
            <ToggleButton field="pinned" />
            <ToggleButton field="hidden" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);


export const PostEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="nickname" />
            <NumberInput source="category" />
            <TextInput source="title" />
            <TextInput source="content" />
            <TextInput source="photoes" />
            <TextInput source="media" />
            <TextInput source="author_id"/>
            <BooleanInput source="pinned" label="Pinned" />
            <BooleanInput source="hidden" label="Hidden" />
        </SimpleForm>
    </Edit>
);

export const PostCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="author_id" />
            <TextInput source="nickname" />
            <TextInput source="category" />
            <TextInput source="title" />
            <TextInput source="content" />
            <TextInput source="writeday" />
            <BooleanInput source="pinned" label="Pinned" />
            <BooleanInput source="hidden" label="Hidden" />
        </SimpleForm>
    </Create>
);