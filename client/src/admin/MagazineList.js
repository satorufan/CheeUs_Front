import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, Toolbar, SaveButton, SearchInput, ChipField, CreateButton, SelectInput } from 'react-admin';
import { Edit, SimpleForm, TextInput, BooleanInput, DateField, ChipInput, DateInput } from 'react-admin';
import { Create } from 'react-admin';
import BooleanField from './BooleanField'; 
import { FilterSidebar, ListActions } from './FilterSidebar';
import BackButton from './custom/BackButton';
import TuiEditorInput from './custom/TuiEditorInput';

const magazineFilters = [
    <SearchInput source="q" />,
    <TextInput label="id" source="id" defaultValue="" />,
    <TextInput label="adminId" source="admin_id" defaultValue="" />,
    <TextInput label="adminName" source="admin_name" defaultValue="" />,
    <SelectInput label="category" source="category" defaultValue="" />,
    <TextInput label="title" source="title" defaultValue="" />,
    <TextInput label="title2" source="title2" defaultValue="" />,
    <TextInput label="content" source="content" defaultValue="" />,
    <TextInput label="writeday" source="writeday" defaultValue="" />,
    <BooleanInput label="hidden" source="hidden" defaultValue="" />
];

export const MagazineList = (props) => (
    <List {...props} debounce={1000} actions={<ListActions/>}  filters={magazineFilters} aside={<FilterSidebar/>}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="admin_id" />
            <TextField source="admin_name" />
            <ChipField source="category" />
            <TextField source="title" />
            <TextField source="title2" />
            <DateField source="writeday" />
            <BooleanField source="hidden" />
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
            <TextInput source="id" />
            <TextInput source="admin_id" />
            <TextInput source="admin_name" />
            <SelectInput source="category"choices={[
                { id: 'popup', name: 'POP-UP' },
                { id: 'tmi', name: 'TMI' },
                { id: 'recipe', name: 'Recipe' },
                { id: 'recommend', name: 'Recommend' },
            ]} />
            <TextInput source="title" />
            <TextInput source="title2" />
            <TuiEditorInput source="content" category="megazineboard" defaultValue="" />
            <DateInput source="writeday" />
            <BooleanInput source="hidden" label="Hidden" />
            <SaveButton/>
        </SimpleForm>
        <BackButton/>
    </Create>
);

export const MagazineEdit = (props) => (
    <Edit {...props}>
        <SimpleForm toolbar={MagazineToolbar}>
            <TextInput source="id" />
            <TextInput source="admin_id" />
            <TextInput source="admin_name" />
            <SelectInput source="category"choices={[
                { id: 'popup', name: 'POP-UP' },
                { id: 'tmi', name: 'TMI' },
                { id: 'recipe', name: 'Recipe' },
                { id: 'recommend', name: 'Recommend' },
            ]} />
            <TextInput source="title" />
            <TextInput source="title2" />
            <TuiEditorInput source="content" defaultValue="" />
            <DateInput source="writeday" />
            <BooleanInput source="hidden" label="Hidden" />
            <SaveButton/>
        </SimpleForm>
        <BackButton/>
    </Edit>
);