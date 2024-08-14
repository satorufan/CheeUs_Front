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
    const regex = /!\[.*?\]\((.*?)\)/g;
    let urls = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      urls.push(match[1]);
    }
    return urls;
  };

//   // 사용되지 않는 이미지 삭제 함수
//   const deleteUnusedImages = async (currentContent) => {
//     const usedImageUrls = extractImageUrls(currentContent);
//     const uploadedImages = editorRef.current.getUploadedImages();

//     const unusedImages = uploadedImages.filter(url => !usedImageUrls.includes(url));

//     for (const url of unusedImages) {
//       const imageRef = ref(storage, url);
//       try {
//         await deleteObject(imageRef);
//         console.log(`Deleted unused image: ${url}`);
//       } catch (error) {
//         console.error(`Failed to delete unused image: ${url}`, error);
//       }
//     }
//   };



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
        const { data } = await axios.get(url, httpHeader);
        // 응답 데이터가 `id` 필드를 포함하도록 변환
        const result = { ...data, id: data.email }; // 여기서 data.email을 id로 사용
        return { data: result };
        //return { data };
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
        const url = `${endpoints[resource]}/${params.data.email || params.data.id}`;
        console.log("update params.data " + params.data);
        await axios.put(url, params.data, httpHeader);
        return { data: params.data };
    },
    updateMany: async (resource, params) => {
        const promises = params.ids.map(id => {
            const url = `${endpoints[resource]}/${id}`;
            return axios.put(url, params.data, httpHeader);
        });
        await Promise.all(promises);
        return { data: params.ids };
    },
    // create: async (resource, params) => {
    //     console.log('params.data:', params.data);
    //     const url = endpoints[resource];

    //     const category = params.data.category;
    //     if(category == "") {

    //     } else {

    //     }
    //     const content = params.data.content;
    //     const usedImageUrls = extractImageUrls(content);

    //     // 삭제할 이미지는 초기 업로드된 이미지 목록에서 사용된 이미지를 제외한 것입니다.
    //     const unusedImages = uploadedImages.filter(url => !usedImageUrls.includes(url));

    //     // 사용되지 않은 이미지를 Firebase에서 삭제합니다.
    //     await deleteUnusedImages(unusedImages);

    //     // 초기화
    //     uploadedImages = [];

    //     const { data } = await axios.post(url, params.data, httpHeader);
    //     console.log('Resource created successfully:', data); // 로그 추가

    //     return { data: { ...params.data, id: data.email || data.id } };
    // },
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
        //await deleteUnusedImages(imageUrls);

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