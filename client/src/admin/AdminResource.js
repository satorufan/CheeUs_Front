import React from 'react';
import { Resource } from 'react-admin';
import { UserList, UserEdit, UserCreate } from './UserList';
import { PostList, PostEdit, PostCreate } from './PostList';
import UserIcon from '@material-ui/icons/Group';
import PostIcon from '@material-ui/icons/Book';
import ReportIcon from '@material-ui/icons/Report';

export const userResource = (
    <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} icon={UserIcon} />
);

//export const postResource = (
//    <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon} />
//);

export const reportResource = (
    <Resource name="report" list={UserList} edit={UserEdit} create={UserCreate} icon={ReportIcon} />
);
