import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, Toolbar, SaveButton, SearchInput } from 'react-admin';
import { Edit, SimpleForm, TextInput, BooleanInput } from 'react-admin';
import { Create } from 'react-admin';
import BooleanField from './BooleanField'; 
import ToggleButton from './ToggleButton'; 
import { FilterSidebar, ListActions } from './FilterSidebar';

const magazineFilters = [
    <SearchInput source="q" />,
    <TextInput label="Email" source="email" defaultValue="" />,
    <TextInput label="Category" source="category" defaultValue="" />,
    <TextInput label="NickName" source="nickname" defaultValue="" />,
];




export const MagazineList = (props) => (
    <List {...props} debounce={1000} actions={<ListActions/>}  filters={magazineFilters} aside={<FilterSidebar/>}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="admin_id" />
            <TextField source="title" />
            <TextField source="admin_name" />
            <TextField source="content" />
            <TextField source="title2" />
            <TextField source="category" />
            <BooleanField source="pinned" />
            <BooleanField source="hidden" />
            <ToggleButton field="pinned" />
            <ToggleButton field="hidden" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const MagazineEdit = (props) => (
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

const MagazineCreateToolbar = () =>{
	<Toolbar>
		<SaveButton/>
		<SaveButton
			label = "post.action.save_and_notify"
			transform={data => ({...data, notify: true})}
			type="button"
		/>
	</Toolbar>
}

export const MagazineCreate = (props) => (
    <Create {...props}>
        <SimpleForm toolbar={<MagazineCreateToolbar/>}>
            <TextInput source="title" />
            <TextInput source="title2" />
            <TextInput source="content" />
            <TextInput source="category" />
            <BooleanInput source="pinned" label="Pinned" />
            <BooleanInput source="hidden" label="Hidden" />
        </SimpleForm>
    </Create>
);
