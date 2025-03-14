import React, { useState } from 'react';
import './Form.css'; 
import useStore from '../store/useStore';
import AllocationForm from "./AllocationForm";


const Form = () => {
  const INFLATION = useStore((state) => state.INFLATION);
  const INITIAL_SALARY = useStore((state) => state.INITIAL_SALARY);
  const INITIAL_RECURRING_COST = useStore((state) => state.INITIAL_RECURRING_COST);
  // const INVESTMENT_APR = useStore((state) => state.INVESTMENT_APR);
  const INITIAL_SAVINGS = useStore((state) => state.INITIAL_SAVINGS);
  // const SALARY_INCREASE_RATE = useStore((state) => state.SALARY_INCREASE_RATE);
  const RECURRING_COST_INCREASE_RATE = useStore((state) => state.RECURRING_COST_INCREASE_RATE);
  const PROVINCE = useStore((state) => state.PROVINCE);
  const LOANS = useStore((state) => state.LOANS);
  const SUBMISSION = useStore((state) => state.SUBMISSION);
  // const ALLOCATION_INPUT_STATE = useStore((state) => state.ALLOCATION_INPUT_STATE);

  //Functions to manage the state
  const setProperty = useStore((state) => state.setProperty);
  const incrementSUBMISSION = useStore((state) => state.incrementSUBMISSION);
  const setAddNewLoanEntry = useStore((state) => state.setAddNewLoanEntry);
  const deleteLoanEntry = useStore((state) => state.deleteLoanEntry);
  const setLoanEntry = useStore((state) => state.setLoanEntry);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProperty(name, value);
  };
  
  const handleRunTest = () => {
    incrementSUBMISSION()
    console.log("Running test with SUBMISSION value: ",SUBMISSION);
  };

  const handleCancel = () => {
    // Add logic for the Run Test button
    console.log("Running test with values");
  };

  const removeLoanField = (id) => {
    deleteLoanEntry(id)
    console.log("removeLoanField: ",id);
  };

  const addLoanField = () => {
    setAddNewLoanEntry()
    console.log("addLoanField");
  };

  const handleLoanInputChange = (id, e) => {
    const { name, value } = e.target;
    setLoanEntry(id, name, value)
    console.log("handleLoanInputChange: ",id);
  };


  return (
    <form className="form-container">

      {/*Province */}
      <div className="form-group">
        <label>Province </label>
        <select
          name="PROVINCE"
          value={PROVINCE}
          onChange={handleInputChange}
        >
          <option value="BC">BC</option>
          <option value="AB">AB</option>
          <option value="SK">SK</option>
          <option value="MB">MB</option>
          <option value="ON">ON</option>
          <option value="QC">QC</option>
          <option value="NS">NS</option>
          <option value="NB">NB</option>
          <option value="PE">PE</option>
          <option value="NL">NL</option>
        </select>
      </div>

      {/*INFLATION*/}
      <div className="form-group">
        <label>Inflation (%)</label>
        <input
          type="number"
          name="INFLATION"
          value={INFLATION}
          onChange={handleInputChange}
        />
      </div>

    <hr className="h-1 bg-black border-none"/>

    {/*INITIAL SAVINGS*/}
    <div className="form-group">
        <label>Initial Savings ($)</label>
        <input
          type="number"
          name="INITIAL_SAVINGS"
          value={INITIAL_SAVINGS}
          onChange={handleInputChange}
        />
    </div>


    {/*INVESTMENT_ASSETS_ALLOCATIONS */}
    <div className="form-group">
      <label>Investment Assets Allocation</label>
      <div className="flex justify-center items-center pb-6">
        <AllocationForm />
      </div>
    </div>

    <hr className="h-1 bg-black border-none"/>

      {/*INITIAL_SALARY */}
      <div className="form-group">
        <label>Initial Salary ($)</label>
        <input
          type="number"
          name="INITIAL_SALARY"
          value={INITIAL_SALARY}
          onChange={handleInputChange}
        />
      </div>

      {/*SALARY_INCREASE_RATE */}
      {/* <div className="form-group">
        <label>Salary Increase Rate (%)</label>
        <input
          type="number"
          name="SALARY_INCREASE_RATE"
          value={SALARY_INCREASE_RATE}
          onChange={handleInputChange}
        />
      </div> */}

      <h/>

      <hr className="h-1 bg-black border-none"/>

      {/*INITIAL_RECURRING_COST */}
      <div className="form-group">
        <label>Initial Recurring Cost ($)</label>
        <input
          type="number"
          name="INITIAL_RECURRING_COST"
          value={INITIAL_RECURRING_COST}
          onChange={handleInputChange}
        />
      </div>

      {/*RECURRING_COST_INCREASE_RATE */}
      <div className="form-group">
        <label>Recurring Cost Increase Rate (%)</label>
        <input
          type="number"
          name="RECURRING_COST_INCREASE_RATE"
          value={RECURRING_COST_INCREASE_RATE}
          onChange={handleInputChange}
        />
      </div>
      
      <hr className="h-1 bg-black border-none"/>

      {/* Dynamically added loans */}
      {LOANS.map((loan, index) => (
        <div className="p-4 border rounded-lg w-64 bg-white">
          <div key={loan.id} className="form-group">
            <label>Loan Amount ($)</label>
            <input
              type="number"
              name="amount"
              placeholder="Loan Amount"
              value={loan.amount}
              onChange={(e) => handleLoanInputChange(loan.id, e)}
            />
            <label>Loan Term (years)</label>
            <input
              type="number"
              name="term"
              placeholder="Loan Term (years)"
              value={loan.term}
              onChange={(e) => handleLoanInputChange(loan.id, e)}
            />
            <label>Interest Rate (%)</label>
            <input
              type="number"
              name="loan_APR"
              placeholder="Interest Rate (%)"
              value={loan.loan_APR}
              onChange={(e) => handleLoanInputChange(loan.id, e)}
            />
            <label>Start Year</label>
            <input
              type="number"
              name="start_year"
              placeholder="Start Year"
              value={loan.start_year}
              onChange={(e) => handleLoanInputChange(loan.id, e)}
            />
          
            <div className="form-group">
            <div className="button-group">
            <button type="button" className="btn btn-cancel" onClick={() => removeLoanField(loan.id)}>
              Remove Loan
            </button>
            </div>
          </div>
            {/* <hr class="h-1 bg-black border-none"/> */}
          </div>
      </div>

    ))}
    <div className="form-group">
        <div className="button-group">
        <button type="button" className="btn btn-cancel" onClick={() => addLoanField()}>
          Add new Loan
        </button>
        </div>
     </div>

      {/* Show Regime Performance */}
      <div className="form-group">
        <div className="button-group">
          <button type="button" className="btn btn-run" onClick={handleRunTest}>
            Run Test
          </button>
          <button type="button" className="btn btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;

