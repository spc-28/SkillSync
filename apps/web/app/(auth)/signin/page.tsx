'use client'
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import SignInForm from "../../../components/SignInForm";
import { toast } from "sonner";
import { useUserStore } from "../../../zustand/userStore";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    college: ''
  });
  const [loading, setLoading] = useState(false);
  const { setUserId } = useUserStore();

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_DEV_API_URL + "/auth/signin"}`, formData);
      const data = response.data;
      localStorage.setItem('token', data.token);
      setUserId(data.user.uid);
      localStorage.setItem('userId', data.user.uid);
      toast.success(data.message);
      router.push('/discover');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignInForm
      formData={formData}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      loading={loading}
    />
  );
}