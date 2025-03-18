import { useState } from "react";
import '../styles/Form.css'; 
import useStore from '../store/useStore';
// import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

export default function AllocationForm() {


  const ALLOCATION_INPUT_STATE = useStore((state) => state.ALLOCATION_INPUT_STATE);

  //Functions to manage the state
  const update_val_ALLOCATION_INPUT_STATE = useStore((state) => state.update_val_ALLOCATION_INPUT_STATE);
  const update_asset_ALLOCATION_INPUT_STATE = useStore((state) => state.update_asset_ALLOCATION_INPUT_STATE)
  const add_row_ALLOCATION_INPUT_STATE = useStore((state) => state.add_row_ALLOCATION_INPUT_STATE)
  const delete_row_ALLOCATION_INPUT_STATE = useStore((state) => state.delete_row_ALLOCATION_INPUT_STATE)
  const total = 100; // Total available amount
  const  POTENTIAL_ASSETS=[
    "Cash", 
    "ETF (SPY)", 
    "ETF (QQQ)", 
    "ETF (VTI)", 
    "ETF (ARKK)", 
    "ETF (DIA)", 
    "ETF (XLF)", 
    "ETF (IWM)",
    "REIT (PLD)",
    "REIT (EQIX)", 
    "REIT (AMT)",
    "REIT (CCI)",
    "REIT (DLR)", 
    "REIT (O)", 
    "REIT (PSA)",
    "REIT (SPG)", 
    "REIT (WELL)", 
    "REIT (AVB)",
    "Bonds (BND)",   
    "Bonds (AGG)",   
    "Bonds (BNDX)",  
    "Bonds (BSV)",  
    "Bonds (TLT)",   
    "Bonds (VCIT)",  
    "Bonds (LQD)",   
    "Bonds (MUB)",   
    "Bonds (BLV)",   
    "Bonds (VCSH)"
]

  // Calculate unallocated amount
  const allocatedTotal = Object.values(ALLOCATION_INPUT_STATE).reduce((sum, item) => sum + item.val, 0);
  const unallocated = total - allocatedTotal;

  // Handle dropdown selection change
  const handleDropdownChange = (e, key) => {
    const asset = e.target.value
    update_asset_ALLOCATION_INPUT_STATE(key, asset);
  };
    
  // Handle input changes
  const handleChange = (e, key) => {
    const value = Math.max(0, parseInt(e.target.value, 10) || 0);
    // setInputs((prev) => ({ ...prev, [key]: value }));
    console.log("key: ",key)
    console.log("value: ",value)
    update_val_ALLOCATION_INPUT_STATE(key, value);
  };
  
  const handlePlusClick = () => {
    add_row_ALLOCATION_INPUT_STATE(POTENTIAL_ASSETS)
  }

  return (
    <div className="p-4 border rounded-lg w-64 bg-white">
      {
        ALLOCATION_INPUT_STATE.map((allocation) => (
        <div key={allocation.id} className="flex ">
          <input
            type="number"
            value={allocation.val}
            min="0"
            id={allocation.id+"_input"}
            className="assets-input-box"
            onChange={(e) => handleChange(e, allocation.id)}
          />
        <select
            value={allocation.asset_name}
            onChange={(e) => handleDropdownChange(e, allocation.id)}
            className="assets-droplist-select"
            id={allocation.id+"_select"}
        >
        {POTENTIAL_ASSETS.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
          
          {allocation.id==0? <div className="container-remove-button"></div>: <div className="container-remove-button"> <button type="button" className="remove-button" onClick={()=>{delete_row_ALLOCATION_INPUT_STATE(allocation.id)}}>-</button> </div> }
        </div>
      ))}
      <div className="container-plus-button">
        <button type="button" id="plus-button" className="plus-button" onClick={handlePlusClick}>+</button>
        </div>
        
      <hr className="my-2" />
      
      <div className="text-md font-semibold">{unallocated} Unallocated</div>
    </div>
  );
}
