import './Maze.css';
import { Component } from "react";

import Cells from './Cells';

class Maze extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cells: [],
            numberCells: 0
        };

        this.generateColumnString = this.generateColumnString.bind(this);
        this.generateGrid = this.generateGrid.bind(this);
    }

    componentDidMount() {
        const grid = this.generateGrid(this.props.columnSize, this.props.gridWidth, this.props.columns);
        this.setState({
            grid
        });
    }
    
    generateColumnString(columnSize, columns) {
        return Array.from(new Array(columns), () => `${columnSize}px`).join(' ');
    }

    generateGrid(columnSize, gridWidth, columns) {
        const columnString = this.generateColumnString(columnSize, columns);
        return {
            width: gridWidth,
            gridTemplateColumns: columnString,
            // A square maze, so the same values
            gridTemplateRows: columnString
        };
    }

    render() {
        return (
            <div className="maze" style={this.state.grid}>
                <Cells columns={this.props.columns} />
            </div>
        )
    }
};

export default Maze;