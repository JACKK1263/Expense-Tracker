import React, { useEffect, useState } from 'react'
import Cards from '../components/Cards';
import Header from '../components/Header';
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import moment from "moment";
import TransactionsTable from '../components/TransactionsTable';
/* import ChartComponent from '../components/Charts'; */
import NoTransactions from '../components/NoTransactions'; 
import ExpenseCharts from '../components/Charts';

function Dashborad() {
  /* const transactions= [
     {
       type :"income",
       amount: 1200,
       tag: "salary",
       name : "income 1",
       date: "2023-05-23",
     },
     {
       type :"income",
       amount: 300,
       tag: "food",
       name : "expense 1",
       date: "2023-05-26",
     },
   ]; */
  const [transactions, setTransactions] = useState([]);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    if (!values.date) {
      toast.error("Please select a date!");
      return;
    }
  
    const formattedDate = values.date?.format
      ? values.date.format("YYYY-MM-DD")
      : moment(values.date).format("YYYY-MM-DD");
  
    const newTransaction = {
      type,
      date: formattedDate,
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
  
    addTransaction(newTransaction);
  };
  
  
  

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if (!many) toast.success("Transaction Added!");
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) toast.error("Couldn't add transaction");
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setCurrentBalance(incomeTotal - expensesTotal);
  };

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

 /* let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  }) */
  return (
    <div>
      <Header />
      {loading ? (<p>loading...</p>) : (<>
        <Cards
          currentBalance={currentBalance}
          income={income}
          expenses={expenses}
          showExpenseModal={showExpenseModal}
          showIncomeModal={showIncomeModal}
        /*  handleExpenseCancel={handleExpenseCancel}
          handleIncomeCancel ={handleIncomeCancel } */
        />

{transactions.length === 0 ? <NoTransactions /> : <ExpenseCharts transactions={transactions} />}

        <AddExpenseModal
          isExpenseModalVisible={isExpenseModalVisible}
          handleExpenseCancel={handleExpenseCancel}
          onFinish={onFinish}
        />
        <AddIncomeModal
          isIncomeModalVisible={isIncomeModalVisible}
          handleIncomeCancel={handleIncomeCancel}
          onFinish={onFinish}
        />
        <TransactionsTable transactions={transactions}
          fetchTransactions={fetchTransactions}
          addTransaction={addTransaction}>
        </TransactionsTable>
      </>)}
    </div>
  )
}

export default Dashborad