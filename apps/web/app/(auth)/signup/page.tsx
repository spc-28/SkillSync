'use client'
import { useState } from "react";
import axios from "axios";
import SignUpForm from "../../../components/SignUpForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../../zustand/userStore";

export default function Page() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    institute: ''
  });
  const { setUserId } = useUserStore();
  const [loading, setLoading] = useState(false);

  const colleges = [
    "The LNM Institute of Information Technology"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_DEV_API_URL + "/auth/signup"}`, formData);
      const data = response.data;
      localStorage.setItem('token', data.token);
      setUserId(data.user.uid);
      localStorage.setItem('userId', data.user.uid)
      toast.success(data.message);
      router.push(`/complete-profile/${data.user.uid}`);
    } catch (err: any) {
      toast.error(err.response.data.message || 'Something went wrong')
    } finally {
      setLoading(false);
    }
  };

    return(
        <SignUpForm
      formData={formData}
      colleges={colleges}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      loading={loading}
    />
    )
}