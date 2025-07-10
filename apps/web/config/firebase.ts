import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { clientAuth } from "@repo/firebase-config"
import { toast } from "sonner";
import axios from "axios";
import { useUserStore } from "../zustand/userStore";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(clientAuth, provider)

    const res = await axios.post(`${process.env.NEXT_PUBLIC_DEV_API_URL + "/auth/googleSignup"}`, {
      fullName: result.user.displayName,
      email: result.user.email,
      uid: result.user.uid,
      institute: "The LNM Institute of Information Technology"

    });

    localStorage.setItem('token', await result.user.getIdToken());
    useUserStore.getState().setUserId(result.user.uid);
    useUserStore.getState().setUserGender(res.data.user.gender);
    useUserStore.getState().setUserName(res.data.user.fullName);
    localStorage.setItem('userId', result.user.uid);

  } catch (error: any) {
    toast.error('Failed: ' + error.message)
  }
}