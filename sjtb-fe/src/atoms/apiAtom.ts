import { atom } from 'recoil';

import {IApiState} from "@/types/interfaces/api-interface";

export const apiAtom = atom<IApiState>({
    key: 'apiAtom',
    default: {
        result_popPostAPI: false
    },
});