import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import PlainDraggable from "plain-draggable";
import './SandboxTest.css';
import SandboxController from './SandboxController.jsx';
import * as backend from '../backend/backend.js'
import * as dataloader from '../backend/dataloader.js' //Added by Justin.
import snapPoints from './snapPoints.js';

var count = 0;
var draggables = [];

let backend_worker = null

function createBackend() {
    backend.createBackendWorker();
    backend_worker = backend.getBackendWorker();
}

function createModel() {
    //FIXME: This is just a test
    let test_model = [  //replace with actual model
        {
            type: "dense",
            inputShape: [2], //retrieve from input dataset
            units: 16,
            activation: "relu"
        },
        {
            type: "dense",
            units: 8,
            activation: "relu"
        },
        {
            type: "dense",
            units: 2,
            activation: "relu"
        },
        {
            type: "dense",
            units: 1,
        }
    ];
    backend_worker.postMessage({func: 'prepareModel', args: test_model})
}

function train() {
    //FIXME: This is just a test
    let fileName = 'synthetic_normal_binary_classification.csv';
    let problemType = 'classification';
    backend_worker.postMessage({func: 'trainModel', args: {fileName, problemType}});
}

// Programmatically add draggable
function SandboxTest() {
    const [elements, setElements] = useState([]);
    const containerRef = useRef(null);
    const elementRefs = useRef(new Map());
  
    function getSnapPoints(el) {
      if (!el) return [];
      const rect = el.getBoundingClientRect();
      return [
        { x: rect.left, y: rect.top + rect.height / 2 }, // Left-center
        { x: rect.right, y: rect.top + rect.height / 2 }, // Right-center
        { x: rect.left + rect.width / 2, y: rect.top }, // Top-center
        { x: rect.left + rect.width / 2, y: rect.bottom }, // Bottom-center
      ];
    }
  
    function findClosestSnapPoint(el, elementsList) {
      const elSnapPoints = getSnapPoints(el);
      let closestPoint = null;
      let minDistance = 20; // Max snap distance
  
      elementsList.forEach((otherEl) => {
        if (otherEl === el) return;
        const otherSnapPoints = getSnapPoints(otherEl);
  
        elSnapPoints.forEach((elPoint) => {
          otherSnapPoints.forEach((otherPoint) => {
            const distance = Math.hypot(elPoint.x - otherPoint.x, elPoint.y - otherPoint.y);
            if (distance < minDistance) {
              minDistance = distance;
              closestPoint = { elPoint, otherPoint };
            }
          });
        });
      });
  
      return closestPoint;
    }
  
    useEffect(() => {
      elements.forEach((id) => {
        const el = elementRefs.current.get(id);
        if (!el) return;
  
        const draggable = new PlainDraggable(el);
        draggable.onMove = function () {
          const allElements = Array.from(elementRefs.current.values());
          const snap = findClosestSnapPoint(el, allElements);
  
          if (snap) {
            const dx = snap.otherPoint.x - snap.elPoint.x;
            const dy = snap.otherPoint.y - snap.elPoint.y;
            draggable.left += dx;
            draggable.top += dy;
          }
        };
      });
    }, [elements]);
  
    function addElement() {
      const newId = elements.length ? elements[elements.length - 1] + 1 : 1;
      setElements(function (prev) {
        return [...prev, newId];
      });
    }
  
    return (
      <div style={{ textAlign: "center" }}>
          {/* Buttons for different functions */}
          <div style={{ marginBottom: "10px" }}>
              <button onClick={createBackend} className="action-button">Create Backend</button>
              <button onClick={createModel} className="action-button">Create Model</button>
              <button onClick={train} className="action-button">Train Model</button>
              <button onClick={addElement} className="action-button">Add Draggable Element</button>
          </div>

          <div
              ref={containerRef}
              style={{
                  position: "relative",
                  width: "400px",
                  height: "300px",
                  backgroundColor: "#F3F4F6",
                  border: "1px solid gray",
                  padding: "10px",
                  margin: "auto"
              }}
          >
              {elements.map((id) => (
                  <div
                      key={id}
                      ref={(el) => {
                          if (el) elementRefs.current.set(id, el);
                      }}
                      style={{
                          position: "absolute",
                          width: "60px",
                          height: "60px",
                          backgroundColor: "#10B981",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "5px",
                          boxShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                          cursor: "pointer",
                          top: "50px",
                          left: id * 70,
                      }}
                  >
                      {id}
                  </div>
              ))}
          </div>
      </div>
  );
}
export default SandboxTest