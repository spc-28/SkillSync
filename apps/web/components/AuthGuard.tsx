'use client'
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageLoader from './Loader';

export const AuthGuard = ({ children }: { children: ReactNode}) => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/signin');
        } else {
            setIsLoading(false);
        }
    }, [router]);

    if (isLoading) {
        return <PageLoader/>;
    }

    return children;
};