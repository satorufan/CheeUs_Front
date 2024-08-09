import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

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