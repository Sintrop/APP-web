import { api } from "./api";

export async function getImage(hash){
    const response = await api.get(`/image/${hash}`);
    return response.data.image.firebaseURL
}