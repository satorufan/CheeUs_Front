import React, { useRef, forwardRef, useImperativeHandle } from "react";
import Box from "@mui/material/Box";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase";

// 이미지 업로드 함수 정의
const onUploadImage = async (blob, callback) => {
  const storageRef = ref(storage, `images/${blob.name}`);
  
  try {
    // Firebase Storage에 이미지 업로드
    const snapshot = await uploadBytes(storageRef, blob);
    // 업로드된 이미지의 다운로드 URL 가져오기
    const url = await getDownloadURL(snapshot.ref);
    // 콜백을 통해 에디터에 이미지 URL 삽입
    callback(url, "alt text");
  } catch (error) {
    console.error("Image upload failed:", error);
  }
};
const ToastEditor = forwardRef(({ content }, ref) => {
  const editorRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getInstance: () => editorRef.current.getInstance(),
  }));

  return (
    <div>
      <Box sx={{ m: 2 }}>
        <Editor
          height="96vh"
         //placeholder="내용을 입력해주세요."
          initialValue={content || ' '}
          ref={editorRef}
          previewStyle="vertical"
          initialEditType="wysiwyg"
          hooks={{
            addImageBlobHook: onUploadImage,
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
