import React from "react";
import Accessory from "test-module";

function App() {
  const [val, setVal] = React.useState(false);
  return (
    <div>
      <span>hello world </span>
      <Accessory />
      <span>{val ? "true" : "false"}</span>
      <button onClick={() => setVal(o => !o)}>click me </button>
    </div>
  );
}

export default App;
