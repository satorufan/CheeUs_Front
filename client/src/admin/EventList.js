import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, SearchInput, Toolbar, SaveButton, DateInput, ImageInput, ImageField, useNotify } from 'react-admin';
import { Edit, SimpleForm, TextInput, BooleanInput, RichTextField, DateField } from 'react-admin';
import { Create } from 'react-admin';
import { FilterSidebar, ListActions } from './FilterSidebar';
import { RichTextInput } from 'ra-input-rich-text';
import BackButton from './custom/BackButton';
import BooleanField from './BooleanField';
import TuiEditorInput from './custom/TuiEditorInput';

const eventFilters = [
    <SearchInput source="q" />,
    <TextInput label="id" source="id" defaultValue="" />,
    <TextInput label="adminId" source="admin_id" defaultValue="" />,
    <TextInput label="adminName" source="admin_name" defaultValue="" />,
    <TextInput label="title" source="title" defaultValue="" />,
    <TextInput label="title2" source="title2" defaultValue="" />,
    <TextInput label="content" source="content" defaultValue="" />,
    <TextInput label="writeday" source="writeday" defaultValue="" />,
    <BooleanInput label="hidden" source="hidden" defaultValue="" />
];
	
export const EventList = (props) => (
    <List {...props} debounce={1000} actions={<ListActions/>}  filters={eventFilters} aside={<FilterSidebar/>}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="admin_id" />
            <TextField source="admin_name" />
            <TextField source="title" />
            <TextField source="title2" />
            <DateField source="writeday" />
            <BooleanField source="hidden" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

const EventToolbar = () =>{
	<Toolbar>
		<SaveButton/>
		<SaveButton
			label = "post.action.save_and_notify"
			transform={data => ({...data, notify: true})}
			type="button"
		/>
	</Toolbar>
};

export const EventCreate = (props) => (
    <Create  {...props}>
        <SimpleForm toolbar={<EventToolbar/>}>
            <TextInput source="id" />
            <TextInput source="admin_id" />
            <TextInput source="admin_name" />
            <TextInput source="title" />
            <TextInput source="title2" />
            <TuiEditorInput source="content" defaultValue="" />
            <DateInput source="writeday" />
            <BooleanInput source="hidden" label="Hidden" />
            <SaveButton />
        </SimpleForm>
        <BackButton />
    </Create>
);

export const EventEdit = (props) => (
    <Edit {...props}>
        <SimpleForm toolbar={<EventToolbar/>}>
            <TextInput source="id" />
            <TextInput source="admin_id" />
            <TextInput source="admin_name" />
            <TextInput source="title" />
            <TextInput source="title2" />
            <TuiEditorInput source="content" />
            <DateInput source="writeday" />
            <BooleanInput source="hidden" label="Hidden" />
            <SaveButton/>
        </SimpleForm>
        <BackButton />
    </Edit>
);