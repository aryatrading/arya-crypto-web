import { FC, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { PlayIcon, ArrowTrendingDownIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import moment from 'moment';
import clsx from 'clsx';

import { Col, Row } from '../../shared/layout/flex';
import { PostTypes } from '../../../types/asset';
import { fetchPendingMarketItemLogos, getMarketKey, userPic } from '../../../services/firebase/community/posts';
import { formatNumber, shortNumberFormat } from '../../../utils/helpers/prices';
import Button from '../../shared/buttons/button';
import { playVideoIcon } from '../../svg/playIcon';
import { LikeIcon } from '../../svg/likeIcon';
import { CommentsIcon } from '../../svg/commentsIcon';
import { ShareIcon } from '../../svg/shareIcon';
import { AwardIcon } from '../../svg/awardIcon';

import AudioDisplay from './AudioDisplay/AudioDisplay';
import { awardsImages } from './awards';
import styles from './index.module.scss';

export const Post: FC<{ post: PostTypes }> = ({ post }: { post: PostTypes }) => {
    const { t } = useTranslation();
    const [logo, setLogo] = useState<any>();
    const [postMediaList, setPostMediaList] = useState<any>([]);
    const marketKey: string = useMemo(() => getMarketKey(post.FinancialData?.Instrument?.MarketItem?.Symbol?.toLowerCase(), post.FinancialData?.Instrument?.MarketItem?.Market?.toLowerCase(), post.FinancialData?.Instrument?.MarketItem?.To?.toLowerCase()), [post.FinancialData?.Instrument?.MarketItem?.Market, post.FinancialData?.Instrument?.MarketItem?.Symbol, post.FinancialData?.Instrument?.MarketItem?.To]);

    const marketItemIcon = useCallback(async () => {
        if (post?.FinancialData?.Instrument) {
            return await fetchPendingMarketItemLogos([marketKey], setLogo);
        } else {
            return;
        }
    }, [marketKey, post?.FinancialData?.Instrument]);

    useEffect(() => {
        marketItemIcon();
    }, [marketItemIcon]);

    useEffect(() => {
        const newPostMediaList: (ReactElement | undefined)[] = [];
        if (post.Video) {
            newPostMediaList.push(
                <Col className={styles['video-container']}>
                    <video
                        muted={false}
                        className={styles.media}>
                        <source src={post.Video.videoUrl} />
                    </video>
                    <Button className={styles['video-overlay']}>
                        <Col className='w-full h-full justify-center items-center'>
                            {playVideoIcon}
                        </Col>
                    </Button>
                </Col>
            );
        }
        if (post?.Images) {
            post.Images.forEach((imageUrl: any) => {
                newPostMediaList.push(
                    <img className={styles.media} src={imageUrl} alt={`Img_${imageUrl}`} />
                );
            })
        }
        setPostMediaList(newPostMediaList);
    }, [post?.Images, post.Video]);


    const logoURL = useMemo(() => logo?.[marketKey]?.[0], [logo, marketKey]);

    const awardCount = useMemo(() => Object.keys(post?.AwardsCount || {})?.length, [post?.AwardsCount]);
    const icon = useMemo(() =>
        post?.FinancialData?.Sell ?
            <ArrowTrendingDownIcon className='stroke-red-1 w-3 h-3 rotate-12' />
            :
            <ArrowTrendingUpIcon className='stroke-green-1 w-3 h-3 -rotate-12' />
        , [post?.FinancialData?.Sell]);


    return (
        <a className='mb-8' href={`https://arya-web-app.vercel.app/post/${post._id}`} target='_blank' rel="noreferrer">
            <Row className='w-[100%] h-[50px] my-2 gap-4'>
                <Image src={userPic(post.Author)} alt='userAvatar' width={40} height={40} className='rounded-[20px] max-h-[40px]' />
                <Col>
                    <span className='text-base font-bold text-white'>{post.Author?.Name}</span>
                    <Row className='items-center gap-2'>
                        {post.Author?.Job && <span className='text-sm font-medium text-grey-1'>{post.Author?.Job}</span>}
                        {post.Author?.Job && <Col className='w-1.5 h-1.5 rounded-lg bg-grey-1' />}
                        <span className='text-xs font-bold text-grey-1'>{moment(new Date(post.Date || new Date())).fromNow()}</span>
                    </Row>
                </Col>
            </Row>

            <Row className='w-[100%] items-center my-2 gap-2'>
                <Col className='px-3.5 py-1 bg-blue-3 rounded-md'>
                    <span className='text-xs font-bold text-blue-1'>{post.Category}</span>
                </Col>
                {post?.FinancialData?.Sell != null && <Row className={clsx({ "bg-green-2": !post?.FinancialData?.Sell, "bg-red-2": post?.FinancialData?.Sell }, 'px-3.5 py-1 rounded-md items-center gap-1')}>
                    {icon}
                    <span className={clsx({ "text-green-1": !post?.FinancialData?.Sell, "text-red-1": post?.FinancialData?.Sell }, 'text-xs font-bold')}>{!post?.FinancialData?.Sell ? t('buy') : t('sell')}</span>
                </Row>}
            </Row >
            <p className='my-2 font-medium text-sm'>
                {post.Text?.slice(0, post.Text.length > 140 ? 120 : post.Text.length)} {post?.Text?.length ? post?.Text?.length > 140 && "..." : ''}
                {post?.Text?.length ? post?.Text?.length > 140 && <span className='text-blue-1 underline'> {t('readMore')}</span> : ''}
            </p>

            {post?.Audio && <AudioDisplay />}


            {
                postMediaList?.length > 0 &&
                <Col className={clsx(styles.grid, "my-2")}>
                    {postMediaList?.slice(0, 5)?.map(((element: any, i: number) => {
                        if (i === (5 - 1) && (postMediaList?.length ?? 0) > 5) {
                            return (
                                <Col className={styles['image-container']} key={i}>
                                    <Col className={clsx(styles['image-overlay'], 'items-center justify-center')}>
                                        <h2 className='text-base font-bold text-white'>+{postMediaList.length - 5}</h2>
                                    </Col>
                                    {element}
                                </Col>
                            )
                        } else {
                            return (
                                <Col className={styles['image-container']} key={i}>
                                    {element}
                                </Col>
                            )
                        }
                    }))}
                </Col>
            }

            {
                post?.FinancialData && <Row className='w-full min-h-[60px] bg-grey-7 rounded-md px-4 py-2 justify-between items-center my-2'>
                    <Row className='gap-2 items-center'>
                        <Image src={logoURL} alt='test' width={36} height={36} className='max-h-[36px]' />
                        <Col className='gap-1'>
                            <span className='text-white text-sm font-bold'>{post.FinancialData.Instrument?.MarketItem?.Symbol}/{post.FinancialData.Instrument?.MarketItem?.To}</span>
                            <span className='text-white text-sm font-bold'>${formatNumber(post.FinancialData.PriceEvaluations?.[0].Price || 0)}</span>
                        </Col>
                    </Row>

                    <Row className='items-center gap-4'>
                        <Col className='gap-1'>
                            {post?.FinancialData?.Sell != null && <Row className={clsx({ "bg-green-2": !post?.FinancialData?.Sell, "bg-red-2": post?.FinancialData?.Sell }, 'px-3.5 py-1 rounded-md items-center gap-1')}>
                                {icon}
                                <span className={clsx({ "text-green-1": !post?.FinancialData?.Sell, "text-red-1": post?.FinancialData?.Sell }, 'text-xs font-bold')}>{!post?.FinancialData?.Sell ? t('buy') : t('sell')}</span>
                            </Row>}
                            {post.FinancialData.EntryValue && <span className='text-white text-sm font-bold'>{t('entry')} {formatNumber(post.FinancialData.EntryValue)}</span>}
                        </Col>
                        <PlayIcon className='w-3 h-3 stroke-current rotate-90' />
                    </Row>
                </Row>
            }

            {
                post?.AwardsCount &&
                <>
                    <Row className='gap-4 my-2'>
                        {Object.keys(post.AwardsCount).map(e => {
                            return (
                                <Row key={e} className='gap-2 items-center'>
                                    <Image src={awardsImages[e]} alt='award' width={20} height={20} />
                                    <span className='text-white font-bold text-sm'>{shortNumberFormat(post.AwardsCount?.[e]) || ''}</span>
                                </Row>
                            );
                        })}
                    </Row>
                    <hr className='border-grey-1' />
                </>
            }

            {
                <Row className='justify-evenly items-center my-2'>
                    <Row className='items-center gap-2'>
                        <LikeIcon />
                        <span>{shortNumberFormat(post.ReactionCounts?.Likes || 0)}</span>
                    </Row>
                    <Row className='items-center gap-2'>
                        <CommentsIcon />

                        <span>{shortNumberFormat(post.CommentsCount || 0)}</span>
                    </Row>
                    <Row className='items-center gap-2'>
                        <ShareIcon />
                        <span>{shortNumberFormat(post.SharesCount || 0)}</span>
                    </Row>
                    <Row className='items-center gap-2'>
                        <AwardIcon />

                        <span>{shortNumberFormat(awardCount || 0)}</span>
                    </Row>
                </Row>
            }

        </a>
    );
};