'use client';

import {useEffect, useState} from 'react';
import {useQuery} from "react-query";
import {AxiosResponse} from "axios";

import {EBannerType, EBlank} from '@/types/enums/common-enum';
import {IPostData} from "@/types/interfaces/post-interface";
import axiosClient from "@/libs/axiosClient";
import useActionAndNavigate from "@/hooks/useActionAndNavigate";

import Blank from '@/components/blank/Blank';
import PageContainer from '@/components/containers/PageContainer';
import Banner from '@/components/banner/Banner';
import WriterInfo from '@/components/read/WriterInfo';
import ContentsContainer from '@/components/containers/ContentsContainer';
import BodyContainer from '@/components/containers/BodyContainer';
import TagList from '@/components/read/TagList';
import ActivityBox from '@/components/read/ActivityBox';
import EditorSection from "@/components/edit/EditorSection";
import Summary from "@/components/read/Summary";


interface Props {
    params: {
        slug: string;
    };
}

const getPostBySlugAPI = (slug: string): Promise<AxiosResponse<IPostData>> => {
    return axiosClient.get('/api/getPostBySlug', {
        params: {slug: slug}
    });
};

const Post = (props: Props) => {
    const [post, setPost] = useState<IPostData | undefined>();
    const [content, setContent] = useState<string>('');
    const actionAndNavigate = useActionAndNavigate();

    const result_getPostBySlugAPI = useQuery(
        ["result_getPostBySlugAPI"],
        () => getPostBySlugAPI(props.params.slug),
        {
            onSuccess: (data) => {
                setPost(data.data);
            },
            onError: () => {
                actionAndNavigate.actionAndNavigate('/');
            }
        }
    );

    useEffect(() => {
        result_getPostBySlugAPI.refetch();
    }, [])

    return (
        <PageContainer>
            <Blank type={EBlank.Header}/>
            {
                !post ?
                    <Banner type={EBannerType.Home} title={""}/>
                    :
                    <>
                        <Banner type={EBannerType.Read} title={post.title} author={post.author}
                                dateModified={post.dateModified}/>
                        <BodyContainer>
                            <ContentsContainer>
                                <Summary description={post.description}/>
                                <EditorSection post={post} readOnly={true}/>
                                <WriterInfo author={post.author}/>
                                <TagList tags={post.keywords}/>
                                <ActivityBox slug={post.slug}/>
                            </ContentsContainer>
                        </BodyContainer>
                    </>
            }
        </PageContainer>
    );
};

export default Post;
