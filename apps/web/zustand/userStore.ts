import { create } from "zustand";

interface UserStore {
    userId: string;
    setUserId: (id: string) => void

    userName: string;
    setUserName: (name: string) => void

    userGender: string;
    setUserGender: (gender: string) => void
}

export const useUserStore = create<UserStore>((set) => ({
    userId: "",
    setUserId: (id) => set({ userId: id }),

    userName: '',
    setUserName: (id) => set({ userName: id.split(" ")[0] }),

    userGender: '',
    setUserGender: (id) => set({ userGender: id === 'male' ? 'boy' : 'girl' }),
}))