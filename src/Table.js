import React from 'react';
import './App.css';

function Table(props) {

    return (
        <div
            style = {{
                border: "1px solid black",
                marginTop: "5px",
                padding: "5px",
                paddingLeft: "15px",
                paddingRight: "15px",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <p>{props.title}</p>
            <table>
                {props.data.map(row => {
                        return (
                            <tr>
                                {
                                    row.map(vertex => {
                                        return (
                                            <td>
                                                {vertex}
                                            </td>
                                        );
                                    })
                                }
                            </tr>
                        );
                    })
                }
            </table>
        </div>
    );
}

export default Table;
