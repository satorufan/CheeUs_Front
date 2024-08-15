import axios from 'axios';
import { stringify } from 'query-string';
import { useContext } from 'react';
import { useAuth } from './AuthContext';
import { Editor } from "@toast-ui/react-editor";

import { ref, deleteObject, getDownloadURL, listAll } from "firebase/storage";
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

const getUploadedImageUrls = async (directoryPath) => {
    try {
        const directoryRef = ref(storage, directoryPath);
        const result = await listAll(directoryRef);

        const fileUrls = [];
        for (const itemRef of result.items) {
            const url = await getDownloadURL(itemRef);
            fileUrls.push(url);
        }

        return fileUrls;
    } catch (error) {
        console.error('Error listing files in directory:', error);
        return [];
    }
};

const extractImageUrls = (content) => {
    const regex = /!\[.*?\]\((.*?)\)/g;
    let urls = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        urls.push(match[1]);
    }
    return urls;
};

const deleteUnusedImages = async (currentContent, directoryPath) => {
    console.log("direcgoryPah///////", directoryPath);
    const usedImageUrls = extractImageUrls(currentContent);
    const uploadedImageUrls = await getUploadedImageUrls(directoryPath);
    console.log("uploadedimagesurls///////", uploadedImageUrls);
    const unusedImageUrls = uploadedImageUrls.filter(url => !usedImageUrls.includes(url));
    console.log("unusedimagesurls///////", unusedImageUrls);

    for (const url of unusedImageUrls) {
        const imageRef = ref(storage, url);
        try {
            await deleteObject(imageRef);
            console.log(`Deleted unused image: ${url}`);
        } catch (error) {
            console.error(`Failed to delete unused image: ${url}`, error);
        }
    }
};

const fetchEventLatestPostId = async () => {
    try {
        const response = await axios.get('http://localhost:8080/board/eventboard/latest');
        return response.data.latestId + 1;
    } catch (error) {
        console.error("Failed to fetch latest post ID:", error);
        return null;
    }
};

const fetchMagazineLatestPostId = async () => {
    try {
        const response = await axios.get('http://localhost:8080/board/magazineboard/latest');
        return response.data.latestId + 1;
    } catch (error) {
        console.error("Failed to fetch latest post ID:", error);
        return null;
    }
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
        // 모든 리소스에 대해 id를 사용
	    const resourceId = params.id;

        if (!resourceId) {
	        console.error(`Resource ID is missing for resource: ${resource}`);
	        throw new Error(`Resource ID is missing for resource: ${resource}`);
	    }

        console.log('params:', params);
        console.log('params url', endpoints[resource]);
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
         // 항상 id 필드를 사용하여 리소스 ID 가져오기
	    const resourceId = params.data.id;
	
	    if (!resourceId) {
	        throw new Error(`Resource ID is missing for resource: ${resource}`);
	    }

        console.log('params.data:', params.data);
        var url = endpoints[resource];
        console.log('data-----------:', url);
        console.log("update params.data " + params.data);
        const category = url.substring(url.lastIndexOf('/') + 1); // "AdminMagazine"
        console.log("category>>>>>>>>>>>>.", category);
        // 현재 게시물 ID 가져오기
        const postId = params.data.id;
        console.log("postId : ", postId);

        // Firebase Storage에서 사용되지 않는 이미지 삭제
        var directoryPath = "";
        if ( category == "AdminEvent" ) {
            directoryPath = `images/admin/eventboard/${postId}`;
        } else {
            directoryPath = `images/admin/magazineboard/${postId}`;
        }

        const content = params.data.content;
        await deleteUnusedImages(content, directoryPath);

        
	    url = `${endpoints[resource]}/${resourceId}`;
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
       
        const url = endpoints[resource];

        const category = url.substring(url.lastIndexOf('/') + 1); // "AdminMagazine"
        console.log('Last Segment:', category);
        console.log('params.data:', params.data);

        
        
        // 최신 게시물 ID 가져오기
        var postId = "";

        var directoryPath = "";
        if ( category == "AdminEvent" ) {
            postId = await fetchEventLatestPostId();
            directoryPath = `images/admin/eventboard/${postId}`;
        } else {
            postId = await fetchMagazineLatestPostId();
            directoryPath = `images/admin/magazineboard/${postId}`;
        }

        console.log("directoryPaht-----", directoryPath);
        // Firebase Storage에서 사용되지 않는 이미지 삭제
        const content = params.data.content;
        console.log("contentd////////////", content);
        await deleteUnusedImages(content, directoryPath);

        const { data } = await axios.post(url, params.data, httpHeader);
        console.log('Resource created successfully:', data); // 로그 추가

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

        // 이미지 삭제
        const toBeDeletedImages = extractImageUrls(content);
        toBeDeletedImages.map(async (photoUrl) => {
            const imageRef = ref(storage, photoUrl);
            try {
              await deleteObject(imageRef);
              console.log(`이미지가 성공적으로 삭제되었습니다: ${photoUrl}`);
            } catch (error) {
              console.error(`이미지 삭제 중 오류가 발생했습니다 (${photoUrl}):`, error);
            }
          }
        )

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