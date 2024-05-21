import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './PendingList.css'; // Make sure to import your CSS file
import { useNavigate } from 'react-router-dom';

const loanUrl = "http://localhost:8000/loan";

function PendingList() {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [pendingItems, setPendingItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const fetchPendingItems = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${loanUrl}?search=${encodeURIComponent(searchQuery)}`);
            setPendingItems(response.data);
        } catch (error) {
            console.error('Error fetching pending items:', error);
            setError('An error occurred while fetching data.');
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchPendingItems();
    };

    useEffect(() => {
        fetchPendingItems();
    }, [fetchPendingItems]);

    const getStatus = (dueDate, amount, interest) => {
        const currentDate = new Date();
        const dueDateObj = new Date(dueDate);
        if (amount <= 0) {
            return "Completed";
        } else if (dueDateObj > currentDate) {
            return "Pending";
        } else {
            const overdueDays = Math.floor((currentDate - dueDateObj) / (1000 * 60 * 60 * 24));
            const doubledInterest = interest * 2 * overdueDays;
            return `Overdue - Interest: ${doubledInterest}`;
        }
    };

    const handleRepayment = async (itemId, status, firstName, lastName, amount, interest) => {
        try {
            if (status === "Completed") {
                await axios.post('http://localhost:8000/completed', { loanId: itemId, firstName, lastName, amount, interest });
            } else {
                const repaymentData = {
                    loanId: itemId,
                    firstName: firstName,
                    lastName: lastName,
                    amount: amount,
                    interest: interest,
                    repaymentDate: new Date().toISOString()
                };
                await axios.post('http://localhost:8000/repayment', repaymentData);
            }

            fetchPendingItems();
            navigate(`/homepage/pending/repayment/${itemId}`, { state: { loanId: itemId } });
        } catch (error) {
            console.error('Error repaying loan:', error);
            setError('An error occurred while repaying the loan.');
        }
    };

    const filteredItems = pendingItems.filter(item => getStatus(item.due_date, item.loan_amount, item.interest) !== "Completed");

    return (
        <div className="application template d-flex justify-content-center w-100 vh-100">
            <div className="form_container p-5 rounded bg-white">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <h1 className='d-flex justify-content-center align-items-center mb-5'>PENDING</h1>
                    <div className="d-flex justify-content-center align-items-center mb-5" role="search">
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Ex.John Doe"
                            aria-label="Search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <button className="btn btn-outline-success" type="submit" disabled={loading}>
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>
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
                                    <th>Repayment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item) => {
                                    const status = getStatus(item.due_date, item.loan_amount, item.interest);
                                    const interestDisplay = status.includes("Overdue") ? status.split(" - ")[1] : item.interest;
                                    return (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.first_name}</td>
                                            <td>{item.last_name}</td>
                                            <td>{item.loan_amount}</td>
                                            <td>{interestDisplay}</td>
                                            <td>{item.due_date}</td>
                                            <td className={status === "Pending" ? "red-text" : ""}>
                                                {status}
                                            </td>
                                            <td>
                                                {status === "Pending" && (
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => handleRepayment(item.id, status, item.first_name, item.last_name)}
                                                    >
                                                        Repay
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="d-flex justify-content-center mt-5">
                    <button className="btn btn-secondary" onClick={() => navigate('/homepage/transaction')}>
                        View Transaction History
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PendingList;
