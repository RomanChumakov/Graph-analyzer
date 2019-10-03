import React, {useState} from 'react';
import './App.css';

import Table from "./Table.js";

function Body(props) {

    const [adjacenceMatrix, setAdjacencyMatrix] = useState("");
    const [incidenceMatrix, setIncidenceMatrix] = useState("");

    const handleInputClick = e => {
        console.log("Input was fired");
        let source = "";
        if (document.getElementById("data").value !== "") {
            source = JSON.parse(document.getElementById("data").value);
        }

        //creating adjacency matrix
        let matrix = [];
        matrix = Object.keys(source).map(vertex => {
            let columns = source[vertex];
            return Object.keys(source).map(v => {
                let vertexCoefficient = 0;
                let lastIndexOf = columns.lastIndexOf(v);
                let currentIndexOf = columns.indexOf(v);
                while (lastIndexOf !== currentIndexOf) {
                    vertexCoefficient++;
                    currentIndexOf = columns.indexOf(v, currentIndexOf + 1);
                }
                if (columns.lastIndexOf(v) !== -1)
                    vertexCoefficient++;
                return vertexCoefficient;
            });
        });
        setAdjacencyMatrix(matrix);

        //check is graph oriented
        let isGraphOriented = false;

        for(let i = 0; i < matrix.length; i++)
            for(let j = i + 1; j < matrix.length; j++)
                if (matrix[i][j] !== matrix[j][i])
                    isGraphOriented = true;


        //edges counting
        let edges = 0;
        if(!isGraphOriented) {
            for(let i = 0; i < matrix.length; i++)
                for(let j = i; j < matrix.length; j++)
                    if (matrix[i][j])
                        edges++;
        } else {
            for(let i = 0; i < matrix.length; i++)
                for(let j = 0; j < matrix.length; j++)
                    if (matrix[i][j] === 1)
                        edges++;
        }

        let incidenceMatrix = [];

        for(let i = 0; i < matrix.length; i++) {
            incidenceMatrix.push((() => {
                let row = [];
                for (let t = 0; t < edges; t++) {
                    row.push(0);
                }
                return row;
            })());
        }

        let k = 0;
        if(!isGraphOriented) {
            for(let i = 0; i < matrix.length; i++) {
                for(let j = i; j < matrix.length; j++) {
                    if(matrix[i][j]) {
                        incidenceMatrix[i][k] = matrix[i][j];
                        if (i !== j) {
                            incidenceMatrix[j][k] = matrix[i][j];
                        }
                        k++;
                    }
                }
            }
        } else {
            for(let i = 0; i < matrix.length; i++) {
                for(let j = 0; j < matrix.length; j++) {
                    if(matrix[i][j]) {
                        if (i === j) {
                            incidenceMatrix[i][k] = matrix[i][j];
                        } else {
                            incidenceMatrix[i][k] = -matrix[i][j];
                            incidenceMatrix[j][k] = matrix[i][j];
                        }
                        k++;
                    }
                }
            }
        }
        setIncidenceMatrix(incidenceMatrix);
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
                {
                    adjacenceMatrix !== ""
                    ? <Table title={`Матрица смежности`} data={adjacenceMatrix}/>
                    : null
                }
                {
                    incidenceMatrix !== ""
                    ? <Table title={`Матрица инцидентности`} data={incidenceMatrix}/>
                    : null
                }
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
