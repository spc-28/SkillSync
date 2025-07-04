'use client'
import { useState } from "react";
import SignUpForm from "../../../components/SignUpForm";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    college: ''
  });

  const colleges = [
    "Stanford University",
    "MIT",
    "Harvard University",
    "UC Berkeley",
    "Carnegie Mellon University",
    "Georgia Tech",
    "University of Illinois",
    "Cornell University",
    "University of Michigan",
    "UCLA",
    "UT Austin",
    "University of Washington",
    "Princeton University",
    "Columbia University",
    "Yale University",
    "Other"
  ];

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
        <SignUpForm
      formData={formData}
      colleges={colleges}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
    />
    )
}