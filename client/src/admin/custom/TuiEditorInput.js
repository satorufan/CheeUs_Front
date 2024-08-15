import React, { useRef, useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import { useInput } from 'react-admin';
import { Editor as ToastEditor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../components/firebase/firebase";


// 이미지 업로드 함수 정의
const onUploadImage = async (blob, callback, uploadedImages, setUploadedImages, category, postId) => {
    const storageRef = ref(storage, `images/admin/${category}/${postId}/${blob.name}`);
  
    try {
      // Firebase Storage에 이미지 업로드
      const snapshot = await uploadBytes(storageRef, blob);
      // 업로드된 이미지의 다운로드 URL 가져오기
      const url = await getDownloadURL(snapshot.ref);
      // 콜백을 통해 에디터에 이미지 URL 삽입
      callback(url, "alt text");
      // 업로드된 이미지 URL을 상태에 저장
      setUploadedImages(prev => [...prev, url]);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };
  
const TuiEditorInput = ({ label, source, category, postId, ...props }) => {
    const {
        field: { value, onChange },
        fieldState: { error },
    } = useInput({ source, ...props });

    const editorRef = useRef();
    const [uploadedImages, setUploadedImages] = useState([]);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.getInstance().setMarkdown(value || '');
        }
    }, [value]);

    const handleChange = () => {
        const editorInstance = editorRef.current.getInstance();
        const newValue = editorInstance.getMarkdown();
        onChange(newValue);
    };


    return (
        <div>
          <Box sx={{ m: 2 }}>
            <label>{label}</label>
            <ToastEditor
                height="400px"
                initialValue={value || ''}
                ref={editorRef}
                previewStyle="vertical"
                initialEditType="markdown"
                hooks={{
                    addImageBlobHook: (blob, callback) => onUploadImage(blob, callback, uploadedImages, setUploadedImages, category, postId),
                }}
	            toolbarItems={[
	              ["heading", "bold", "italic", "strike"],
	              ["hr", "quote"],
	              ["ul", "ol", "task", "indent", "outdent"],
	              ["image", "link"],
	            ]}
	            usageStatistics={false}
	            hideModeSwitch={true}
	            language="ko-KR"    
                onChange={handleChange}   
            />
        </Box>
            {error && <span>{error.message}</span>}
        </div>
    );
};

export default TuiEditorInput;
