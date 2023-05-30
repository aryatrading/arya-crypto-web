import React, { useEffect, useMemo, useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip
  } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getAssetSparkLineData } from '../../../../services/controllers/asset';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
  );

  export const options = {
    events: [],
      borderColor: '#22C55E',
      borderWidth: 1,
      responsive: true,
      pointStyle:false,
      tooltips: {
        display: false
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
        }
      },
      
    };
  
  

interface IAssetSparkLine {
    symbol:string
}

const AssetSparkLine = ({symbol}:IAssetSparkLine) => {
    const [sparkLineGraphData, setSparkLineGraphData] = useState([])
    useEffect(()=>{
        getAssetSparkLineData(symbol).then((response:any)=>{
            const {data} = response
            const{values} = data
            const sparkLineData = values?values.map((value:any)=>value.open).reverse():[]
            setSparkLineGraphData(sparkLineData)
        })
    },[symbol])

    const labels = useMemo(()=>{
        return new Array(7).fill(0)
    },[])

    const data = useMemo(() =>
    {
        return ({
            labels,
            datasets: [
              {
                label: 'Dataset 1',
                data: sparkLineGraphData,
              }
            ],
        })
    }
    , [labels, sparkLineGraphData])
    
    
  return (
    <div className='w-[125px] md:w-[172px]'>
        <Line options={options} data={data} />
    </div>
  )
}

export default AssetSparkLine