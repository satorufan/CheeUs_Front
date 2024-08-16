import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import Box from "@mui/material/Box";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase";
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import './ToastEditor.css'
import Swal from "sweetalert2";

// 이미지 리사이즈 및 크롭 함수 정의
const handleImageResize = (blob, maxWidth = 800) => {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(blob);
    const img = document.createElement('img');
    img.src = imageUrl;

    // DOM에 이미지 요소를 추가
    document.body.appendChild(img);

    img.onload = () => {
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;
      const aspectRatio = originalWidth / originalHeight; // 원본 비율 계산

      // 최대 너비 설정 (maxWidth를 초과하면 maxWidth로 조정)
      const targetWidth = originalWidth > maxWidth ? maxWidth : originalWidth;
      const targetHeight = targetWidth / aspectRatio; // 비율에 따라 높이 계산

      const cropper = new Cropper(img, {
        aspectRatio: aspectRatio, // 원본 비율 유지
        autoCropArea: 1, // 이미지 전체 사용
        movable: true,
        zoomable: true,
        scalable: true,
        ready() {
          const canvasData = cropper.getCroppedCanvas({
            width: targetWidth, // 최대 너비에 따라 너비 설정
            height: targetHeight, // 비율을 유지하면서 높이를 설정
          });
          canvasData.toBlob((croppedBlob) => {
            resolve(croppedBlob);
            cropper.destroy(); // 작업이 끝난 후 cropper 인스턴스를 제거
            document.body.removeChild(img); // 작업 후 이미지 요소를 제거.
          }, blob.type);
        },
      });
    };

    img.onerror = (error) => {
      reject(error);
      document.body.removeChild(img); // 오류 발생 시 이미지 요소를 제거
    };
  });
};

// 이미지 업로드 함수 정의
const onUploadImage = async (blob, callback, uploadedImages, setUploadedImages, category, postId) => {
  const storageRef = ref(storage, `images/${category}/${postId}/${blob.name}`);

  try {
    // 이미지 크기 조절 및 크롭 처리 (max-width: 800px 적용)
    const resizedBlob = await handleImageResize(blob);

    const storageRef = ref(storage, `images/${category}/${postId}/${blob.name}`);
    // Firebase Storage에 이미지 업로드
    const snapshot = await uploadBytes(storageRef, resizedBlob);
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

const ToastEditor = forwardRef(({ content, category, postId, maxLength = 3000 }, ref) => {
  const editorRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [warningShown, setWarningShown] = useState(false);

  useImperativeHandle(ref, () => ({
    getInstance: () => editorRef.current.getInstance(),
    getUploadedImages: () => uploadedImages,
    setUploadedImages: (images) => setUploadedImages(images),
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