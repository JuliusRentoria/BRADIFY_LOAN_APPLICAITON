import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const url = "http://localhost:8000/application";

const initialState = {
    first_name: "",
    last_name: "",
    middle_initial: "",
    address: "",
    contact: "",
    age_value: "",
    age_label: "",
    income_value: "",
    income_label: "",
    status_value: "",
    status_label: "",
    tenure_value: "",
    tenure_label: ""
};

export default function LoanApplication() {
    const navigate = useNavigate();
    const [data, setData] = useState(initialState);

    const ageOptions = [
        { label: "Select Age", value: "" },
        { label: "18 to 30", value: "10" },
        { label: "31 to 50", value: "20" },
        { label: "50 and above", value: "10" }
    ];

    const incomeOptions = [
        { label: "Select Salary Income", value: "" },
        { label: "Less than 1,000", value: "10" },
        { label: "1,001 - 5,000", value: "20" },
        { label: "5,001 - 10,000", value: "30" },
        { label: "10,001 - 15,000", value: "40" },
        { label: "15,001 and above", value: "50" }
    ];

    const statusOptions = [
        { label: "Select Job Status", value: "" },
        { label: "Employed", value: "15" },
        { label: "Self-employed", value: "20" }
    ];

    const tenureOptions = [
        { label: "Select Job Tenure", value: "" },
        { label: "Less than 6 months", value: "6" },
        { label: "7 months to 1 year", value: "12" },
        { label: "2 years to 5 years", value: "18" },
        { label: "6 years to 10 years", value: "24" },
        { label: "10 years and above", value: "30" }
    ];

    function handle(e) {
        e.preventDefault();
        const { id, value } = e.target;

        if (id === 'age_value') {
            const selectedOption = ageOptions.find(option => option.value === value);
            setData({ ...data, age_value: value, age_label: selectedOption ? selectedOption.label : "" });
        } else if (id === 'income_value') {
            const selectedOption = incomeOptions.find(option => option.value === value);
            setData({ ...data, income_value: value, income_label: selectedOption ? selectedOption.label : "" });
        } else if (id === 'status_value') {
            const selectedOption = statusOptions.find(option => option.value === value);
            setData({ ...data, status_value: value, status_label: selectedOption ? selectedOption.label : "" });
        } else if (id === 'tenure_value') {
            const selectedOption = tenureOptions.find(option => option.value === value);
            setData({ ...data, tenure_value: value, tenure_label: selectedOption ? selectedOption.label : "" });
        } else {
            setData({ ...data, [id]: value });
        }
    }
    function submit(e) {
        e.preventDefault();

        const totalScore = 120;
        const currentScore = parseInt(data.age_value) + parseInt(data.status_value) + parseInt(data.tenure_value) + parseInt(data.income_value);
        const percentage = Math.floor((currentScore / totalScore) * 100);

        const uppercaseData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, typeof value === 'string' ? value.toUpperCase() : value])
        );
        const payload = { ...uppercaseData, percentage: percentage };

        axios.post(url, payload)
            .then(res => {
                console.log(res.data);
                toast.success('Recorded', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                // Reset all fields after submitting
                setData(initialState);

            })
            .catch(err => {
                console.error(err);
            });
    }

    function goBack() {
        navigate('/homepage');
    }

    return (
        <div className="application template d-flex justify-content-center vh-100">
            <div className="form_container p-4 rounded bg-white" style={{ maxWidth: "800px" }}>
                <form onSubmit={(e) => submit(e)} className="row g-3">
                    <h1 className='d-flex justify-content-center align-items-center mb-4'>Loan Application</h1>
                    <div className="col-md-6">
                        <label htmlFor="first_name" className="form-label">First Name</label>
                        <input onChange={handle} id='first_name' type="text" className="form-control" value={data.first_name} required />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="last_name" className="form-label">Last Name</label>
                        <input onChange={handle} id='last_name' type="text" className="form-control" value={data.last_name} required />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="middle_initial" className="form-label">Middle Initial</label>
                        <input onChange={handle} id='middle_initial' type="text" className="form-control" value={data.middle_initial} required />
                    </div>
                    <div className="col-8">
                        <label htmlFor="contact" className="form-label">Contact Number</label>
                        <input onChange={handle} id='contact' type="contact" className="form-control" placeholder="Ex.09155617727" value={data.contact} required />
                    </div>
                    <div className="col-12">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input onChange={handle} id='address' type="text" className="form-control" placeholder="1234 Main St" value={data.address} required />
                    </div>
                    <div className="col-6">
                        <label htmlFor="age_value" className="form-label">Age</label>
                        <select onChange={handle} id='age_value' className="form-control" value={data.age_value} required>
                            {ageOptions.map((option, index) => (
                                <option key={index} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        {data.age_value && <p>Age Value: {data.age_value}</p>}
                    </div>
                    <div className="col-6">
                        <label htmlFor="income_value" className="form-label">Salary Income</label>
                        <select onChange={handle} id='income_value' className="form-control" value={data.income_value} required>
                            {incomeOptions.map((option, index) => (
                                <option key={index} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        {data.income_value && <p>Income Value: {data.income_value}</p>}
                    </div>
                    <div className="col-6">
                        <label htmlFor="status_value" className="form-label">Job Status (employed or Self-employed)</label>
                        <select onChange={handle} id='status_value' className="form-control" value={data.status_value} required>
                            {statusOptions.map((option, index) => (
                                <option key={index} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        {data.status_value && <p>Status Value: {data.status_value}</p>}
                    </div>
                    <div className="col-6">
                        <label htmlFor="tenure_value" className="form-label">Job Tenure (months/months year/years in work)</label>
                        <select onChange={handle} id='tenure_value' className="form-control" value={data.tenure_value} required>
                            {tenureOptions.map((option, index) => (
                                <option key={index} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        {data.tenure_value && <p>Tenure Value: {data.tenure_value}</p>}
                    </div>
                    <div className="col-md-6 mt-4">
                        <button type="submit" className="btn btn-primary w-100">Submit</button>
                    </div>
                    <div className="col-md-6 mt-4">
                        <button onClick={goBack} className="btn btn-secondary w-100">Go Back</button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}
