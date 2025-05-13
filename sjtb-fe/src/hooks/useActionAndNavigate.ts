'use client';

import {usePathname, useRouter} from 'next/navigation';
import {useSetRecoilState} from "recoil";

import usePopup from "@/hooks/usePopup";
import {apiAtom} from "@/atoms/apiAtom";
import {routerAtom} from "@/atoms/routerAtom";

const useActionAndNavigate = () => {
    const popupController = usePopup();
    const router = useRouter();
    const setApiState = useSetRecoilState(apiAtom);
    const setRouterState = useSetRecoilState(routerAtom);
    const pathname = usePathname();

    const actionAndNavigate = (url: string, action?: () => void) => {
        // url 값에 따라 get API 호출 State 조정
        if (url === '/') {
            // 홈
            setApiState(prev => ({
                ...prev,
                result_popPostAPI: false,
                result_allPostAPI: false
            }));
        } else if (/^\/board\/new$/.test(url)) {
            // 새 글 작성 페이지
            setApiState(prev => ({
                ...prev
            }));
        } else if (/^\/board\/\d+\/edit$/.test(url)) {
            // 글 수정 페이지
            setApiState(prev => ({
                ...prev
            }));
        } else if (/^\/board\/search\/.+$/.test(url)) {
            // 검색 결과 페이지
            setApiState(prev => ({
                ...prev
            }));
        } else if (/^\/board\/\d+$/.test(url)) {
            // 게시글 상세 페이지
            setApiState(prev => ({
                ...prev,
                result_getPostBySlugAPI: false,
                result_UserInfo: false,
                result_CountList: false,
                result_CmmtList: false
            }));
        } else {
            // 그 외
            setApiState(prev => ({
                ...prev
            }));
        }

        // 현재 스크롤 위치 저장 후 flag 설정
        const scrollY =  window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
        sessionStorage.setItem(`scroll-${pathname}`, String(scrollY));
        setRouterState(prev => ({
            ...prev,
            routerState: true
        }))
        console.log(`💾 [navigate] saved scrollY for ${pathname}: ${scrollY}px`);

        !!action && action();
        router.push(url);
        popupController.closeAll();
    };

    return { actionAndNavigate };
};

export default useActionAndNavigate;
