import React, { useState, useEffect } from 'react';
import axios from 'axios';

const completedLoanUrl = "http://localhost:8000/completed";
const repaymentUrl = "http://localhost:8000/repayment";

function TransactionHistory() {
    const [completedItems, setCompletedItems] = useState([]);
    const [repaymentData, setRepaymentData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompletedItems = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(completedLoanUrl);
                console.log('Completed items:', response.data); // Debug log
                setCompletedItems(response.data);
            } catch (error) {
                console.error('Error fetching completed items:', error);
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        const fetchRepaymentData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(repaymentUrl);
                console.log('Repayment data:', response.data); // Debug log
                setRepaymentData(response.data);
            } catch (error) {
                console.error('Error fetching repayment data:', error);
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchCompletedItems();
        fetchRepaymentData();
    }, []);

    return (
        <div className="application template d-flex justify-content-center w-100 vh-100">
            <div className="form_container p-5 rounded bg-white">
                <h1 className='d-flex justify-content-center align-items-center mb-5'>TRANSACTION HISTORY</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Amount</th>
                                    <th>Interest</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {repaymentData.reverse().map((repayment) => (
                                    <tr key={repayment.id}>
                                        <td>{repayment.loanId}</td>
                                        <td>{repayment.firstName}</td>
                                        <td>{repayment.lastName}</td>
                                        <td>{repayment.amount}</td>
                                        <td>{repayment.interest}</td>
                                        <td>{repayment.repaymentDate}</td>
                                        <td>Repaid</td>
                                    </tr>
                                ))}
                                {completedItems.reverse().map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.first_name}</td>
                                        <td>{item.last_name}</td>
                                        <td>{item.loan_amount}</td>
                                        <td>{item.interest}</td>
                                        <td>{item.due_date}</td>
                                        <td>Completed</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TransactionHistory;
