import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, SearchInput, Toolbar, SaveButton, DateInput } from 'react-admin';
import { Edit, SimpleForm, TextInput, BooleanInput, SelectInput, ChipField, RichTextField, DateField } from 'react-admin';
import { Create } from 'react-admin';
import BooleanField from './BooleanField'; 
import ToggleButton from './ToggleButton'; 
import { FilterSidebar, ListActions } from './FilterSidebar';
import { RichTextInput } from 'ra-input-rich-text';

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
            <RichTextField source="content" />
            <TextField source="title2" />
            <DateField source="writeday" />
            <ChipField source="catagory" />
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
    <Create {...props}>
        <SimpleForm toolbar={<EventToolbar/>}>
            <TextInput source="admin_name" />
            <TextInput source="title" />
            <TextInput source="title2" />
            <RichTextInput source="content" />
            <DateInput source="writeday" />
            <SelectInput source="category"choices={[
			    { id: 'event', name: 'Event' },
			]} />
            <BooleanInput source="hidden" label="Hidden" />
            <SaveButton/>
        </SimpleForm>
    </Create>
);

export const EventEdit = (props) => (
    <Edit {...props}>
        <SimpleForm toolbar={<EventToolbar/>}>
            <TextInput source="admin_name" />
            <TextInput source="title" />
            <TextInput source="title2" />
            <RichTextInput source="content" />
            <SelectInput source="category"choices={[
			    { id: 'event', name: 'Event' },
			]} />
            <BooleanInput source="hidden" label="Hidden" />
            <SaveButton/>
        </SimpleForm>
    </Edit>
);
