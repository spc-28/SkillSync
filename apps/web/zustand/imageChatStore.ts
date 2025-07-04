import { create } from "zustand";

interface ImageChatStore {
    imagePreview: string | null;
    setImagePreview: (image: string | null) => void;
    imageFile: File | null;
    setImageFile: (file: File | null) => void;
}


export const useImageChatStore = create<ImageChatStore>((set) => ({
    imagePreview: null,
    setImagePreview: (image) => set({ imagePreview: image }),

    imageFile: null,
    setImageFile: (file) => set({ imageFile: file })
}))