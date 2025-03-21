"use client";

import Bar from "./Bar";
import Form from "./Form";
import '../styles/Dataview.css'

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
