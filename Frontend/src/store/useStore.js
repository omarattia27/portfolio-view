import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';  

const useStore = create((set) => ({
    INFLATION: 3.0,
    END_YEAR: 40,
    // LOAN_END_YEAR: 10,
    INITIAL_LOAN: 0,
    INITIAL_SAVINGS: 0,
    INITIAL_SALARY: 75000,
    INITIAL_RECURRING_COST: 30000,
    // INVESTMENT_APR: 9.0,
    LOAN_APR: 3.0,
    // SALARY_INCREASE_RATE: 6.5,
    RECURRING_COST_INCREASE_RATE: 6.0,
    PROVINCE: "BC",
    LOANS:[
        //{id: "999999", "amount": 0, "start_year": 0, "term": 10, "loan_APR": 6.0}
    ],
    SUBMISSION: 0,
    ASSETS_INPUTS: 0,

    // TOTAL_ALLOCATION : 100, // Total available amount

    ALLOCATION_INPUT_STATE : [
        {id:0, val: 100, asset_name: 'Cash'},
    ],

    update_val_ALLOCATION_INPUT_STATE: (id, value) => set((state) => {
        // let updatedAllocationInputState = (prev) => ({ ...prev, [key]: value })
        let updatedAllocationInputState = [...state.ALLOCATION_INPUT_STATE];
        const allocationIndex = state.ALLOCATION_INPUT_STATE.findIndex(allocation => allocation.id === id);

        // Dynamically update the specific key with the new value
        updatedAllocationInputState[allocationIndex].val = value

        // Return the new state with the updated allocation input state
        return { ALLOCATION_INPUT_STATE: updatedAllocationInputState};
    }),

    update_asset_ALLOCATION_INPUT_STATE: (id, asset) => set((state) => {
        // let updatedAllocationInputState = (prev) => ({ ...prev, [key]: value })
        let updatedAllocationInputState = [...state.ALLOCATION_INPUT_STATE];
        const allocationIndex = state.ALLOCATION_INPUT_STATE.findIndex(allocation => allocation.id === id);

        // Dynamically update the specific key with the new value
        updatedAllocationInputState[allocationIndex].asset_name = asset

        // Return the new state with the updated allocation input state
        return { ALLOCATION_INPUT_STATE: updatedAllocationInputState};
    }),

    add_row_ALLOCATION_INPUT_STATE: (POTENTIAL_ASSETS) => set((state) => {
        // state.LOANS.filter(loan => loan.id !== id)
        let updatedAllocaltionInputState = [...state.ALLOCATION_INPUT_STATE];

        const new_id = state.ASSETS_INPUTS+1
        const assets_selected = Object.entries(updatedAllocaltionInputState).map((item)=>item.asset_name)
        const assets_choices = POTENTIAL_ASSETS.filter(asset => !assets_selected.includes(asset)) 
        const asset_ticker = assets_choices[0]

        // Return the new state with the updated potential_assets and allocation input state
        return { ALLOCATION_INPUT_STATE:[
            ...state.ALLOCATION_INPUT_STATE, 
            {id: new_id, asset_name: asset_ticker, val: 0}
        ],
        ASSETS_INPUTS: new_id
    };
    }),

    delete_row_ALLOCATION_INPUT_STATE: (id) => set((state) => {

        // Return the new state with the updated potential_assets and allocation input state
        return {
            ALLOCATION_INPUT_STATE: state.ALLOCATION_INPUT_STATE.filter(allocation => allocation.id !== id)  // Filter out the loan with matching id
        }
    }),

    incrementSUBMISSION: () => set((state) => ({ SUBMISSION: state.SUBMISSION + 1 })),

    // A dynamic setter for all properties
    setProperty: (key, value) => set((state) => ({
        [key]: value
    })),

    setAddNewLoanEntry: () => set((state) => ({
        LOANS:[
            ...state.LOANS, 
            {id: uuidv4(), "amount": '', "start_year": '', "term": '', "loan_APR": ''}
        ]
    })),

    // Updates a single attribute of an existing loan entry by id
    setLoanEntry: (id, key, val) => set((state) => {
        // Find the index of the loan by id
        const loanIndex = state.LOANS.findIndex(loan => loan.id === id);

        if (loanIndex === -1) {
            return;  // Loan not found, return without changes
        }

        // Create a new loans array with the updated loan
        const updatedLoans = [...state.LOANS];

        // Dynamically update the specific key with the new value
        updatedLoans[loanIndex] = { 
            ...updatedLoans[loanIndex], 
            [key]: val  // Only update the specified attribute
        };

        // Return the new state with the updated loans array
        return { LOANS: updatedLoans };
    }),

    // Function to delete a loan entry by id
    deleteLoanEntry: (id) => set((state) => ({
        LOANS: state.LOANS.filter(loan => loan.id !== id)  // Filter out the loan with matching id
    })),

}));

export default useStore;
