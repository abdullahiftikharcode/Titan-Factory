import React, { useState } from 'react';

function AddPayroll({ token }) {
  const [basicSalary, setBasicSalary] = useState('');
  const [overtimeHours, setOvertimeHours] = useState('');
  const [overtimeRate, setOvertimeRate] = useState('');
  const [bonuses, setBonuses] = useState('');
  const [deductions, setDeductions] = useState('');
  const [tax, setTax] = useState('');
  const [netSalary, setNetSalary] = useState(0); // Initialize with 0
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const paymentMethods = ['bank_transfer', 'cash', 'check'];
  const paymentStatuses = ['pending', 'completed', 'failed'];

  // Calculate net salary based on the provided values
  const calculateNetSalary = () => {
    const calculatedNetSalary = (
      parseFloat(basicSalary || 0) + 
      (parseFloat(overtimeHours || 0) * parseFloat(overtimeRate || 0)) + 
      parseFloat(bonuses || 0) - 
      parseFloat(deductions || 0) - 
      parseFloat(tax || 0)
    );
    setNetSalary(calculatedNetSalary); // Set the calculated net salary in the state
    return calculatedNetSalary;
  };

  // Handle payroll addition
  const handleAddPayroll = async (e) => {
    e.preventDefault();
    const calculatedNetSalary = calculateNetSalary(); // Ensure net salary is calculated and set

    try {
      const response = await fetch('http://localhost:3001/add-payroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          basic_salary: basicSalary,
          overtime_hours: overtimeHours,
          overtime_rate: overtimeRate,
          bonuses: bonuses,
          deductions: deductions,
          tax: tax,
          net_salary: calculatedNetSalary, // Include the calculated net salary
          bank_account_number: bankAccountNumber,
          payment_method: paymentMethod,
          payment_status: paymentStatus,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Payroll added successfully');
        setBasicSalary('');
        setOvertimeHours('');
        setOvertimeRate('');
        setBonuses('');
        setDeductions('');
        setTax('');
        setNetSalary(0); // Reset net salary after submission
        setBankAccountNumber('');
        setPaymentMethod('');
        setPaymentStatus('');
      } else {
        alert(`Failed to add payroll: ${data.error}`); // Fixed syntax error here
      }
    } catch (error) {
      console.error('Error adding payroll:', error);
      alert('An error occurred while adding payroll.');
    }
  };

  return (
    <div>
      <h1>Add Payroll</h1>
      <form onSubmit={handleAddPayroll}>
        <div>
          <label>Basic Salary:</label>
          <input
            type="number"
            value={basicSalary}
            onChange={(e) => setBasicSalary(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Overtime Hours:</label>
          <input
            type="number"
            value={overtimeHours}
            onChange={(e) => setOvertimeHours(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Overtime Rate:</label>
          <input
            type="number"
            value={overtimeRate}
            onChange={(e) => setOvertimeRate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Bonuses:</label>
          <input
            type="number"
            value={bonuses}
            onChange={(e) => setBonuses(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Deductions:</label>
          <input
            type="number"
            value={deductions}
            onChange={(e) => setDeductions(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tax:</label>
          <input
            type="number"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Bank Account Number:</label>
          <input
            type="text"
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="">Select Payment Method</option>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Payment Status:</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            required
          >
            <option value="">Select Payment Status</option>
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Payroll</button>
      </form>
    </div>
  );
}

export default AddPayroll;
