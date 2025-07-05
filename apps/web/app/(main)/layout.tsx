import { AuthGuard } from "../../components/AuthGuard";
import Header from "../../components/Header";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <AuthGuard>
                <Header />
                {children}
            </AuthGuard>
        </>
    );
}
