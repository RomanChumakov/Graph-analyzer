import React, {useState} from 'react';
import Graph from "react-graph-vis";
import {ru as lang} from "../languages/russian";
// import {en as lang} from "../languages/english";

import Table from "./Table.js";
import {
    getAdjacencyMatrixByConnectivityList,
    getIncidenceMatrixByAdjacencyMatrix,
    getDegreesVector,
    getGraphOrientation,
    getEdgesNumber,
    getGraphMultiness,
    getGraphFaked,
    getLeafVector,
    getRouteMatrix,
    getEnclosureRouteMatrix,
    getGraphByConnectivityList
} from "./usefulFunctions";

// import "react-graph-vis/dist/network.css";

function Body(props) {

    const [isResultsNeedToRender, setIsResultsNeedToRender] = useState(false);
    const [isGraphOriented, setIsGraphOriented] = useState(false);
    const [isMultigraph, setIsMultigraph] = useState(false);
    const [isGraphFaked, setIsGraphFaked] = useState(false);
    const [routeLength, setRouteLength] = useState(0);

    const [adjacencyMatrix, setAdjacencyMatrix] = useState([]);
    const [incidenceMatrix, setIncidenceMatrix] = useState([]);
    const [routeMatrix, setRouteMatrix] = useState([]);
    const [enclosureRouteMatrix, setEnclosureRouteMatrix] = useState([]);

    const [degreesVector, setDegreesVector] = useState([]);
    const [approachHalfDegreesVector, setApproachHalfDegreesVector] = useState([]);
    const [outcomeHalfDegreesVector, setOutcomeHalfDegreesVector] = useState([]);
    const [leafVector, setLeafVector] = useState([]);

    const [graph, setGraph] = useState({
        nodes: [
            { id: 1, label: "A", color: "#00e1ff" },
            { id: 2, label: "B", color: "#00e1ff" },
            { id: 3, label: "C", color: "#00e1ff" }
        ],
        edges: [
            { from: 1, to: 2 },
            { from: 2, to: 1 },
            { from: 1, to: 3 },
            { from: 3, to: 1 },
            { from: 2, to: 3 },
            { from: 3, to: 2 }
        ]
    });
    const [options, setOptions] = useState({
        layout: {
            hierarchical: false
        },
        edges: {
            color: "#7300ff"
        },
        height: "250px",
        width: "250px",
    });

    const handleInputClick = e => {

        let source = "";
        if (document.getElementById("data").value !== "") {
            try {
                source = JSON.parse(document.getElementById("data").value);
            } catch (e) {
                alert(lang.syntaxDataError);
                return undefined;
            }
        }

        let routeLength = parseInt(document.getElementById("len").value);

        if (isNaN(routeLength)) {
            alert(lang.syntaxRouteLengthError);
            return undefined;
        }
        if (routeLength < 1) {
            alert(lang.routeLengthBelowZeroError);
            return undefined;
        }
        if (routeLength > 20) {
            alert(lang.routeLengthMoreThen20Error);
            return undefined;
        }

        setIsResultsNeedToRender(true);

        let adjacencyMatrix = getAdjacencyMatrixByConnectivityList(source);
        let isGraphOriented = getGraphOrientation(adjacencyMatrix);
        let edgesNumber = getEdgesNumber(adjacencyMatrix, isGraphOriented);
        let incidenceMatrix = getIncidenceMatrixByAdjacencyMatrix(adjacencyMatrix, edgesNumber, isGraphOriented);
        let degreesVector = [];
        let outcomeHalfDegreesVector = [];
        let approachHalfDegreesVector = [];
        let isMultigraph = getGraphMultiness(adjacencyMatrix);
        let isGraphFaked = getGraphFaked(adjacencyMatrix);
        let leafs = [];
        let rMatrix = getRouteMatrix(adjacencyMatrix, routeLength);
        let erMatrix = getEnclosureRouteMatrix(adjacencyMatrix, routeLength);
        let graph = getGraphByConnectivityList(source);

        if (!isGraphOriented) {
            degreesVector = getDegreesVector(adjacencyMatrix, incidenceMatrix, 1);
            leafs = getLeafVector(degreesVector);
        } else {
            outcomeHalfDegreesVector = getDegreesVector(adjacencyMatrix, incidenceMatrix, -1);
            approachHalfDegreesVector = getDegreesVector(adjacencyMatrix, incidenceMatrix, 1);
            leafs = getLeafVector(outcomeHalfDegreesVector, approachHalfDegreesVector);
        }

        setRouteLength(routeLength);
        setIsGraphOriented(isGraphOriented);
        setIncidenceMatrix(incidenceMatrix);
        setAdjacencyMatrix(adjacencyMatrix);
        setOutcomeHalfDegreesVector(outcomeHalfDegreesVector);
        setApproachHalfDegreesVector(approachHalfDegreesVector);
        setDegreesVector(degreesVector);
        setIsMultigraph(isMultigraph);
        setIsGraphFaked(isGraphFaked);
        setLeafVector(leafs);
        setRouteMatrix(rMatrix);
        setEnclosureRouteMatrix(erMatrix);
        setGraph(graph);

    }

    return (
        <div className="main-container">
            <div style = {{height: "250px", width: "250px", marginTop: "10px"}}>
                <Graph graph={graph} options={options}/>
            </div>
            <label className="last">{`${lang.inputFormat} {"a": ["b", "c"], "b": ["a", "c"], "c": ["a", "b"]}`}</label>
            <input type="text" id="data" className="input-item data-container" placeholder={lang.enterAdjacencyList}/>
            <input type="text" id="len" className="input-item data-container" placeholder={lang.enterRouteLength}/>
            <input
                type="button"
                className="input-item last"
                value={lang.getResult}
                onClick={handleInputClick}
            />
            <div>
                <div
                    style = {{
                        display: isResultsNeedToRender ? "flex" : "none",
                        flexDirection: "row",
                        flexWrap: "wrap"
                    }}
                >
                    <Table title={lang.adjacencyMatrix} data={adjacencyMatrix}/>
                    <Table title={lang.incidenceMatrix} data={incidenceMatrix}/>
                    <Table title={`${lang.routeLengthMatrix} ${routeLength}`} data={routeMatrix}/>
                    <Table title={`${lang.enclosedRouteLengthMatrix} ${routeLength}`} data={enclosureRouteMatrix}/>
                    <div
                        style = {{
                            padding: "5px",
                            border: "1px solid silver",
                            marginTop: "5px"
                        }}
                    >
                    {
                        isGraphOriented
                        ? <div>
                            <p>{`${lang.outcomeHalfDegreesVector} ${outcomeHalfDegreesVector}`}</p>
                            <p>{`${lang.approachHalfDegreesVector} ${approachHalfDegreesVector}`}</p>
                        </div>
                        : <div>
                            <p>{`${lang.degreesVector} ${degreesVector}`}</p>
                        </div>
                    }
                        <p>{`${lang.leafVector} ${leafVector.length > 0 ? leafVector : lang.emptyLeafVector}`}</p>
                        <p>{`${lang.multipleEdgesExistence} ${isMultigraph ? lang.yes : lang.no}`}</p>
                        <p>{`${lang.loopExistence} ${isGraphFaked ? lang.yes : lang.no}`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Body;
