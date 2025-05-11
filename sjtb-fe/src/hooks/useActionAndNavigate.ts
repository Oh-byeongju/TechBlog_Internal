'use client';

import { useRouter } from 'next/navigation';
import {useSetRecoilState} from "recoil";

import usePopup from "@/hooks/usePopup";
import {apiAtom} from "@/atoms/apiAtom";

const useActionAndNavigate = () => {
    const popupController = usePopup();
    const router = useRouter();
    const setApiState = useSetRecoilState(apiAtom)

    const actionAndNavigate = (url: string, action?: () => void) => {
        !!action && action();

        // url 값에 따라 get API 호출 State 조정
        if (url === '/') {
            setApiState(prev => ({
                ...prev,
                result_popPostAPI: false,
            }))
        }

        router.push(url);
        popupController.closeAll();
    };

    return { actionAndNavigate };
};

export default useActionAndNavigate;
