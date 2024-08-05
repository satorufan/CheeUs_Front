import axios from 'axios';
import { stringify } from 'query-string';

const apiUrl = 'http://localhost:8080/admin/UserData';

const userDataProvider = {
    getList: async (resource, params) => {
        console.log('Requesting list data from:', apiUrl);
        const { data } = await axios.get(apiUrl);
        console.log('Received data:', data);
        return {
            data: data.map(item => ({ ...item, id: item.email })), // email을 id로 사용
            total: data.length,
        };
    },
    getOne: async (resource, params) => {
        console.log(`Requesting one data for email: ${params.id} from:`, `${apiUrl}/${params.id}`);
        const { data } = await axios.get(`${apiUrl}/${params.id}`);
        console.log('Received data:', data);
        return { data: { ...data, id: data.email } };
    },
    getMany: async (resource, params) => {
        console.log('Requesting many data with params:', params);
        const { data } = await axios.get(`${apiUrl}?${stringify(params)}`);
        console.log('Received data:', data);
        return { data: data.map(item => ({ ...item, id: item.email })) };
    },
    getManyReference: async (resource, params) => {
        console.log('Requesting many reference data with params:', params);
        const { data } = await axios.get(`${apiUrl}?${stringify(params)}`);
        console.log('Received data:', data);
        return { data: data.map(item => ({ ...item, id: item.email })) };
    },
    update: async (resource, params) => {
        console.log(`Updating data for email: ${params.id} with data:`, params.data);
        await axios.put(`${apiUrl}/${params.id}`, params.data);
        return { data: { ...params.data, id: params.data.email } };
    },
    updateMany: async (resource, params) => {
        console.log('Updating many data with ids:', params.ids);
        await Promise.all(params.ids.map(id => axios.put(`${apiUrl}/${id}`, params.data)));
        return { data: params.ids };
    },
    create: async (resource, params) => {
        console.log('Creating data with:', params.data);
        const { data } = await axios.post(apiUrl, params.data);
        console.log('Created data:', data);
        return { data: { ...params.data, id: data.email } };
    },
    delete: async (resource, params) => {
        console.log(`Deleting data for email: ${params.id}`);
        await axios.delete(`${apiUrl}/${params.id}`);
        return { data: params.previousData };
    },
    deleteMany: async (resource, params) => {
        console.log('Deleting many data with ids:', params.ids);
        await Promise.all(params.ids.map(id => axios.delete(`${apiUrl}/${id}`)));
        return { data: params.ids };
    }
};

export default userDataProvider;
