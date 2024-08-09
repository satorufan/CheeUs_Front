import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDO-CBtKB5YmJHhw9Xdkifczg8c3hHMF2s",
    authDomain: "cheeusfinal.firebaseapp.com",
    projectId: "cheeusfinal",
    storageBucket: "cheeusfinal.appspot.com",
    messagingSenderId: "32329144490",
    appId: "1:32329144490:web:775a41f0f330d275ef58d3"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };