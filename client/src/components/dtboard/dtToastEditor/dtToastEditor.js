import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import Box from "@mui/material/Box";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import './dtToastEditor.css'
import Swal from "sweetalert2";


const ToastEditor = forwardRef(({ content, maxLength = 3000 }, ref) => {
  const editorRef = useRef(null);
  const [warningShown, setWarningShown] = useState(false);

  useImperativeHandle(ref, () => ({
    getInstance: () => editorRef.current.getInstance(),
    getContent: () => editorRef.current.getInstance().getMarkdown()
  }));

  useEffect(() => {
    const editorInstance = editorRef.current.getInstance();

    const handleChange = () => {
      const textLength = editorInstance.getMarkdown().length;

      if (textLength > maxLength && !warningShown) {
        setWarningShown(true);
        Swal.fire({
          title: `글자 수는 ${maxLength}자를 초과할 수 없습니다.`,
          icon: 'warning',
          confirmButtonColor: '#48088A',
          confirmButtonText: '확인',
        }).then(() => {
          setWarningShown(false);
        });
      }
    };

    editorInstance.on('change', handleChange);

    return () => {
      editorInstance.off('change', handleChange);
    };
  }, [maxLength, warningShown]);


  return (
    <div className="dt-input-size">
      <Box sx={{ m: 2 }}>
        <Editor
          height="63vh"
          initialValue={content || ' '}
          ref={editorRef}
          previewStyle="vertical"
          initialEditType="wysiwyg"
          toolbarItems={[
            ["heading", "bold", "italic", "strike"],
            ["hr", "quote"],
            ["ul", "ol", "task", "indent", "outdent"],
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