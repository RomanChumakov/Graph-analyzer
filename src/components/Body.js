import React, {useState} from 'react';

import Table from "./Table.js";
import {
    getAdjacencyMatrixByConnectivityList,
    getIncidenceMatrixByAdjacencyMatrix,
    getDegreesVector,
    getGraphOrientation,
    getEdgesNumber
} from "./usefulFunctions";

function Body(props) {

    const [isResultsNeedToRender, setIsResultsNeedToRender] = useState(false);
    const [isGraphOriented, setIsGraphOriented] = useState(false);

    const [adjacencyMatrix, setAdjacencyMatrix] = useState([]);
    const [incidenceMatrix, setIncidenceMatrix] = useState([]);

    const [degreesVector, setDegreesVector] = useState([]);
    const [approachHalfDegreesVector, setApproachHalfDegreesVector] = useState([]);
    const [outcomeHalfDegreesVector, setOutcomeHalfDegreesVector] = useState([]);

    const handleInputClick = e => {
        setIsResultsNeedToRender(true);

        let source = "";
        if (document.getElementById("data").value !== "") {
            source = JSON.parse(document.getElementById("data").value);
        }

        let adjacencyMatrix = getAdjacencyMatrixByConnectivityList(source);
        let isGraphOriented = getGraphOrientation(adjacencyMatrix);
        let edgesNumber = getEdgesNumber(adjacencyMatrix, isGraphOriented);
        let incidenceMatrix = getIncidenceMatrixByAdjacencyMatrix(adjacencyMatrix, edgesNumber, isGraphOriented);
        let degreesVector = [];
        let outcomeHalfDegreesVector = [];
        let approachHalfDegreesVector = [];

        if (!isGraphOriented) {
            degreesVector = getDegreesVector(adjacencyMatrix, incidenceMatrix, 1);
        } else {
            outcomeHalfDegreesVector = getDegreesVector(adjacencyMatrix, incidenceMatrix, -1);
            approachHalfDegreesVector = getDegreesVector(adjacencyMatrix, incidenceMatrix, 1);
        }

        setIsGraphOriented(isGraphOriented);
        setIncidenceMatrix(incidenceMatrix);
        setAdjacencyMatrix(adjacencyMatrix);
        setOutcomeHalfDegreesVector(outcomeHalfDegreesVector);
        setApproachHalfDegreesVector(approachHalfDegreesVector);
        setDegreesVector(degreesVector);
    }

    return (
        <div className="main-container">
            <img src="example.png" height="100" width="100"/>
            <label className="last">{`Формат ввода: {"a": ["b", "c"], "b": ["a", "c"], "c": ["a", "b"]}`}</label>
            <input type="text" id="data" className="input-item data-container" placeholder="Введите список смежности"/>
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
                    <div
                        style = {{
                            padding: "5px",
                            border: "1px solid black"
                        }}
                    >
                    {
                        isGraphOriented
                        ? <div>
                            <p>{`Вектор полустепеней исхода ${outcomeHalfDegreesVector}`}</p>
                            <p>{`Вектор полустепеней захода ${approachHalfDegreesVector}`}</p>
                        </div>
                        : <p>{`Вектор степеней ${degreesVector}`}</p>
                    }
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
