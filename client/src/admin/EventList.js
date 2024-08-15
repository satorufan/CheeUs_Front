import React, { useState, useEffect } from 'react'; // useEffect 추가
import { List, Datagrid, TextField, EditButton, DeleteButton, SearchInput, Toolbar, SaveButton, DateInput, ImageInput, ImageField, useNotify } from 'react-admin';
import { Edit, SimpleForm, TextInput, BooleanInput, RichTextField, DateField } from 'react-admin';
import { useParams } from 'react-router-dom'; // react-router-dom에서 useParams를 가져옵니다

import { Create } from 'react-admin';
import { useGetOne } from 'react-admin';
import { FilterSidebar, ListActions } from './FilterSidebar';
import { RichTextInput } from 'ra-input-rich-text';
import BackButton from './custom/BackButton';
import BooleanField from './BooleanField';
import TuiEditorInput from './custom/TuiEditorInput';
import axios from 'axios';


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



export const EventCreate = (props) => {
    const [postId, setPostId] = useState(null);

    useEffect(() => {
        const fetchLatestPostId = async () => {
            try {
                const response = await axios.get('http://localhost:8080/board/eventboard/latest');
                setPostId(response.data.latestId + 1);  // 새로운 postId는 현재 가장 최신 ID에 1을 더한 값
            } catch (error) {
                console.error("Failed to fetch latest post ID:", error);
            }
        };

        fetchLatestPostId();
    }, []);
    console.log("postId category --- ", postId);

    if (postId === null) {
        return <div>Loading...</div>;  // postId를 받아올 때까지 로딩 상태
    }

    return (
        <Create {...props}>
            <SimpleForm toolbar={<EventToolbar />}>
                <TextInput source="id" />
                <TextInput source="admin_id" />
                <TextInput source="admin_name" />
                <TextInput source="title" />
                <TextInput source="title2" />
                <TuiEditorInput source="content" category="eventboard" postId={postId} defaultValue="" />
                <DateInput source="writeday" />
                <BooleanInput source="hidden" label="Hidden" />
                <SaveButton />
            </SimpleForm>
            <BackButton />
        </Create>
    );
};

export const EventEdit = (props) => {
    const { id } = useParams(); // URL에서 id를 가져옵니다
    
    return (
        <Edit {...props}>
            <SimpleForm toolbar={<EventToolbar />}>
                <TextInput source="id" />
                <TextInput source="admin_id" />
                <TextInput source="admin_name" />
                <TextInput source="title" />
                <TextInput source="title2" />
                <TuiEditorInput source="content" category="eventboard" postId={id} defaultValue="" />
                <DateInput source="writeday" />
                <BooleanInput source="hidden" label="Hidden" />
                <SaveButton />
            </SimpleForm>
            <BackButton />
        </Edit>
    );
};