import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, SearchInput,  ShowButton, RichTextField, FunctionField, SaveButton, Toolbar, ChipField, NumberField, NumberInput, Create} from 'react-admin';
import { Edit, SimpleForm, TextInput, BooleanInput, DateInput, DateField } from 'react-admin';
import { SelectInput } from 'react-admin';
import BooleanField from './BooleanField'; 
import { FilterSidebar, ListActions } from './FilterSidebar';
import { RichTextInput } from 'ra-input-rich-text';
import BackButton from './custom/BackButton';
import TuiEditorInput from './custom/TuiEditorInput';


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
    <NumberInput label="Category" source="category" defaultValue="" />,
    <TextInput label="NickName" source="nickname" defaultValue="" />,
    <TextInput label="Title" source="title" defaultValue="" />,
    <DateInput label="WriteDay" source="writeday" defaultValue="" />,
    <BooleanInput label ="Pinned" source="pinned" defaultValue={false}/>,
    <BooleanInput label ="Hidden" source="hidden" defaultValue={false}/>,
];
//            <CustomCategoryField source="category" />
export const PostList = (props) => (
    <List {...props} debounce={1000} actions={<ListActions/>} filters={postFilters} aside={<FilterSidebar/>}>
        <Datagrid rowClick="edit">
            <NumberField source="id" />
            <TextField source="author_id" />
            <TextField source="nickname" />
            <TextField source="title" />
			<CustomCategoryField source="category" />            
            <DateField source="writeday" />
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
			transform={data => ({...data, notify: true},console.log("데이타?",data))}
			type="button"
		/>
	</Toolbar>
};

export const PostCreate = (props) => (
	<Create {...props}>
		<SimpleForm toolbar={<PostToolbar/>}>
			<NumberInput source='id'/>
			<TextInput source='author_id'/>
			<TextInput source='nickname'/>
			<TextInput source='title'/>
            <SelectInput source="category" choices={[
			    { id: 1, name: 'FreeBoard' },
			    { id: 2, name: 'ShotrForm' },
			    { id: 3, name: 'EventBoard' },
			]} />			
            <TuiEditorInput source="content" defaultValue="" />			
			<DateInput source='writeday'/>
            <BooleanInput source="pinned" label="Pinned" />
            <BooleanInput source="hidden" label="Hidden" />			
			<SaveButton/>            
		</SimpleForm>
		<BackButton/>
	</Create>
);



export const PostEdit = (props) => (
    <Edit {...props}>
        <SimpleForm toolbar = {<PostToolbar/>}>
            <NumberInput source="id" />
            <TextInput source="author_id" />
            <TextInput source="nickname" />
            <TextInput source="title" />
            <SelectInput source="category" choices={[
			    { id: 1, name: 'FreeBoard' },
			    { id: 2, name: 'ShotrForm' },
			    { id: 3, name: 'EventBoard' },
			]} />
            <TuiEditorInput source="content" defaultValue="" />
            <DateInput source="writeday" />
            <BooleanInput source="pinned" label="Pinned" />
            <BooleanInput source="hidden" label="Hidden" />
            <SaveButton/>
        </SimpleForm>
        <BackButton/>
    </Edit>
);
