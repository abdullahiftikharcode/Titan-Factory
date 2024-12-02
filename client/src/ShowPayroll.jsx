// import React, { useEffect, useState } from 'react';

// const ShowPayroll = ({ token }) => {
//     const [payrollData, setPayrollData] = useState([]);
//     const [message, setMessage] = useState('');

//     useEffect(() => {
//         const fetchPayrollData = async () => {
//             try {
//                 const response = await fetch('http://localhost:3001/payroll', {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                     },
//                 });

//                 const data = await response.json();
//                 if (response.ok) {
//                     setPayrollData(data);
//                 } else {
//                     setMessage(data.error || 'Failed to fetch payroll data.');
//                 }
//             } catch (error) {
//                 setMessage('Error fetching payroll data: ' + error.message);
//             }
//         };

//         fetchPayrollData();
//     }, [token]);

//     return (
//         <div style={styles.container}>
//             <h2>Payroll Information</h2>
//             {message && <p style={styles.message}>{message}</p>}

//             {payrollData.length > 0 ? (
//                 <table style={styles.table}>
//                     <thead>
//                         <tr>
//                             <th>Payroll ID</th>
//                             <th>Basic Salary</th>
//                             <th>Overtime Hours</th>
//                             <th>Overtime Rate</th>
//                             <th>Bonuses</th>
//                             <th>Deductions</th>
//                             <th>Tax</th>
//                             <th>Net Salary</th>
//                             <th>Payment Date</th>
//                             <th>Payment Method</th>
//                             <th>Payment Status</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {payrollData.map((payroll) => (
//                             <tr key={payroll.payroll_id}>
//                                 <td>{payroll.payroll_id}</td>
//                                 <td>{Number(payroll.basic_salary).toFixed(2)}</td>
//                                 <td>{payroll.overtime_hours}</td>
//                                 <td>{Number(payroll.overtime_rate).toFixed(2)}</td>
//                                 <td>{Number(payroll.bonuses).toFixed(2)}</td>
//                                 <td>{Number(payroll.deductions).toFixed(2)}</td>
//                                 <td>{Number(payroll.tax).toFixed(2)}</td>
//                                 <td>{Number(payroll.net_salary).toFixed(2)}</td>
//                                 <td>{new Date(payroll.payment_date).toLocaleDateString()}</td>
//                                 <td>{payroll.payment_method}</td>
//                                 <td>{payroll.payment_status}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             ) : (
//                 !message && <p>No payroll data available.</p>
//             )}
//         </div>
//     );
// };

// const styles = {
//     container: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
//     message: { color: '#d9534f' },
//     table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
//     th: { border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontWeight: 'bold' },
//     td: { border: '1px solid #ddd', padding: '8px', textAlign: 'center' },
// };

// export default ShowPayroll;


import React, { useEffect, useState } from 'react';
import './ShowPayroll.css';  // Import the CSS file

const ShowPayroll = ({ token }) => {
    const [payrollData, setPayrollData] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchPayrollData = async () => {
            try {
                const response = await fetch('http://localhost:3001/payroll', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setPayrollData(data);
                } else {
                    setMessage(data.error || 'Failed to fetch payroll data.');
                }
            } catch (error) {
                setMessage('Error fetching payroll data: ' + error.message);
            }
        };

        fetchPayrollData();
    }, [token]);

    return (
        <div className="show-payroll-container">
            <h2>Payroll Information</h2>
            {message && <p className="show-payroll-message">{message}</p>}

            {payrollData.length > 0 ? (
                <table className="show-payroll-table">
                    <thead>
                        <tr>
                            <th>Payroll ID</th>
                            <th>Basic Salary</th>
                            <th>Overtime Hours</th>
                            <th>Overtime Rate</th>
                            <th>Bonuses</th>
                            <th>Deductions</th>
                            <th>Tax</th>
                            <th>Net Salary</th>
                            <th>Payment Date</th>
                            <th>Payment Method</th>
                            <th>Payment Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payrollData.map((payroll) => (
                            <tr key={payroll.payroll_id}>
                                <td>{payroll.payroll_id}</td>
                                <td>{Number(payroll.basic_salary).toFixed(2)}</td>
                                <td>{payroll.overtime_hours}</td>
                                <td>{Number(payroll.overtime_rate).toFixed(2)}</td>
                                <td>{Number(payroll.bonuses).toFixed(2)}</td>
                                <td>{Number(payroll.deductions).toFixed(2)}</td>
                                <td>{Number(payroll.tax).toFixed(2)}</td>
                                <td>{Number(payroll.net_salary).toFixed(2)}</td>
                                <td>{new Date(payroll.payment_date).toLocaleDateString()}</td>
                                <td>{payroll.payment_method}</td>
                                <td>{payroll.payment_status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !message && <p className="show-payroll-no-data">No payroll data available.</p>
            )}
        </div>
    );
};

export default ShowPayroll;
