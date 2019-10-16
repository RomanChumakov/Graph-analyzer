import React, {useState} from 'react';

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
    getEnclosureRouteMatrix
} from "./usefulFunctions";

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

    const handleInputClick = e => {
        setIsResultsNeedToRender(true);

        let source = "";
        if (document.getElementById("data").value !== "") {
            source = JSON.parse(document.getElementById("data").value);
        }

        let routeLength = parseInt(document.getElementById("len").value);

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

    }

    return (
        <div className="main-container">
            <img src="example.png" height="100" width="100"/>
            <label className="last">{`Формат ввода: {"a": ["b", "c"], "b": ["a", "c"], "c": ["a", "b"]}`}</label>
            <input type="text" id="data" className="input-item data-container" placeholder="Введите список смежности"/>
            <input type="text" id="len" className="input-item data-container" placeholder="Введите длину пути"/>
            <input
                type="button"
                className="input-item last"
                value="Получить результат"
                onClick={handleInputClick}
            />
            <div
                style={{
                    borderTop: "1px solid black"
                }}
            >
                <div
                    style = {{
                        display: isResultsNeedToRender ? "flex" : "none",
                        flexDirectiom: "row"
                    }}
                >
                    <Table title={`Матрица смежности`} data={adjacencyMatrix}/>
                    <Table title={`Матрица инцидентности`} data={incidenceMatrix}/>
                    <Table title={`Матрица маршрутов длины ${routeLength}`} data={routeMatrix}/>
                    <Table title={`Матрица замкнутых маршрутов длины ${routeLength}`} data={enclosureRouteMatrix}/>
                    <div
                        style = {{
                            padding: "5px",
                            border: "1px solid black"
                        }}
                    >
                    {
                        isGraphOriented
                        ? <div>
                            <p>{`Вектор полустепеней исхода: ${outcomeHalfDegreesVector}`}</p>
                            <p>{`Вектор полустепеней захода: ${approachHalfDegreesVector}`}</p>
                        </div>
                        : <div>
                            <p>{`Вектор степеней ${degreesVector}`}</p>
                        </div>
                    }
                    <p>{`Вектор висячих вершин: ${leafVector}`}</p>
                    <p>{`Наличие кратных рёбер: ${isMultigraph ? "да" : "нет"}`}</p>
                    <p>{`Наличие петель: ${isGraphFaked ? "да" : "нет"}`}</p>
                    </div>
                </div>
                <svg
                    height="150"
                    width="150"
                    style={{
                        backgroundColor: "lightGray",
                        margin: "10px"
                    }}
                >
                    <line x1="0" y1="0" x2="50" y2="50" stroke="black"/>
                </svg>
            </div>
        </div>
    );
}

export default Body;
