import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, SearchInput,  ShowButton, RichTextField, FunctionField, SaveButton} from 'react-admin';
import { Edit, SimpleForm, TextInput, BooleanInput, Toolbar } from 'react-admin';
import { SelectInput } from 'react-admin';
import BooleanField from './BooleanField'; 
import { FilterSidebar, ListActions } from './FilterSidebar';
import { RichTextInput } from 'ra-input-rich-text';
import BackButton from './custom/BackButton';

const categoryMap = {
    '1': 'FreeBoard',
    '2': 'ShortForm',
    '3': 'EventBoard'
};

const CustomCategoryField = (props) => (
    <FunctionField
        {...props}
        render={record => categoryMap[record.category] || 'Unknown'}
    />
);

const postFilters = [
    <SearchInput source="q" />,
    <TextInput label="Email" source="email" defaultValue="" />,
    <TextInput label="Category" source="category" defaultValue="" />,
    <TextInput label="NickName" source="nickname" defaultValue="" />,
    <TextInput label="Title" source="title" defaultValue="" />,
    <TextInput label="WriteDay" source="writeday" defaultValue="" />,
    <BooleanInput label ="Pinned" source="pinned" defaultValue={true}/>,
    <BooleanInput label ="Hidden" source="hidden" defaultValue={true}/>,
];

export const PostList = (props) => (
    <List {...props} debounce={1000} actions={<ListActions/>} filters={postFilters} aside={<FilterSidebar/>}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="author_id" />
            <TextField source="nickname" />
            <TextField source="title" />
            <CustomCategoryField source="category" />
            <RichTextField source = "content"/>
            <TextField source="writeday" />
            <BooleanField source="pinned" />
            <BooleanField source="hidden" />
            <ShowButton/>
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

const PostToolbar = () =>{
	<Toolbar>
		<SaveButton/>
		<SaveButton
			label = "post.action.save_and_notify"
			transform={data => ({...data, notify: true})}
			type="button"
		/>
	</Toolbar>
};

export const PostEdit = (props) => (
    <Edit {...props}>
        <SimpleForm toolbar={<PostToolbar/>}>
            <TextInput source="title" />
            <SelectInput source="category" choices={[
			    { id: '1', name: 'FreeBoard' },
			    { id: '2', name: 'ShotrForm' },
			    { id: '3', name: 'EventBoard' },
			]} />
            <RichTextInput source="content" />
            <BooleanInput source="pinned" label="Pinned" />
            <BooleanInput source="hidden" label="Hidden" />
            <SaveButton/>
        </SimpleForm>
        <BackButton/>
    </Edit>
);
