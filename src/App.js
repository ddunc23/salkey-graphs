import { DisplayGraph } from "./components/sigmaComponents";
import { useState } from "react";


const InfoPanel = (props) => {
  return (
    <div className="w-1/3 overflow-scroll bg-white">
      <p>{props.name ? props.name : ''}</p>
      <p>{props.bio ? props.bio : ''}</p>
    </div>
  )
}


function App() {

  const [nodeProps, setNodeProps] = useState(null);

  return (
    <div className="w-screen h-screen flex justify-center overflow-hidden">
      <DisplayGraph setNodeProps={setNodeProps}/>
      <InfoPanel name={nodeProps ? nodeProps.name : null} bio={nodeProps ? nodeProps.bio : null}/>
    </div>
  );
}

export default App;
