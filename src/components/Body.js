import React, {useState} from 'react';
import Graph from "react-graph-vis";
import {ru} from "../languages/russian";
import {en} from "../languages/english";

import Table from "./Table.js";
import {
    getAdjacencyMatrixByAdjacencyList,
    getIncidenceMatrixByAdjacencyMatrix,
    getDegreeVector,
    getGraphOrientation,
    getEdgeNumber,
    getGraphMultiness,
    getGraphFaked,
    getLeafVector,
    getDistanceMatrix,
    getEnclosedDistanceMatrix,
    getGraphByAdjacencyList
} from "./usefulFunctions";

function Body(props) {

    const [shouldResultsRender, setShouldResultsRender] = useState(false);
    const [isGraphOriented, setIsGraphOriented] = useState(false);
    const [isMultigraph, setIsMultigraph] = useState(false);
    const [isGraphFaked, setIsGraphFaked] = useState(false);
    const [distanceLength, setDistanceLength] = useState(0);

    const [adjacencyMatrix, setAdjacencyMatrix] = useState([]);
    const [incidenceMatrix, setIncidenceMatrix] = useState([]);
    const [distanceMatrix, setDistanceMatrix] = useState([]);
    const [enclosedDistanceMatrix, setEnclosedDistanceMatrix] = useState([]);

    const [degreeVector, setDegreeVector] = useState([]);
    const [inDegreeVector, setInDegreeVector] = useState([]);
    const [outDegreeVector, setOutDegreeVector] = useState([]);
    const [leafVector, setLeafVector] = useState([]);

    const [lang, setLang] = useState(ru);

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

    const handleChangeLanguage = e => {
        switch (e.target.selectedIndex) {
            case 0: {
                setLang(ru);
                break;
            }
            case 1: {
                setLang(en);
                break;
            }
        }
    };

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

        let distanceLength = parseInt(document.getElementById("distance-length").value);

        if (isNaN(distanceLength)) {
            alert(lang.syntaxDistanceLengthError);
            return undefined;
        }
        if (distanceLength < 1) {
            alert(lang.distanceLengthBelowZeroError);
            return undefined;
        }
        if (distanceLength > 20) {
            alert(lang.distanceLengthMoreThenTwentyError);
            return undefined;
        }

        setShouldResultsRender(true);

        let adjacencyMatrix = getAdjacencyMatrixByAdjacencyList(source);
        let isGraphOriented = getGraphOrientation(adjacencyMatrix);
        let edgeNumber = getEdgeNumber(adjacencyMatrix, isGraphOriented);
        let incidenceMatrix = getIncidenceMatrixByAdjacencyMatrix(adjacencyMatrix, edgeNumber, isGraphOriented);
        let degreeVector = [];
        let outDegreeVector = [];
        let inDegreeVector = [];
        let isMultigraph = getGraphMultiness(adjacencyMatrix);
        let isGraphFaked = getGraphFaked(adjacencyMatrix);
        let leafVector = [];
        let distanceMatrix = getDistanceMatrix(adjacencyMatrix, distanceLength);
        let enclosedDistanceMatrix = getEnclosedDistanceMatrix(adjacencyMatrix, distanceLength);
        let graph = getGraphByAdjacencyList(source);

        if (!isGraphOriented) {
            degreeVector = getDegreeVector(adjacencyMatrix, incidenceMatrix, 1);
            leafVector = getLeafVector(degreeVector);
        } else {
            outDegreeVector = getDegreeVector(adjacencyMatrix, incidenceMatrix, -1);
            inDegreeVector = getDegreeVector(adjacencyMatrix, incidenceMatrix, 1);
            leafVector = getLeafVector(outDegreeVector, inDegreeVector);
        }

        setDistanceLength(distanceLength);
        setIsGraphOriented(isGraphOriented);
        setIncidenceMatrix(incidenceMatrix);
        setAdjacencyMatrix(adjacencyMatrix);
        setOutDegreeVector(outDegreeVector);
        setInDegreeVector(inDegreeVector);
        setDegreeVector(degreeVector);
        setIsMultigraph(isMultigraph);
        setIsGraphFaked(isGraphFaked);
        setLeafVector(leafVector);
        setDistanceMatrix(distanceMatrix);
        setEnclosedDistanceMatrix(enclosedDistanceMatrix);
        setGraph(graph);

    }

    return (
        <div className="main-container">
            <select style = {{marginTop: "10px"}} onChange = {handleChangeLanguage}>
                <option value = "ru">Русский</option>
                <option value = "en">English</option>
            </select>
            <div style = {{height: "250px", width: "250px", marginTop: "10px"}}>
                <Graph graph={graph} options={options}/>
            </div>
            <label className="last">{`${lang.inputFormat} {"a": ["b", "c"], "b": ["a", "c"], "c": ["a", "b"]}`}</label>
            <input type="text" id="data" className="input-item data-container" placeholder={lang.enterAdjacencyList}/>
            <input type="text" id="distance-length" className="input-item data-container" placeholder={lang.enterDistanceLength}/>
            <input
                type="button"
                className="input-item last"
                value={lang.getResults}
                onClick={handleInputClick}
            />
            <div>
                <div
                    style = {{
                        display: shouldResultsRender ? "flex" : "none",
                        flexDirection: "row",
                        flexWrap: "wrap"
                    }}
                >
                    <Table title={lang.adjacencyMatrix} data={adjacencyMatrix}/>
                    <Table title={lang.incidenceMatrix} data={incidenceMatrix}/>
                    <Table title={`${lang.distanceLengthMatrix} ${distanceLength}`} data={distanceMatrix}/>
                    <Table title={`${lang.enclosedDistanceLengthMatrix} ${distanceLength}`} data={enclosedDistanceMatrix}/>
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
                            <p>{`${lang.outDegreeVector} ${outDegreeVector}`}</p>
                            <p>{`${lang.inDegreeVector} ${inDegreeVector}`}</p>
                        </div>
                        : <div>
                            <p>{`${lang.degreeVector} ${degreeVector}`}</p>
                        </div>
                    }
                        <p>{`${lang.leafVector} ${leafVector.length > 0 ? leafVector : lang.emptyLeafVector}`}</p>
                        <p>{`${lang.multipleEdgePresence} ${isMultigraph ? lang.yes : lang.no}`}</p>
                        <p>{`${lang.loopPresence} ${isGraphFaked ? lang.yes : lang.no}`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Body;
