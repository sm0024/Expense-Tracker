import React, { createElement, useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/UseUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import toast from 'react-hot-toast';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import Modal from '../../components/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';

const Expense = () => {
  UseUserAuth();
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  //get all expense details
  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const responce = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );
      if (responce.data) {
        setExpenseData(responce.data);
      } else if (Array.isArray(responce.data)) {
        setIncomeData(responce.data);
      }
    }
    catch (error) {
      console.log("something went wrong. Please try again", error);
    }
    finally {
      setLoading(false);
    }
  };

  //handle add expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;
    if (!category.trim()) {
      toast.error("category is required")
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("amount should be valid Number and greater than 0");
      return
    }
    if (!date) {
      toast.error("Date is required");
      return
    }

    //api call to add expense
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });
      setOpenAddExpenseModal(false)
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "error adding Expense:",
        error.responce?.data?.message || error.message
      );
    }
  }
  

  //delete expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id))
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense deleted successfully");
      fetchExpenseDetails();
    }
    catch (error) {
      console.error("error deleting expense:", error.responce?.data?.message || error.message);
    }
  };


  //handle download expense
  const handleDownloadExpenseDetails = async () => {
    try{
      const response= await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        {
          responseType:"blob",
        }
      );

      // create url for the blob
      const url=window.URL.createObjectURL(new Blob([response.data]))
       const link=document.createElement("a")
       link.href =url
       link.setAttribute("download", "expense_details.xlsx")
       document.body.appendChild(link)
       link.click()
       link.parentNode.removeChild(link)
       window.URL.revokeObjectURL(url)
    }
    catch(error){
      console.error("Error downloading expense details: ",error)
      toast.error("Failed to download expense details. Please try again")
    }
   };

  useEffect(() => {
    fetchExpenseDetails();
    return () => { }
  }, []);
  return (
    <DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
        <div className="grid grid-cols-1 gap-6">
          <div className="d">
            <ExpenseOverview
              transcations={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transcations={expenseData}
            onDelete={(id) => {
              
              setOpenDeleteAlert({ show: true, data: id })
            }}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>
        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>
         <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this Expense details?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Expense
