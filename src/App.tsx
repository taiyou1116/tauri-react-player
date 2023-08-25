import { useState } from "react";
// import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  const [name, setName] = useState("anoymous");
  

  return (
    <>
      <div>Hello, {name}</div>
      <input type="text" value={name} onChange={e => setName(e.target.value)}/>
    </>
  );
}

export default App;
