import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, Toolbar, SaveButton, SearchInput, ChipField, CreateButton, RichTextField, SelectInput } from 'react-admin';
import { Edit, SimpleForm, TextInput, BooleanInput } from 'react-admin';
import { Create } from 'react-admin';
import BooleanField from './BooleanField'; 
import ToggleButton from './ToggleButton'; 
import { FilterSidebar, ListActions } from './FilterSidebar';
import { RichTextInput } from 'ra-input-rich-text';

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
            <TextField source="admin_name" />
            <TextField source="title" />
            <TextField source="title2" />
            <RichTextField source="content" />
            <TextField source="writeday" />
            <TextField source="like" />
            <ChipField source="category" />
            <BooleanField source="pinned" />
            <BooleanField source="hidden" />
            <ToggleButton field="pinned" />
            <ToggleButton field="hidden" />
            <CreateButton/>
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

const MagazineToolbar = () =>{
	<Toolbar>
		<SaveButton/>
		<SaveButton
			label = "post.action.save_and_notify"
			transform={data => ({...data, notify: true})}
			type="button"
		/>
	</Toolbar>
};

export const MagazineCreate = (props) => (
    <Create {...props}>
        <SimpleForm toolbar={<MagazineToolbar/>}>
            <TextInput source="admin_name" />
            <TextInput source="title" />
            <TextInput source="title2" />
            <RichTextInput source="content" />
            <TextInput source="writeday" />
            <SelectInput source="category"choices={[
			    { id: 'popup', name: 'POP-UP' },
			    { id: 'tmi', name: 'TMI' },
			    { id: 'recipe', name: 'Recipe' },
			    { id: 'recommend', name: 'Recommend' },
			]} />
            <BooleanInput source="pinned" label="Pinned" />
            <BooleanInput source="hidden" label="Hidden" />
            <SaveButton/>
        </SimpleForm>
    </Create>
);

export const MagazineEdit = (props) => (
    <Edit {...props}>
        <SimpleForm toolbar={MagazineToolbar}>
            <TextInput source="admin_name" />
            <TextInput source="title" />
            <TextInput source="title2" />
            <RichTextInput source="content" />
            <SelectInput source="category"choices={[
			    { id: 'popup', name: 'POP-UP' },
			    { id: 'tmi', name: 'TMI' },
			    { id: 'recipe', name: 'Recipe' },
			    { id: 'recommend', name: 'Recommend' },
			]} />
            <BooleanInput source="pinned" label="Pinned" />
            <BooleanInput source="hidden" label="Hidden" />
            <SaveButton/>
        </SimpleForm>
    </Edit>
);


