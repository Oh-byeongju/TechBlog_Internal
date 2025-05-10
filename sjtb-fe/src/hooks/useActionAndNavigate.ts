'use client';

import { useRouter } from 'next/navigation';

import usePopup from "@/hooks/usePopup";

const useActionAndNavigate = () => {
    const popupController = usePopup();
    const router = useRouter();

    const actionAndNavigate = (url: string, action?: () => void) => {
        !!action && action();
        router.push(url);
        popupController.closeAll();
    };

    return { actionAndNavigate };
};

export default useActionAndNavigate;
