'use client'
import { useState } from "react";
import SignInForm from "../../../components/SignInForm";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    college: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Sign Up:' );
  };

    return(
        <SignInForm
      formData={formData}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
    />
    )
}