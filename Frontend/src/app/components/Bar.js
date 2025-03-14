"use client"; // Add this line at the top

import ResizableBox from "../ResizableBox";
import useStore from '../store/useStore';
import { useEffect, useState, useMemo } from 'react';
import { AxisOptions, Chart } from "react-charts";
import axios from 'axios';
import './Bar.css';

export default function Bar() {
  const INFLATION = useStore((state) => state.INFLATION);
  const INITIAL_SALARY = useStore((state) => state.INITIAL_SALARY);
  const INITIAL_RECURRING_COST = useStore((state) => state.INITIAL_RECURRING_COST);
  const INITIAL_SAVINGS = useStore((state) => state.INITIAL_SAVINGS);
  const RECURRING_COST_INCREASE_RATE = useStore((state) => state.RECURRING_COST_INCREASE_RATE);
  const PROVINCE = useStore((state) => state.PROVINCE);
  const LOANS = useStore((state) => state.LOANS);
  const ALLOCATION_INPUT_STATE = useStore((state) => state.ALLOCATION_INPUT_STATE);

  const SUBMISSION = useStore((state) => state.SUBMISSION);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data using axios
    const fetchData = async () => {
      try {
        // Define the body parameters
        const requestBody = {
          INFLATION: INFLATION / 100,
          END_YEAR: 40,
          INITIAL_SAVINGS: INITIAL_SAVINGS,
          INITIAL_SALARY: INITIAL_SALARY,
          INITIAL_RECURRING_COST: INITIAL_RECURRING_COST,
          RECURRING_COST_INCREASE_RATE: RECURRING_COST_INCREASE_RATE / 100,
          PROVINCE: PROVINCE,
          LOANS: LOANS,  // No need to encode, send as a JSON array
          ALLOCATION_INPUT_STATE: ALLOCATION_INPUT_STATE
        };
  
        // Use POST request with JSON body
        const response = await axios.post('http://localhost:8000/data', requestBody);
  
        setData(response.data);
        setLoading(false);
        console.log(response);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
  
    if (SUBMISSION) {
      fetchData();  // Only fetch data when SUBMISSION is triggered
    }
  }, [SUBMISSION]);  // Dependency on SUBMISSION

  const primaryAxis = useMemo(() => ({
    getValue: (datum) => datum.primary,
    label: 'Years', // Label for the x-axis
    type: 'time'
  }), []);

  const secondaryAxes = useMemo(
    () => [
      {
        getValue: (datum) => datum.secondary,
        label: '($)', // Label for the y-axis
        tickFormat: (value) => `$${value}`, // Add `$` to each tick
      },
    ], 
    []
  );

  if (loading) {
    return <div className="loading-div" width='950' height='650' >Loading...</div>;
  }
  return (
    <>
      <br />
      <br />
      <ResizableBox width='950' height='650'>
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
          }}
        />
      </ResizableBox>
    </>
  );
}
