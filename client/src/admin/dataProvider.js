import axios from 'axios';
import { stringify } from 'query-string';

const apiUrl = 'http://localhost:8080/admin';

const endpoints = {
    users: `${apiUrl}/UserData`,
    posts: `${apiUrl}/AdminBoard`,
    reports: `${apiUrl}/AdminReport`
};

const dataProvider = {
    getList: async (resource, params) => {
        const url = endpoints[resource];
        const { data } = await axios.get(url);
        return {
            data: data.map(item => ({ ...item, id: item.email || item.id })),
            total: data.length,
        };
    },
    getOne: async (resource, params) => {
        console.log('params:', params);
        const url = `${endpoints[resource]}/${params.email || params.id}`;
        const { data } = await axios.get(url);
        // 응답 데이터가 `id` 필드를 포함하도록 변환
        const result = { ...data, id: data.email }; // 여기서 data.email을 id로 사용
        return { data: result };
        //return { data };
    },
    getMany: async (resource, params) => {
        const url = `${endpoints[resource]}?${stringify(params)}`;
        const { data } = await axios.get(url);
        return { data };
    },
    getManyReference: async (resource, params) => {
        const url = `${endpoints[resource]}?${stringify(params)}`;
        const { data } = await axios.get(url);
        return { data };
    },
    update: async (resource, params) => {
        console.log('params.data:', params.data);
        const url = `${endpoints[resource]}/${params.data.email || params.data.id}`;
        console.log("update params.data " + params.data);
        await axios.put(url, params.data);
        return { data: params.data };
    },
    updateMany: async (resource, params) => {
        const promises = params.ids.map(id => {
            const url = `${endpoints[resource]}/${id}`;
            return axios.put(url, params.data);
        });
        await Promise.all(promises);
        return { data: params.ids };
    },
    create: async (resource, params) => {
        const url = endpoints[resource];
        const { data } = await axios.post(url, params.data);
        return { data: { ...params.data, id: data.email || data.id } };
    },
    delete: async (resource, params) => {
        const url = `${endpoints[resource]}/${params.email || params.id}`;
        await axios.delete(url);
        return { data: params.previousData };
    },
    deleteMany: async (resource, params) => {
        const promises = params.ids.map(id => {
            const url = `${endpoints[resource]}/${id}`;
            return axios.delete(url);
        });
        await Promise.all(promises);
        return { data: params.ids };
    }
};

export default dataProvider;

/*
const apiUrl = 'http://localhost:8080/admin';

const dataProvider = {
    getList: async (resource, params) => {
        const { data } = await axios.get(apiUrl);
        return {
            data: data,
            total: data.length,
        };
    },
    getOne: async (resource, params) => {
        const { data } = await axios.get(`${apiUrl}/${params.email}`);
        return { data };
    },
    getMany: async (resource, params) => {
        const { data } = await axios.get(`${apiUrl}?${stringify(params)}`);
        return { data };
    },
    getManyReference: async (resource, params) => {
        const { data } = await axios.get(`${apiUrl}?${stringify(params)}`);
        return { data };
    },
    update: async (resource, params) => {
        await axios.put(`${apiUrl}/${params.id}`, params.data);
        return { data: params.data };
    },
    updateMany: async (resource, params) => {
        await Promise.all(params.emails.map(email => axios.put(`${apiUrl}/${email}`, params.data)));
        return { data: params.ids };
    },
    create: async (resource, params) => {
        const { data } = await axios.post(apiUrl, params.data);
        return { data: { ...params.data, email: data.email } };
    },
    delete: async (resource, params) => {
        await axios.delete(`${apiUrl}/${params.email}`);
        return { data: params.previousData };
    },
    deleteMany: async (resource, params) => {
        await Promise.all(params.ids.map(email => axios.delete(`${apiUrl}/${email}`)));
        return { data: params.emails };
    }
};

export default dataProvider;
 */