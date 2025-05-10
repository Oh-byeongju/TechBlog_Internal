'use client';

import {AxiosResponse} from "axios";
import {useEffect} from "react";
import {useQuery} from "react-query";

import {IPostData} from "@/types/interfaces/post-interface";
import axiosClient from "@/libs/axiosClient";
import useBreakPoint from "@/hooks/useBreakPoint";
import {EBreakPoint} from "@/types/enums/common-enum";

import Label from "@/components/label/Label";
import ColumnPostMotion from "@/components/post/ColumnPostMotion";
import ColumnPostSlider from "@/components/post/ColumnPostSlider";

const popPost = (): Promise<AxiosResponse<IPostData[]>> => {
    return axiosClient.get('/api/popPost');
};

const PopularPost = () => {
    const breakPoint = useBreakPoint();

    const result_popPostAPI = useQuery(
        ["result_popPostAPI"],
        () => popPost(),
        {
            enabled: false
        }
    );

    useEffect(() => {
        result_popPostAPI.refetch();
    }, [])

    return (
        <>
            <Label text={'인기 있는 글'}/>
            {
                result_popPostAPI.status !== 'success' ||
                result_popPostAPI.isFetching ?
                    <div style={{width: '100%', height: '388px', borderRadius: '10px', background: 'lightgray'}}/> :
                    (
                        breakPoint === EBreakPoint.LG ?
                            <ColumnPostMotion posts={result_popPostAPI.data?.data}/> :
                            <ColumnPostSlider posts={result_popPostAPI.data?.data}/>
                    )
            }
        </>
    )
}

export default PopularPost;