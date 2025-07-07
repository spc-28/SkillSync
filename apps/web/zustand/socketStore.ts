import { Socket } from "socket.io-client";
import { create } from "zustand";


type SocketType = {
    ws: Socket | null;
    setWs: (socket: Socket | null) => void;
};

export const useSocketStore = create<SocketType>((set) => ({
    ws: null,
    setWs: (socket) => set({ ws: socket })
}));