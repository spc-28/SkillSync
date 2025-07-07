'use client'
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageLoader from './Loader';
import { useUserStore } from '../zustand/userStore';

export const AuthGuard = ({ children }: { children: ReactNode}) => {
    const [isLoading, setIsLoading] = useState(true);
    const { setUserId } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token && !userId) {
            router.push('/signin');
        } else {
            setUserId(userId || "");
            setIsLoading(false);
        }
    }, [router]);

    if (isLoading) {
        return <PageLoader/>;
    }

    return children;
};