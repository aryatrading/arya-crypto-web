import React from 'react'
import { Col } from '../../../../shared/layout/flex'
import SmartAllocationRebalancing from './SmartAllocationRebalancing/SmartAllocationRebalancing'
import SmartAllocationExitStrategy from './SmartAllocationExitStrategy/SmartAllocationExitStrategy'
const SmartAllocationAutomation = () => {
  return (
    <Col className='gap-7'>
        <SmartAllocationRebalancing/>
        <hr className='border-grey-5 border'></hr>
        <SmartAllocationExitStrategy/>
    </Col>
  )
}

export default SmartAllocationAutomation