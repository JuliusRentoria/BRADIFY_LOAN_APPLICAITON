import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './App.css';
import { Route, Routes } from "react-router-dom";
import Register from './Component/Login/Register';
import Login from './Component/Login/Login';
import Forgot from './Component/Login/Forgot';
import LoanApplication from './Component/Homepage/LoanApplication';
import LoanForm from './Component/Homepage/LoanForm';
import Transaction from './Component/Homepage/TransactionHistory';
import Pending from './Component/Homepage/PendingList';
import Homepage from './Component/Homepage/Homepage';
import { LoanDataProvider } from './Component/Homepage/LoanDataContext';
import Nav from './Component/Homepage/Nav';
import RepaymentPage from './Component/Homepage/RepaymentPage';

function App() {
  return (
    <LoanDataProvider>
      <Nav/>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/forgot" element={<Forgot />} />
        <Route exact path="/homepage" element={<Homepage />} />
        <Route exact path="/homepage/application" element={<LoanApplication />} />
        <Route exact path="/homepage/loan" element={<LoanForm />} />
        <Route exact path="/homepage/transaction" element={<Transaction />} />
        <Route exact path="/homepage/pending" element={<Pending />} />
        <Route exact path="/homepage/pending/repayment/:id" element={<RepaymentPage />} />
      </Routes>
    </LoanDataProvider>
  );
}

export default App;
