import moment from 'moment'
import React from 'react'
import { LuSquareArrowRight } from 'react-icons/lu'
import TransactionInfoCard from '..//Cards/TransactionInfoCard'
const ExpenseTransactions = ({transactions, onSeeMore}) => {
  return (

    <div className="card">
      <div className="flex items center justify-between ">
        <h5 className="text-lg">Expence</h5>
        <button className="card-btn" onClick={onSeeMore}>
          See All <LuSquareArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">


        {
          
            transactions?.slice(0, 5)?.map((expense) => (
              <TransactionInfoCard
                key={expense._id}
                title={expense.category}
                icon={expense.icon}
                date={moment(expense.date).format("Do MMMM YYYY")}
                amount={expense.amount}
                type="expense"
                hideDeleteBtn
              />
            ))
          
        }

        {/* {
          Array.isArray(transactions) && transactions.length === 0 ? (
            <p className="text-center text-gray-500">No expenses found</p>
          ) : Array.isArray(transactions) ? (
            transactions.slice(0, 5).map((expense) => (
              <TransactionInfoCard
                key={expense._id}
                title={expense.category}
                icon={expense.icon}
                date={moment(expense.date).format("Do MMMM YYYY")}
                amount={expense.amount}
                type="expense"
                hideDeleteBtn
              />
            ))
          ) : (
            <p className="text-center text-red-500">Invalid transactions data</p>
          )
        } */}


      </div>
    </div>
  )
}

export default ExpenseTransactions
