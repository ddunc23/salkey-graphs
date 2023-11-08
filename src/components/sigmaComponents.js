import { useEffect, useState } from "react";
import Graph from "graphology";
import { SigmaContainer, useLoadGraph, useRegisterEvents, useSigma } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import salkey from "../data/correspondence-network-2023-02-23-v1.graphml";
import graphml from "graphology-graphml";
import "@react-sigma/core/lib/react-sigma.min.css";

const LoadGraph = (props) => {
  const loadGraph = useLoadGraph();

  const [graph, setGraph] = useState(null);
  
  useEffect(() => {   
    fetch(salkey).then(
      r => r.text()
  ).then(
      text => graphml.parse(Graph, text)
  ).then(graph => {
      setGraph(graph); 
      graph.forEachNode(node => {
        const attrs = graph.getNodeAttributes(node);
        const degree = graph.degree(node);
        if (degree < 5) {
          graph.setNodeAttribute(node, 'size', 5);
        } else {
          graph.setNodeAttribute(node, 'size', degree);
        }
        graph.setNodeAttribute(node, 'color', '#63a370');
        attrs.bio ?
          graph.setNodeAttribute(node, 'label', 'ℹ️ ' + attrs.name)
          :
          graph.setNodeAttribute(node, 'label', attrs.name)
        attrs.shelfmark ?
          graph.setNodeAttribute(node, 'shelfmark', attrs.shelfmark)
          :
          graph.setNodeAttribute(node, 'shelfmark', null)
      });

      graph.forEachEdge(edge => {
        const attrs = graph.getEdgeAttributes(edge);
        if (attrs.edge_type == 'corresponded') {
          graph.setEdgeAttribute(edge, 'color', '#ea04e2');
          graph.setEdgeAttribute(edge, 'label', 'Corresponded');
        } else {
          graph.setEdgeAttribute(edge, 'color', '#c1c1c1');
          graph.setEdgeAttribute(edge, 'label', 'Mentioned');
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
        enterNode: (event) => {
          graph.setNodeAttribute(event.node, 'color', '#c1c1c1');
        },
        leaveNode: (event) => {
          graph.setNodeAttribute(event.node, 'color', '#63a370');
        }
      })
    }
  }, [graph, registerEvents]);

  return null;
};

export const DisplayGraph = (props) => {

  return (
    <SigmaContainer style={{ height: "700px", width: "1500px" }} className="mt-10" settings={
      {
        renderEdgeLabels: true, 
        labelSize: 14, 
        edgeLabelSize: 10,
        stagePadding: 2
      }
    }>
      <LoadGraph setNodeProps={props.setNodeProps} />
    </SigmaContainer>
  );
};