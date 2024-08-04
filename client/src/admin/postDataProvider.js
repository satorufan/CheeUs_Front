import axios from 'axios';
import { stringify } from 'query-string';

const apiUrl = 'http://localhost:8080/admin/AdminBoard';

const postDataProvider = {
    getList: async (resource, params) => {
        const { data } = await axios.get(apiUrl);
        return {
            data: data.map(item => ({ ...item, id: item.id })), // assuming `id` is the unique identifier for posts
            total: data.length,
        };
    },
    getOne: async (resource, params) => {
        const { data } = await axios.get(`${apiUrl}/${params.id}`);
        return { data: { ...data, id: data.id } };
    },
    getMany: async (resource, params) => {
        const { data } = await axios.get(`${apiUrl}?${stringify(params)}`);
        return { data: data.map(item => ({ ...item, id: item.id })) };
    },
    getManyReference: async (resource, params) => {
        const { data } = await axios.get(`${apiUrl}?${stringify(params)}`);
        return { data: data.map(item => ({ ...item, id: item.id })) };
    },
    update: async (resource, params) => {
        await axios.put(`${apiUrl}/${params.id}`, params.data);
        return { data: { ...params.data, id: params.data.id } };
    },
    updateMany: async (resource, params) => {
        await Promise.all(params.ids.map(id => axios.put(`${apiUrl}/${id}`, params.data)));
        return { data: params.ids };
    },
    create: async (resource, params) => {
        const { data } = await axios.post(apiUrl, params.data);
        return { data: { ...params.data, id: data.id } };
    },
    delete: async (resource, params) => {
        await axios.delete(`${apiUrl}/${params.id}`);
        return { data: params.previousData };
    },
    deleteMany: async (resource, params) => {
        await Promise.all(params.ids.map(id => axios.delete(`${apiUrl}/${id}`)));
        return { data: params.ids };
    }
};

export default postDataProvider;
