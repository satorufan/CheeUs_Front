import axios from 'axios';
import { stringify } from 'query-string';
import { useContext } from 'react';
import { useAuth } from './AuthContext';

const apiUrl = 'http://localhost:8080/admin';

const endpoints = {
    users: `${apiUrl}/AdminUser`,
    posts: `${apiUrl}/AdminPost`,
    reports: `${apiUrl}/AdminReport`,
    events: `${apiUrl}/AdminEvent`,
    magazines: `${apiUrl}/AdminMagazine`,
};

//쿠키에서 JWT 토큰 불러오기.
const getJwtToken = () => {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'Authorization') {
        return decodeURIComponent(value);
      }
    }
    return null;
}

const adminToken = getJwtToken();

const httpHeader = {
    headers : {
        "Authorization" : `Bearer ${adminToken}`
    },
    withCredentials : true
}

const dataProvider = {
    getList: async (resource, params) => {
        const url = endpoints[resource];
        const { data } = await axios.get(url, httpHeader);
        return {
            data: data.map(item => ({ ...item, id: item.email || item.id })),
            total: data.length,
        };
    },
    getOne: async (resource, params) => {
        console.log('params:', params);
        const url = `${endpoints[resource]}/${params.email || params.id}`;
        const { data } = await axios.get(url, {headers : httpHeader});
        // 응답 데이터가 `id` 필드를 포함하도록 변환
        const result = { ...data, id: data.email }; // 여기서 data.email을 id로 사용
        return { data: result };
        //return { data };
    },
    getMany: async (resource, params) => {
        const url = `${endpoints[resource]}?${stringify(params)}`;
        const { data } = await axios.get(url, {headers : httpHeader});
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
        console.log('params.data:', params.data);
        const url = endpoints[resource];
        console.log("create params.data " + params.data);
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