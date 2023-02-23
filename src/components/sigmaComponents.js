import { useEffect, useState } from "react";
import Graph from "graphology";
import { SigmaContainer, useLoadGraph, useRegisterEvents } from "@react-sigma/core";
import { useWorkerLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import "@react-sigma/core/lib/react-sigma.min.css";
import salkey from "../data/correspondence-network-11.gexf";
import gexf from "graphology-gexf";

const Fa2 = () => {
  const { start, kill, isRunning } = useWorkerLayoutForceAtlas2({ settings: { slowDown: 100, gravity: 100, linLogMode: true } });

  useEffect(() => {
    // start FA2
    start();
    return () => {
      // Kill FA2 on unmount
      kill();
    };
  }, [start, kill]);

  return null;
};


const LoadGraph = (props) => {
  const loadGraph = useLoadGraph();

  const [graph, setGraph] = useState(null);
  
  useEffect(() => {   
    fetch(salkey).then(
      r => r.text()
  ).then(
      text => gexf.parse(Graph, text)
  ).then(graph => {
      setGraph(graph); 
      graph.forEachNode(node => {
        graph.setNodeAttribute(node, 'x', Math.random());          
        graph.setNodeAttribute(node, 'y', Math.random());
        const attrs = graph.getNodeAttributes(node);
        const degree = graph.degree(node);
        if (degree < 5) {
          graph.setNodeAttribute(node, 'size', 5);
        } else {
          graph.setNodeAttribute(node, 'size', degree);
        }   
        graph.setNodeAttribute(node, 'label', attrs.name);
      });

      graph.forEachEdge(edge => {
        const attrs = graph.getEdgeAttributes(edge);
        if (attrs.edge_type == 'corresponded') {
          graph.setEdgeAttribute(edge, 'color', '#ea04e2');
        } else {
          graph.setEdgeAttribute(edge, 'color', '#e2ea04');
        }
      })
      
      loadGraph(graph);
    });    
    
  }, [loadGraph]);
  

  
  const registerEvents = useRegisterEvents();

  useEffect(() => {
    if (graph) {
      registerEvents({
        clickNode: (event) => {
          const attrs = graph.getNodeAttributes(event.node);
          props.setNodeProps(attrs);
          event.preventSigmaDefault();
        },
      })
    }
  }, [graph, registerEvents]);

  return null;
};

export const DisplayGraph = (props) => {

  return (
    <SigmaContainer style={{ height: "900px", width: "1500px" }}>
      <LoadGraph setNodeProps={props.setNodeProps}>
        <Fa2 />
      </LoadGraph>
    </SigmaContainer>
  );
};