import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, auth } from "./firebase";
import { v4 as uuid } from "uuid";

/**
 * Uploads an image File to Firebase Storage and returns the public download URL.
 * Path: landing-images/{uid}/{uuid}.{ext}
 */
export async function uploadImage(file) {
  const uid  = auth.currentUser?.uid || "anon";
  const ext  = file.name.split(".").pop().toLowerCase() || "jpg";
  const path = `landing-images/${uid}/${uuid()}.${ext}`;
  const storageRef = ref(storage, path);
  const snapshot   = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}
