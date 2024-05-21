import React, { useState, useEffect } from 'react';
import { useLoanData } from './LoanDataContext';
import axios from 'axios';
import './LoanForm.css'; // Assuming you have a LoanForm.css file
import { toast, ToastContainer } from 'react-toastify';

const Base_Url = 'http://localhost:8000/application'; // API EndPoint

function LoanForm() {
    const { loanData, setLoanData } = useLoanData(); // Destructure setLoanData to update the context state
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        middle_initial: '',
        address: '',
        contact: '',
        percentage: ''
    });
    const [loanAmount, setLoanAmount] = useState('');
    const [interest, setInterest] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loanError, setLoanError] = useState('');
    const [submissionError, setSubmissionError] = useState('');
    const [submissionSuccess, setSubmissionSuccess] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (loanData) {
            setFormData(loanData);
        }
    }, [loanData]);

    const calculateInterest = (amount) => {
        return amount * 0.1; // The interest is 10% of the loan amount
    };

    const handleLoanAmountChange = (e) => {
        const amount = e.target.value;
        const percentage = parseInt(formData.percentage);

        if ((percentage >= 0 && percentage <= 25 && amount > 1000) ||
            (percentage >= 26 && percentage <= 50 && amount > 5000) ||
            (percentage >= 51 && percentage <= 75 && amount > 10000) ||
            (percentage >= 76 && percentage <= 100 && amount > 20000)) {
            setLoanError(`Invalid loan amount for credit score ${percentage}.`);
            setLoanAmount('');
            setInterest('');
            return;
        }

        setLoanError('');
        setLoanAmount(amount);
        const calculatedInterest = calculateInterest(amount);
        setInterest(calculatedInterest.toFixed(2)); // Round to 2 decimal places
    };

    const fetchData = async (name = '') => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${Base_Url}/?name=${name}`);
            console.log("API Response:", response.data); // Log the API response
            setSearchResults(response.data);
        } catch (error) {
            setError("Could not fetch resource");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData(searchInput);
    };

    const handleInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleSelect = (item) => {
        const { first_name, last_name, middle_initial, address, contact, percentage } = item;
        const newFormData = {
            first_name: first_name || '',
            last_name: last_name || '',
            middle_initial: middle_initial || '',
            address: address || '',
            contact: contact || '',
            percentage: percentage || ''
        };
        setFormData(newFormData);
        setLoanData(newFormData); // Update the context state
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            loan_amount: loanAmount,
            interest,
            due_date: dueDate,
        };
        try {
            const response = await axios.post('http://localhost:8000/loan', submissionData);
            toast.success('Loan application submitted successfully!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setSubmissionError('');
            setFormData({
                first_name: '',
                last_name: '',
                middle_initial: '',
                address: '',
                contact: '',
                percentage: ''
            });
            setLoanAmount('');
            setInterest('');
            setDueDate('');
            console.log("Submission Response:", response.data);
        } catch (error) {
            setSubmissionError('Failed to submit loan application. Please try again.');
            setSubmissionSuccess('');
            console.error("Submission Error:", error);
        }
    };

    return (
        <div className="application template d-flex justify-content-center 100-w vh-100">
            <div className="form_container p-5 rounded bg-white" style={{ maxWidth: "800px" }}>
                <form className="row g-3" onSubmit={handleSearch}>
                    <h1 className='d-flex justify-content-center align-items-center mb-5'>Loan Form</h1>
                    <div className="d-flex justify-content-center align-items-center mb-5" role="search">
                        <input 
                            className="form-control me-2" 
                            type="search" 
                            placeholder="Ex. John Doe" 
                            aria-label="Search" 
                            value={searchInput} 
                            onChange={handleInputChange} 
                        />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </div>
                    {loading && <div>Loading...</div>}
                    {error && <div>Error: {error}</div>}
                    {searchResults.length > 0 && (
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Last Name</th>
                                        <th>First Name</th>
                                        <th>Middle Initial</th>
                                        <th>Address</th>
                                        <th>Contact</th>
                                        <th>Credit Score</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResults.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.last_name}</td>
                                            <td>{item.first_name}</td>
                                            <td>{item.middle_initial}</td>
                                            <td>{item.address}</td>
                                            <td>{item.contact}</td>
                                            <td>{item.percentage}</td>
                                            <td>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-primary" 
                                                    onClick={() => handleSelect(item)}
                                                >
                                                    Select
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="col-md-4">
                        <label htmlFor="inputFirstName" className="form-label">First Name</label>
                        <input type="text" className="form-control" value={formData.first_name} readOnly />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="inputLastName" className="form-label">Last Name</label>
                        <input type="text" className="form-control" value={formData.last_name} readOnly />
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="inputMiddleInitial" className="form-label">Middle Initial</label>
                        <input type="text" className="form-control" value={formData.middle_initial} readOnly />
                    </div>
                    <div className="col-10">
                        <label htmlFor="inputAddress" className="form-label">Address</label>
                        <input type="text" className="form-control" value={formData.address} readOnly />
                    </div>
                    <div className="col-5">
                        <label htmlFor="inputContactNumber" className="form-label">Contact Number</label>
                        <input type="text" className="form-control" value={formData.contact} readOnly />
                    </div>
                    <div className="col-5">
                        <label htmlFor="inputCreditScore" className="form-label">Credit Score</label>
                        <input type="text" className="form-control" value={formData.percentage} readOnly />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="inputLoanAmount" className="form-label">Loan Amount</label>
                        <input type="number" className="form-control" value={loanAmount} onChange={handleLoanAmountChange} />
                        {loanError && <div className="text-danger">{loanError}</div>}
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="inputInterest" className="form-label">Interest</label>
                        <input type="text" className="form-control" value={interest} readOnly />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="inputDueDate" className="form-label">Due date</label>
                        <input type="date" className="form-control" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                    <div className="col-3">
                        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                    </div>
                </form>
                {submissionError && <div className="text-danger">{submissionError}</div>}
                {submissionSuccess && <div className="text-success">{submissionSuccess}</div>}
            </div>
            <ToastContainer/>
        </div>
    );
}

export default LoanForm;
