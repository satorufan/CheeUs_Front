import {React, useState, useEffect} from 'react';
import axios from 'axios';
import { List, Datagrid, TextField, EditButton, DeleteButton, Toolbar, SaveButton, SearchInput, ChipField, CreateButton, SelectInput } from 'react-admin';
import { Edit, SimpleForm, TextInput, DateField, DateInput } from 'react-admin';
import { useParams } from 'react-router-dom'; // react-router-dom에서 useParams를 가져옵니다
import { Create } from 'react-admin';
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

export const MagazineCreate = (props) => {
    const [postId, setPostId] = useState(null);

    useEffect(() => {
        const fetchLatestPostId = async () => {
            try {
                const response = await axios.get('http://localhost:8080/board/magazineboard/latest');
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
                <TuiEditorInput source="content" category="magazineboard" postId={postId} defaultValue="" />
                <DateInput source="writeday" />
                <SaveButton/>
            </SimpleForm>
            <BackButton/>
        </Create>
    );
};

export const MagazineEdit = (props) => {
    const { id } = useParams(); // URL에서 id를 가져옵니다

    return(
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
                <TuiEditorInput source="content" category="magazineboard" postId={id} defaultValue="" />
                <DateInput source="writeday" />
                <SaveButton/>
            </SimpleForm>
            <BackButton/>
        </Edit>
    );
};