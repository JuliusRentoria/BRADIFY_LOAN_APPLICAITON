import React, { createContext, useContext, useState } from 'react';

const LoanDataContext = createContext();

export const LoanDataProvider = ({ children }) => {
    const [loanData, setLoanData] = useState(null);

    return (
        <LoanDataContext.Provider value={{ loanData, setLoanData }}>
            {children}
        </LoanDataContext.Provider>
    );
};

export const useLoanData = () => useContext(LoanDataContext);
