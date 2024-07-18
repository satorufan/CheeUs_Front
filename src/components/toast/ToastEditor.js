import React, { useRef, forwardRef, useImperativeHandle } from "react";
import Box from "@mui/material/Box";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";

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
