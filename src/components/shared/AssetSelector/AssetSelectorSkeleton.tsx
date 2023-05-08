import React from 'react'
import { Col, Row } from '../layout/flex'

const AssetSelectorSkeleton = () => {
  return (
    <Col className='gap-4'>
        <Row className='w-full justify-between py-3 items-center bg-grey-3 px-2 animate-pulse rounded-md'>
            <Row className={("flex-1 items-center gap-6 justify-start")}>
                <div className="w-7 h-7 rounded-full bg-grey-1"></div>
                <Row className='gap-2 justify-start'>
                    <div className=" h-2 bg-grey-1 rounded w-12">
                    </div>
                    <div className="bg-grey-1 rounded h-2 w-8">
                    </div>
                </Row>
            </Row>
            <Row className="w-20 justify-center">
                <div className='bg-grey-1 gap-2 h-2 w-8 rounded'>

                </div>
            </Row>
        </Row>
        <Row className='w-full justify-between py-3 items-center bg-grey-3 px-2 animate-pulse rounded-md'>
            <Row className={("flex-1 items-center gap-6 justify-start")}>
                <div className="w-7 h-7 rounded-full bg-grey-1"></div>
                <Row className='gap-2 justify-start'>
                    <div className=" h-2 bg-grey-1 rounded w-12">
                    </div>
                    <div className="bg-grey-1 rounded h-2 w-8">
                    </div>
                </Row>
            </Row>
            <Row className="w-20 justify-center">
                <div className='bg-grey-1 gap-2 h-2 w-8 rounded'>

                </div>
            </Row>
        </Row>
        <Row className='w-full justify-between py-3 items-center bg-grey-3 px-2 animate-pulse rounded-md'>
            <Row className={("flex-1 items-center gap-6 justify-start")}>
                <div className="w-7 h-7 rounded-full bg-grey-1"></div>
                <Row className='gap-2 justify-start'>
                    <div className=" h-2 bg-grey-1 rounded w-12">
                    </div>
                    <div className="bg-grey-1 rounded h-2 w-8">
                    </div>
                </Row>
            </Row>
            <Row className="w-20 justify-center">
                <div className='bg-grey-1 gap-2 h-2 w-8 rounded'></div>
            </Row>
        </Row>
        <Row className='w-full justify-between py-3 items-center bg-grey-3 px-2 animate-pulse rounded-md'>
            <Row className={("flex-1 items-center gap-6 justify-start")}>
                <div className="w-7 h-7 rounded-full bg-grey-1"></div>
                <Row className='gap-2 justify-start'>
                    <div className=" h-2 bg-grey-1 rounded w-12">
                    </div>
                    <div className="bg-grey-1 rounded h-2 w-8">
                    </div>
                </Row>
            </Row>
            <Row className="w-20 justify-center">
                <div className='bg-grey-1 gap-2 h-2 w-8 rounded'></div>
            </Row>
        </Row>
        <Row className='w-full justify-between py-3 items-center bg-grey-3 px-2 animate-pulse rounded-md'>
            <Row className={("flex-1 items-center gap-6 justify-start")}>
                <div className="w-7 h-7 rounded-full bg-grey-1"></div>
                <Row className='gap-2 justify-start'>
                    <div className=" h-2 bg-grey-1 rounded w-12">
                    </div>
                    <div className="bg-grey-1 rounded h-2 w-8">
                    </div>
                </Row>
            </Row>
            <Row className="w-20 justify-center">
                <div className='bg-grey-1 gap-2 h-2 w-8 rounded'></div>
            </Row>
        </Row>
    </Col>
    
    
  )
}

export default AssetSelectorSkeleton