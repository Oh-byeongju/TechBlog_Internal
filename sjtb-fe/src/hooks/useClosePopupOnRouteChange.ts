'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

import usePopup from "@/hooks/usePopup";

const useClosePopupsOnRouteChange = () => {
    const router = useRouter();
    const popupController = usePopup();

    useEffect(() => {
        console.log("close");
        const handleRouteChangeStart = () => {
            popupController.closeAll();
            console.log("close");
        };

        router.events.on('routeChangeStart', handleRouteChangeStart);

        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart);
        };
    }, [router]);

    return null;
};

export default useClosePopupsOnRouteChange;