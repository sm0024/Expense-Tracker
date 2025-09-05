import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import TranscationInfoCard from '../Cards/TransactionInfoCard'
import moment from 'moment'

const RecentIncome = ({transactions,onSeeMore}) => {
  return (
    <div className="card">
        <div className="flex items-center justify-between">
            <h5 className="text-lg">Income</h5>
            <button onClick={onSeeMore} className="card-btn">See All<LuArrowRight className="text-base"/></button>
        </div>
        <div className="mt-6">
            {transactions?.slice(0,5).map((item)=>(
                <TranscationInfoCard
                key={item._id}
                title={item.source}
                icon={item.icon}
                date={moment(item.date).format("Do MMMM YYYY")}
                amount={item.amount}
                type="income"
                hideDeleteBtn  
                />
            ))}
        </div>
    </div>
  )
}

export default RecentIncome
