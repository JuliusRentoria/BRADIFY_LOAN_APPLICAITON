import React, { useState, useEffect } from 'react';
import { useLoanData } from './LoanDataContext';

function LoanForm() {
    const { loanData, setLoanData } = useLoanData(); // Destructure setLoanData to update the context state
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        middle_initial: '',
        address: '',
        contact: '',
        credit_score: ''
    });
    const [loanAmount, setLoanAmount] = useState('');
    const [interest, setInterest] = useState('');
    const [dueDate, setDueDate] = useState('');

    // Update formData state if loanData changes
    useEffect(() => {
        if (loanData) {
            setFormData(loanData);
        }
    }, [loanData]);

    // Function to calculate interest based on the loan amount
    const calculateInterest = (amount) => {
        return amount * 0.1; // The interest is 10% of the loan amount
    };

    // Function to handle loan amount change
    const handleLoanAmountChange = (e) => {
        const amount = e.target.value;
        setLoanAmount(amount);
        const calculatedInterest = calculateInterest(amount);
        setInterest(calculatedInterest.toFixed(2)); // Round to 2 decimal places
    };

    const fetchData = async (name) => {
        try {
            const response = await fetch(`http://localhost:8000/application/?name=${name}`);
            if (!response.ok) {
                throw new Error("Could not fetch resource");
            }
            const data = await response.json();
            if (data) {
                const { first_name, last_name, middle_initial, address, contact, credit_score } = data;
                const newFormData = {
                    first_name: first_name || '',
                    last_name: last_name || '',
                    middle_initial: middle_initial || '',
                    address: address || '',
                    contact: contact || '',
                    credit_score: credit_score || ''
                };
                setFormData(newFormData);
                setLoanData(newFormData); // Update the context state
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value.toUpperCase();
        fetchData(name);
    };

    return (
        <div className="application template d-flex justify-content-center 100-w vh-100 ">
            <div className="form_container p-5 rounded bg-white " style={{ maxWidth: "800px" }}>
                <form className="row g-3" onSubmit={handleSubmit}>
                    <h1 className='d-flex justify-content-center align-items-center mb-5'>Loan Form</h1>
                    <div className="d-flex justify-content-center align-items-center mb-5" role="search">
                        <input className="form-control me-2" id="name" type="search" placeholder="Ex. John Doe" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </div>
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
                        <input type="text" className="form-control" value={formData.credit_score} readOnly />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="inputLoanAmount" className="form-label">Loan Amount</label>
                        <input type="number" className="form-control" value={loanAmount} onChange={handleLoanAmountChange} />
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
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoanForm;
