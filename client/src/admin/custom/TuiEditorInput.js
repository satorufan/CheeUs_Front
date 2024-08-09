import React, { useRef, useEffect } from 'react';
import { useInput } from 'react-admin';
import { Editor as ToastEditor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

const TuiEditorInput = ({ label, source, ...props }) => {
    const {
        field: { value, onChange },
        fieldState: { error },
    } = useInput({ source, ...props });

    const editorRef = useRef();

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
            <label>{label}</label>
            <ToastEditor
                initialValue={value}
                previewStyle="vertical"
                height="400px"
                initialEditType="markdown"
	            toolbarItems={[
	              ["heading", "bold", "italic", "strike"],
	              ["hr", "quote"],
	              ["ul", "ol", "task", "indent", "outdent"],
	              ["image", "link"],
	            ]}
	            usageStatistics={false}
	            hideModeSwitch={true}
	            language="ko-KR"
                ref={editorRef}
                onChange={handleChange}
            />
            {error && <span>{error.message}</span>}
        </div>
    );
};

export default TuiEditorInput;
