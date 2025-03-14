"use client"; // Add this line at the top

import Bar from "./Bar";
import Form from "./Form";
import './Dataview.css'

const components = [
  ["Bar", Bar],
];

export default function Dataview() {
  return (
    <div  className="flex-container gap-10">
      <div className="left-1">
        <Bar />
      </div>
      <div className="component-box ">
        <Form />
      </div>
    </div>
  );
}
