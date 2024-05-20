import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Base_Url = 'http://localhost:8000/application'; // API EndPoint

export default function Homepage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get(Base_Url)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    };

    const handleSearch = () => {
        setLoading(true);
        axios.get(`${Base_Url}?search=${searchInput}`)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    };

    const filterData = (searchValue) => {
        return data.filter(item => {
            return (
                item.last_name.toLowerCase().includes(searchValue.toLowerCase()) ||
                item.first_name.toLowerCase().includes(searchValue.toLowerCase()) ||
                item.middle_initial.toLowerCase().includes(searchValue.toLowerCase()) ||
                item.address.toLowerCase().includes(searchValue.toLowerCase()) ||
                item.contact.includes(searchValue)
                // Add more fields as needed for searching
            );
        });
    };

    const handleInputChange = (e) => {
        setSearchInput(e.target.value);
        const filteredData = filterData(e.target.value);
        setData(filteredData);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center mb-5" role="search">
                <input
                    style={{ maxWidth: "500px" }}
                    className="form-control me-2"
                    id="name"
                    type="search"
                    placeholder="Ex. John Doe"
                    aria-label="Search"
                    value={searchInput}
                    onChange={handleInputChange}
                />
                <button className="btn btn-outline-success" type="submit" onClick={handleSearch}>Search</button>
            </div>
            <h1 className="d-flex justify-content-center align-items-center mb-5">Welcome to Homepage</h1>

            <div className="container">
                <h2>Submitted Applications</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Last Name</th>
                            <th>First Name</th>
                            <th>Middle Initial</th>
                            <th>Address</th>
                            <th>Contact</th>
                            <th>Age</th>
                            <th>Income</th>
                            <th>Status</th>
                            <th>Tenure</th>
                            <th><h4>Credit Score</h4></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.last_name}</td>
                                <td>{item.first_name}</td>
                                <td>{item.middle_initial}</td>
                                <td>{item.address}</td>
                                <td>{item.contact}</td>
                                <td>{item.age_label}</td>
                                <td>{item.income_label}</td>
                                <td>{item.status_label}</td>
                                <td>{item.tenure_label}</td>
                                <td><strong>{item.percentage}</strong></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
