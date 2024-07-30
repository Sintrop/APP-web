import { storage } from "./firebase";
import { uploadBytesResumable, ref, getDownloadURL} from "firebase/storage";

export async function saveImageFirebase(file) {
    const storageRef = ref(storage, `/images/${parseInt(Math.random() * 13546584654)}.png`);
    const upload = await uploadBytesResumable(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
} 