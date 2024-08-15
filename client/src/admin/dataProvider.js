import axios from 'axios';
import { stringify } from 'query-string';
import { useContext } from 'react';
import { useAuth } from './AuthContext';

import { ref, deleteObject } from "firebase/storage";
import { storage } from "../components/firebase/firebase";

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


// 이미지 URL 추출 함수
const extractImageUrls = (content) => {
    console.log("Extracting image URLs from content:", content); // 로그 추가
    const regex = /!\[.*?\]\((.*?)\)/g;
    let urls = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        urls.push(match[1]);
    }
    console.log("Extracted image URLs:", urls); // 로그 추가
    return urls;
};
// Firebase 스토리지 경로 추출 함수
const extractFirebasePath = (url) => {
    const match = url.match(/\/o\/(.*?)\?/);
    return match ? decodeURIComponent(match[1]) : null;
};

// 사용되지 않는 이미지 삭제 함수
const deleteUnusedImages = async (unusedImages) => {
    for (const url of unusedImages) {
        const firebasePath = extractFirebasePath(url);
        if (firebasePath) {
            const imageRef = ref(storage, firebasePath);
            try {
                await deleteObject(imageRef);
                console.log(`Deleted unused image: ${url}`);
            } catch (error) {
                console.error(`Failed to delete unused image: ${url}`, error);
            }
        } else {
            console.error(`Failed to extract Firebase path from URL: ${url}`);
        }
    }
};

// 사용자가 업로드한 이미지 URL을 추적할 배열
let uploadedImages = [];


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
	
	    // 모든 리소스에 대해 id를 사용
	    const resourceId = params.id;
	
	    if (!resourceId) {
	        console.error(`Resource ID is missing for resource: ${resource}`);
	        throw new Error(`Resource ID is missing for resource: ${resource}`);
	    }
	
	    const url = `${endpoints[resource]}/${resourceId}`;
	    const { data } = await axios.get(url, httpHeader);
	
	    // 응답 데이터가 `id` 필드를 포함하도록 변환
	    const result = { ...data, id: data.id || resourceId };
	
	    return { data: result };
	},
    getMany: async (resource, params) => {
        const url = `${endpoints[resource]}?${stringify(params)}`;
        const { data } = await axios.get(url, httpHeader);
        return { data };
    },
    getManyReference: async (resource, params) => {
        const url = `${endpoints[resource]}?${stringify(params)}`;
        const { data } = await axios.get(url);
        return { data };
    },
	update: async (resource, params) => {
	    console.log('params.data:', params.data);
	
	    // 항상 id 필드를 사용하여 리소스 ID 가져오기
	    const resourceId = params.data.id;
	
	    if (!resourceId) {
	        throw new Error(`Resource ID is missing for resource: ${resource}`);
	    }
	
	    const url = `${endpoints[resource]}/${resourceId}`;
	    console.log("update params.data:", params.data);
	
	    // 서버에 PUT 요청 보내기
	    const { data } = await axios.put(url, params.data, httpHeader);
	
	    // 반환 데이터에 ID 포함
	    return { data: { ...params.data, id: resourceId } };
	},
    updateMany: async (resource, params) => {
        const promises = params.ids.map(id => {
            const url = `${endpoints[resource]}/${id}`;
            return axios.put(url, params.data, httpHeader);
        });
        await Promise.all(promises);
        return { data: params.ids };
    },
    create: async (resource, params) => {
        console.log('params.data:', params.data);
        const url = endpoints[resource];

        const content = params.data.content;
        const usedImageUrls = extractImageUrls(content);

        // 삭제할 이미지는 초기 업로드된 이미지 목록에서 사용된 이미지를 제외한 것입니다.
        const unusedImages = uploadedImages.filter(url => !usedImageUrls.includes(url));

        // 사용되지 않은 이미지를 Firebase에서 삭제합니다.
        await deleteUnusedImages(unusedImages);

        // 초기화
        uploadedImages = [];

        const { data } = await axios.post(url, params.data, httpHeader);
        console.log('Resource created successfully:', params.data); // 로그 추가
        console.log('url', params.data); // 로그 추가

        return { data: { ...params.data, id: data.email || data.id } };
    },
    delete: async (resource, params) => {
        // 게시글 데이터 가져오기
        const getPost = async (postId) => {
            const url = `${endpoints[resource]}/${postId}`;
            const { data } = await axios.get(url, httpHeader);
            return data;
        };

        const postId = params.email || params.id;

        // 게시글 데이터에서 이미지 URL 추출
        const postData = await getPost(postId);
        const content = postData.content;
        const imageUrls = extractImageUrls(content);

        // 이미지 삭제
        await deleteUnusedImages(imageUrls);

        // 게시글 삭제
        const url = `${endpoints[resource]}/${postId}`;
        await axios.delete(url, httpHeader);

        return { data: params.previousData };
    },
    deleteMany: async (resource, params) => {
        const promises = params.ids.map(id => {
            const url = `${endpoints[resource]}/${id}`;
            return axios.delete(url, httpHeader);
        });
        await Promise.all(promises);
        return { data: params.ids };
    }
};

export default dataProvider;