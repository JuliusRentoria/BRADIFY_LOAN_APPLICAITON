import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const url = "http://localhost:8000/application";

function PendingList() {
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
          const response = await axios.get(`${url}?search=${encodeURIComponent(searchQuery)}`);
          setPendingItems(response.data);
          setLoading(false);
      } catch (error) {
          console.error('Error fetching pending items:', error);
          setError('An error occurred while fetching data.');
          setLoading(false);
      }
  }, [searchQuery]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchPendingItems();
    };

    useEffect(() => {
        const fetchAndSetPendingItems = async () => {
            if (searchQuery.trim() !== '') {
                await fetchPendingItems();
            } else {
                setPendingItems([]);
            }
        };

        fetchAndSetPendingItems();
    }, [searchQuery, fetchPendingItems]);

    return (
        <div className="application template d-flex justify-content-center 100-w vh-100">
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
                    <div>
                        {pendingItems.map((item) => (
                            <div key={item.id}>
                                {/* Render each pending item */}
                                {/* Example: <p>{item.name}</p> */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PendingList;
