import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";
import Box from "@mui/material/Box";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase";

// 이미지 업로드 함수 정의
const onUploadImage = async (blob, callback, uploadedImages, setUploadedImages, category, postId) => {
  const storageRef = ref(storage, `images/${category}/${postId}/${blob.name}`);

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

const ToastEditor = forwardRef(({ content, category, postId }, ref) => {
  const editorRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);

  useImperativeHandle(ref, () => ({
    getInstance: () => editorRef.current.getInstance(),
    getUploadedImages: () => uploadedImages,
    setUploadedImages: (images) => setUploadedImages(images),
    getContent: () => editorRef.current.getInstance().getMarkdown()
  }));

  return (
    <div>
      <Box sx={{ m: 2 }}>
        <Editor
          height="63vh"
          initialValue={content || ' '}
          ref={editorRef}
          previewStyle="vertical"
          initialEditType="wysiwyg"
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
        />
      </Box>
    </div>
  );
});

export default ToastEditor;