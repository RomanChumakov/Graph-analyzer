export const getGraphOrientation = (adjacencyMartix) => {
    for(let i = 0; i < adjacencyMartix.length; i++)
        for(let j = i + 1; j < adjacencyMartix.length; j++)
            if (adjacencyMartix[i][j] !== adjacencyMartix[j][i])
                return true;
};

export const getEdgeNumber = (adjacencyMartix, isGraphOriented) => {
    let edges = 0;
    if(!isGraphOriented) {
        for(let i = 0; i < adjacencyMartix.length; i++)
            for(let j = i; j < adjacencyMartix.length; j++)
                if (adjacencyMartix[i][j])
                    edges++;
    } else {
        for(let i = 0; i < adjacencyMartix.length; i++)
            for(let j = 0; j < adjacencyMartix.length; j++)
                if (adjacencyMartix[i][j])
                    edges++;
    }
    return edges;
};

export const getAdjacencyMatrixByAdjacencyList = (adjacencyList) => {
    let adjacencyMatrix = [];
    adjacencyMatrix = Object.keys(adjacencyList).map(vertex => {
        let columns = adjacencyList[vertex];
        return Object.keys(adjacencyList).map(v => {
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
    return adjacencyMatrix;
};

export const getIncidenceMatrixByAdjacencyMatrix = (adjacencyMatrix, edgeNumber, isGraphOriented) => {
    let incidenceMatrix = [];
    for(let i = 0; i < adjacencyMatrix.length; i++) {
        incidenceMatrix.push((() => {
            let row = [];
            for (let t = 0; t < edgeNumber; t++) {
                row.push(0);
            }
            return row;
        })());
    }

    let k = 0;
    if(!isGraphOriented) {
        for(let i = 0; i < adjacencyMatrix.length; i++) {
            for(let j = i; j < adjacencyMatrix.length; j++) {
                if(adjacencyMatrix[i][j]) {
                    incidenceMatrix[i][k] = adjacencyMatrix[i][j];
                    if (i !== j) {
                        incidenceMatrix[j][k] = adjacencyMatrix[i][j];
                    }
                    k++;
                }
            }
        }
    } else {
        for(let i = 0; i < adjacencyMatrix.length; i++) {
            for(let j = 0; j < adjacencyMatrix.length; j++) {
                if(adjacencyMatrix[i][j]) {
                    if (i === j) {
                        incidenceMatrix[i][k] = adjacencyMatrix[i][j];
                    } else {
                        incidenceMatrix[i][k] = -adjacencyMatrix[i][j];
                        incidenceMatrix[j][k] = adjacencyMatrix[i][j];
                    }
                    k++;
                }
            }
        }
    }
    return incidenceMatrix;
};

export const getDegreeVector = (adjacencyMatrix, incidenceMatrix, coefficient) => {
    let degreeVector = [];
    for(let i = 0; i < incidenceMatrix.length; i++) {
        degreeVector.push(0);
        for(let j = 0; j < incidenceMatrix[i].length; j++) {
            if(incidenceMatrix[i][j] * coefficient > 0) {
                degreeVector[i] += incidenceMatrix[i][j] * coefficient;
            }
        }
    }
    if(coefficient === -1) {
        for(let i = 0; i < adjacencyMatrix.length; i++) {
            if(adjacencyMatrix[i][i] > 0) {
                degreeVector[i] += adjacencyMatrix[i][i];
            }
        }
    }
    return degreeVector;
};

export const getGraphMultiness = (adjacencyMatrix) => {
    let isMultigraph = false;
    for(let i = 0; i < adjacencyMatrix.length; i++) {
        for(let j = 0; j < adjacencyMatrix.length; j++) {
            if(adjacencyMatrix[i][j] > 1 || (adjacencyMatrix[i][j] === 1 && i === j)) {
                isMultigraph = true;
            }
        }
    }
    return isMultigraph;
};

export const getGraphFaked = (adjacencyMatrix) => {
    let isGraphFaked = false;
    for(let i = 0; i < adjacencyMatrix.length; i++) {
        for(let j = 0; j < adjacencyMatrix.length; j++) {
            if(adjacencyMatrix[i][j] === 1 && i === j) {
                isGraphFaked = true;
            }
        }
    }
    return isGraphFaked;
};

export const getLeafVector = (degreeVector1, degreeVector2) => {
    let leafVector = [];
    if (degreeVector2 === undefined) {
        degreeVector1.map((deg, i) => {
            if (deg === 1)
                leafVector.push(i + 1);
        });
    } else {
        degreeVector1.map((deg, i) => {
            if (deg + degreeVector2[i] === 1)
                leafVector.push(i + 1);
        });
    }
    return leafVector;
};

export const getMatrixSum = (matrix1, matrix2) => {
    let newMatrix = [];
    for(let i = 0; i < matrix1.length; i++) {
        newMatrix.push([]);
        for(let j = 0; j < matrix2.length; j++) {
            newMatrix[i].push(matrix1[i][j] + matrix2[i][j]);
        }
    }
    return newMatrix;
};

export const getMatrixComposition = (matrix1, matrix2) => {
    let newMatrix = [];
    for(let i = 0; i < matrix1.length; i++) {
        newMatrix.push([]);
        for(let j = 0; j < matrix2.length; j++) {
            newMatrix[i].push(0);
            for(let t = 0; t < matrix1.length; t++) {
                newMatrix[i][j] += matrix1[i][t] * matrix2[t][j];
            }
        }
    }
    return newMatrix;
};

export const getMatrixNDegree = (matrix, n) => {
    let newMatrix = matrix;
    for (let i = 1; i < n; i++) {
        newMatrix = getMatrixComposition(newMatrix, matrix);
    }
    return newMatrix;
};

export const getDistanceMatrix = (matrix, n) => {
    let distanceMatrix = matrix;
    for (let i = 2; i < n; i++) {
        distanceMatrix = getMatrixSum(distanceMatrix, getMatrixNDegree(matrix, i));
    }
    return distanceMatrix;
};

export const getEnclosedDistanceMatrix = (matrix, n) => {
    let distanceMatrix = matrix;
    for (let i = 2; i <= n; i++) {
        distanceMatrix = getMatrixSum(distanceMatrix, getMatrixNDegree(matrix, i));
    }
    return distanceMatrix;
};

export const getGraphByAdjacencyList = (adjacencyList) => {
    let nodes = [];
    let edges = [];
    Object.keys(adjacencyList).map((vertex, i) => {
        nodes.push({id: i, label: vertex, color: "#00e1ff"});
        adjacencyList[vertex].map(aimVertex => edges.push({from: i, to: Object.keys(adjacencyList).indexOf(aimVertex)}));
    });
    return {nodes: nodes, edges: edges};
};
