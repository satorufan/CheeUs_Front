import React from 'react';
import { List, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, SearchInput, BooleanField, ShowButton, BooleanInput, Toolbar, SaveButton} from 'react-admin';
import { FilterSidebar, ListActions } from './FilterSidebar';
import BackButton from './custom/BackButton';

const userFilters = [
    <SearchInput source="q" alwaysOn />,
    <TextInput label="Id" source="id" defaultValue="" />,
    <TextInput label="Email" source="email" defaultValue="" />,
    <TextInput label="Name" source="namel" defaultValue="" />,
    <TextInput label="NickName" source="nickname" defaultValue="" />,
    <TextInput label="Tel" source="tel" defaultValue="" />,
    <TextInput label="Birth" source="birth" defaultValue="" />,
    <BooleanInput label ="Blacklist" source="blacklist" defaultValue={false}/>,
];

export const UserList = (props) => (
    <List {...props} debounce={1000} actions={<ListActions/>} filters={userFilters} aside={<FilterSidebar/>}> 
        <Datagrid rowClick="edit">
            <TextField source="email" />
            <TextField source="name" />
            <TextField source="nickname" />
            <TextField source="tel" />
            <TextField source="birth" />
            <BooleanField source='blacklist'/>
            <ShowButton/>
            <EditButton />
        </Datagrid>
    </List>
);

const UserToolbar = () =>{
	<Toolbar>
		<SaveButton/>
		<SaveButton
			label = "post.action.save_and_notify"
			transform={data => ({...data, notify: true})}
			type="button"
		/>
	</Toolbar>
};

export const UserEdit = (props) => (
    <Edit {...props}>
        <SimpleForm toolbar={<UserToolbar/>}>
            <TextInput source="email" />
            <TextInput source="name" />
            <TextInput source="nickname" />
            <TextInput source="tel" />
            <TextInput source="birth" />
            <BooleanInput source='blacklist' label="Blacklist"/>
            <SaveButton/>
        </SimpleForm>
        <BackButton/>
    </Edit>
);
