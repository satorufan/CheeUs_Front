import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import "@toast-ui/editor/dist/toastui-editor.css";
import {Editor} from '@toast-ui/react-editor';


const ToastEditor = ({ content }) => {
  const editorRef = useRef(null);

 // const onUploadImage = async (blob, callback) => {
    //const url = await uploadImage(blob); //이미지 업로드 함수를 호출하여 이미지를 서버에 업로드하고 URL을 받아옴
    //callback(url, 'alt text'); // // callback 함수를 호출하여 업로드된 이미지의 URL과 대체 텍스트('alt text')를 전달
    //return false; 
  //};

  return (
    <div>
      <Box sx={{ m: 2 }}>
        <Editor
          height="50vh"
          placeholder="Please Enter Text."
          initialValue={content || ' '}
          ref={editorRef}
          previewStyle="vertical"
          initialEditType="markdown"
          toolbarItems={[
            ["heading", "bold", "italic", "strike"],
            ["hr", "quote"],
            ["ul", "ol", "task", "indent", "outdent"],
            ["image", "link"],
          ]}
          usageStatistics={false}
          language="ko-KR"
          //hooks={{
         //   addImageBlobHook: onUploadImage
          //}}
        />
      </Box>
    </div>
  );
};

export default ToastEditor;