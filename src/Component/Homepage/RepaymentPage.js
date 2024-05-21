import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './RepaymentPage.css'; // Import your CSS file

function RepaymentPage() {
    const { id } = useParams(); // Retrieve loan ID from URL parameters
    const [loanData, setLoanData] = useState(null);
    const [repaymentAmount, setRepaymentAmount] = useState(''); // State for the repayment amount
    const [loading, setLoading] = useState(false); // State for loading

    useEffect(() => {
        const fetchLoanData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/loan/${id}`);
                setLoanData(response.data);
            } catch (error) {
                console.error('Error fetching loan data:', error);
            }
        };

        fetchLoanData();
    }, [id]);

    const handleRepaymentChange = (e) => {
        setRepaymentAmount(e.target.value);
    };

    const handleRepayment = async (e) => {
        e.preventDefault();
        const repayment = parseFloat(repaymentAmount);
        if (!isNaN(repayment) && repayment > 0 && loanData) {
            const newLoanAmount = loanData.loan_amount - repayment;
            const newInterest = newLoanAmount * 0.1; // Interest is 10% of the remaining loan amount
            const updatedLoanData = { 
                ...loanData, 
                loan_amount: newLoanAmount,
                interest: newInterest 
            };
            setLoading(true);
            try {
                // Update the entire loan object in the backend
                await axios.put(`http://localhost:8000/loan/${id}`, updatedLoanData);
                // Update the loan data in the state
                setLoanData(updatedLoanData);
                alert('Repayment successful!');
            } catch (error) {
                console.error('Error updating loan amount:', error);
                alert('Failed to process repayment.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="repayment-container d-flex justify-content-center align-items-center vh-100">
            <div className="repayment-form p-5 rounded bg-white">
                <h1 className="text-center mb-5">Repayment Page</h1>
                {loanData ? (
                    <form onSubmit={handleRepayment}>
                        <div className="mb-3">
                            <label htmlFor="loanId" className="form-label">Loan ID</label>
                            <input type="text" className="form-control" id="loanId" value={loanData.id} readOnly />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input type="text" className="form-control" id="firstName" value={loanData.first_name} readOnly />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input type="text" className="form-control" id="lastName" value={loanData.last_name} readOnly />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="amount" className="form-label">Amount</label>
                            <input type="text" className="form-control" id="amount" value={loanData.loan_amount} readOnly />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="interest" className="form-label">Interest</label>
                            <input type="text" className="form-control" id="interest" value={loanData.interest} readOnly />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="dueDate" className="form-label">Due Date</label>
                            <input type="text" className="form-control" id="dueDate" value={loanData.due_date} readOnly />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="repaymentAmount" className="form-label">Repayment Amount:</label>
                            <input type="text" className="form-control" id="repaymentAmount" value={repaymentAmount} onChange={handleRepaymentChange}/>
                        </div>
                        <div className="col-md-6 mt-4">
                            <button className="btn btn-secondary w-100" type="submit" disabled={loading}>
                                {loading ? 'Processing...' : 'Add Repayment'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}

export default RepaymentPage;
