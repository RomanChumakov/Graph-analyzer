export const getGraphOrientation = (adjacencyMartix) => {
    for(let i = 0; i < adjacencyMartix.length; i++)
        for(let j = i + 1; j < adjacencyMartix.length; j++)
            if (adjacencyMartix[i][j] !== adjacencyMartix[j][i])
                return true;
}

export const getEdgesNumber = (adjacencyMartix, isGraphOriented) => {
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
}

export const getAdjacencyMatrixByConnectivityList = (connectivityList) => {
    let adjacencyMatrix = [];
    adjacencyMatrix = Object.keys(connectivityList).map(vertex => {
        let columns = connectivityList[vertex];
        return Object.keys(connectivityList).map(v => {
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
}

export const getIncidenceMatrixByAdjacencyMatrix = (adjacencyMatrix, edgesNumber, isGraphOriented) => {
    let incidenceMatrix = [];
    for(let i = 0; i < adjacencyMatrix.length; i++) {
        incidenceMatrix.push((() => {
            let row = [];
            for (let t = 0; t < edgesNumber; t++) {
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
}

export const getDegreesVector = (adjacencyMatrix, incidenceMatrix, coefficient) => {
    let degreesVector = [];
    for(let i = 0; i < incidenceMatrix.length; i++) {
        degreesVector.push(0);
        for(let j = 0; j < incidenceMatrix[i].length; j++) {
            if(incidenceMatrix[i][j] * coefficient > 0) {
                degreesVector[i] += incidenceMatrix[i][j] * coefficient;
            }
        }
    }
    if(coefficient === -1) {
        for(let i = 0; i < adjacencyMatrix.length; i++) {
            if(adjacencyMatrix[i][i] > 0) {
                degreesVector[i] += adjacencyMatrix[i][i];
            }
        }
    }
    return degreesVector;
}
