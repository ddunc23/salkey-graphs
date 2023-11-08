import { DisplayGraph } from "./components/sigmaComponents";
import { useState } from "react";


const InfoPanel = (props) => {
  return (
    props.bio ?
    <div className="w-1/3 overflow-scroll bg-white p-4 mt-10">
      <h2 className="text-lg">{props.name ? props.name : ''}</h2>
      <h3 className="text-sm italic mb-2">Shelfmark: {props.shelfmark ? props.shelfmark : ''}</h3>
      <p>{props.bio}</p>
    </div>
    :
    <div className="w-1/3 overflow-scroll bg-white p-4">
    </div>
  )
}


function App() {

  const [nodeProps, setNodeProps] = useState(null);

  return (
    <div className="w-screen h-screen flex justify-center overflow-hidden">
      <div className="w-full h-10 fixed top-0 left-0 right-0 bg-gray-50">
        <h1 className="text-xl font-thin align-middle h-10 pl-5 pt-1">Andrew Salkey Correspondence Network</h1>
      </div>
      <DisplayGraph setNodeProps={setNodeProps}/>
      <InfoPanel name={nodeProps ? nodeProps.name : null} bio={nodeProps ? nodeProps.bio : null} shelfmark={nodeProps ? nodeProps.shelfmark : null}/>
    </div>
  );
}

export default App;
