import { Component } from "react";

import Cell from './Cell';

const BASE_CLASS = 'maze-cell';
const DOOR_CLASSES = {
    DOWN: 'down-door',
    LEFT: 'left-door',
    RIGHT: 'right-door',
    UP: 'up-door'
};
const EXIT_CLASS = 'exit-cell';
const SHROUDED_CLASS = 'shrouded-cell';

const N = 1 << 0;
const E = 1 << 1;
const S = 1 << 2;
const W = 1 << 3;

class Cells extends Component {
    constructor(props) {
        super(props);

        this.state = { cells: [] };

        this.generateCellClass = this.generateCellClass.bind(this);
        this.generateCells = this.generateCells.bind(this);
        this.getCellNeighbors = this.getCellNeighbors.bind(this);
        this.getDoor = this.getDoor.bind(this);
        this.getExit = this.getExit.bind(this);
        this.mapCell = this.mapCell.bind(this);
        this.mapCells = this.mapCells.bind(this);
        this.mutateCell = this.mutateCell.bind(this);
        this.setCellClicked = this.setCellClicked.bind(this);
        this.setCellClickedMutation = this.setCellClickedMutation.bind(this);
        this.setDoorOpened = this.setDoorOpened.bind(this);
        this.setDoorOpenedMutation = this.setDoorOpenedMutation.bind(this);
    }

    componentDidMount() {   
        const columns = this.props.columns;
        const numberOfCells = columns * columns;
        const door = this.getDoor();
        // Should ideally make this generateCells just the initial cells
        // Then it doesn't matter if we have door or exit because we'll just modify stuff later
        const [cells, exit] = this.getExit(door, this.generateCells(door, numberOfCells));

        const doorCell = cells[door];
        const doorId = doorCell.id;
        const exitId = exit.id;

        for (const cell of cells) {
            const cellId = cell.id;
            cell.cellClass = this.generateCellClass(cellId, doorId, exitId, cell.walls);
        }
        this.setState({
            cells,
            door,
            exit,
            numberOfCells
        });
    }

    generateCellClass(id, doorId, exitId, cellWalls) {
        const cellBase = `${BASE_CLASS} cell-${id}`;

        /*
        const DIRECTION_CLASS_MAP = {
            [N] : !cellWalls[N],
            [E] : !cellWalls[E],
            [S] : !cellWalls[S],
            [W] : !cellWalls[W]
        };
        */

        const isDoor = id === doorId;
        const isExit = id === exitId;
        const visible = id === doorId;

        /*
        const CELL_DOORS = {
            [N] : !cellWalls[N],
            [E] : !cellWalls[E],
            [S] : !cellWalls[S],
            [W] : !cellWalls[W]
        };
        */

        if (!visible) {
            return `${cellBase} ${SHROUDED_CLASS}`;
        }

        if (isDoor) {
            return `${cellBase} ${DOOR_CLASSES.LEFT}`;
        }

        if (isExit) {
            const exitBase = `${cellBase} ${EXIT_CLASS}`
            return visible ? exitBase
                           : `${exitBase} ${SHROUDED_CLASS} `;
        }

        return cellBase;
    }

    // door is parameterized since we haven't decorated it onto the state yet
    generateCells(door, cellCount) {
        const columns = Math.sqrt(cellCount);
        const isLeftWall = index => index % columns === 0;
        const isTopWall = index => index < columns;
        const isRightWall = index => index % columns === (columns - 1);
        const isBottomWall = index => index > (index * (columns - 1));
        return Array.from(
            new Array(cellCount),
            (_, index) => {
                const id = index;
                const isDoor = id === door;
                const isExit = false; //id === exit;
                const visible = false; //id === door;

                const neighbors = this.getCellNeighbors(id, columns);
                const walls = {
                    [N]: true,
                    [E]: true,
                    [S]: true,
                    [W]: true
                };

                return {
                    cellClass: "",
                    doorOpen: false,
                    id,
                    isDoor,
                    isExit,
                    neighbors,
                    visible,
                    walls
                };                
            }
        );
    }

    getCellNeighbors(id, columns) {        
        const isLeftWall = index => index % columns === 0;
        const isTopWall = index => index < columns;
        const isRightWall = index => index % columns === (columns - 1);
        const isBottomWall = index => index >= (columns * (columns - 1));

        const thisN = isTopWall(id) ? null : id - columns;
        const thisE = isRightWall(id) ? null : id + 1;
        const thisS = isBottomWall(id) ? null : id + columns;
        const thisW = isLeftWall(id) ? null : id - 1;

        return {
            [N]: thisN,
            [E]: thisE,
            [S]: thisS,
            [W]: thisW
        };
    }

    getDoor() {
        // hardcode bottom-left cell as door cell
        return this.props.columns * (this.props.columns - 1);
    }

    getExit(door, cells) {
        // hardcode top-right cell as exit cell
        // return this.props.columns - 1;

        const visited = [];
        const queue = [];
        let exit = null;
        const getOpposite = direction => direction === N ? S 
                                                         : (direction === E ? W
                                                                            : (direction === S ? N
                                                                                               : E));
        const mapNeighbors = cell => Object.keys(cell.neighbors).filter(k => cell.neighbors[k] != null).map(k => ({ key: k, value: cell.neighbors[k]}));
        const notContained = values => values.filter(kv => !visited.includes(kv.value));
        const randomChoose = arr => {
            const index = Math.floor(Math.random() * arr.length);

            return [arr[index].key, arr[index].value];
        };
        // start here
        let direction = null;
        let lastCell = null;
        let cellId = door;
        let cell = cells[cellId];
        queue.push(cell);
        visited.push(cellId);
        while (true) {          
            console.log('Loop starting with cell: ', cell);
            console.log('Cell neighbors: ', cell.neighbors); 
            const neighborIds = mapNeighbors(cell);
            let newIds = notContained(neighborIds);

            // unwind until we find one without a visited neighbor, or finish when none are left
            if (newIds.length === 0 && queue.length > 0) {
                cell = queue.pop();
                if (exit == null) {
                    exit = cell;
                }
                cellId = cells.findIndex(c => c.id === cell.id);
                continue;
            } else if (newIds.length === 0 && queue.length === 0) {
                break;
            }

            lastCell = cell;
            [direction, cellId] = randomChoose(newIds);
            cell = cells[cellId];
            if (lastCell.walls[direction] === true) {
                lastCell.walls[direction] = false;
            }

            const opposite = getOpposite(direction);

            if (cell.walls[opposite] === true) {
                cell.walls[opposite] = false;
            }

            queue.push(cell); 
            visited.push(cellId);
        }

        // Cells have had their walls broken down in the process of generating the maze, return the new state
        return [cells, exit];
    }

    mapCell(cell) {
        const onDoorClicked = () => this.setDoorOpened(cell.id);
        const onClicked = () => this.setCellClicked(cell.id);
        return <Cell key={cell.id} {...cell} onDoorClicked={onDoorClicked} onClicked={onClicked} />
    }

    mapCells(cells) {
        return cells.map(this.mapCell);
    }

    mutateCell(state, id, mutation) {
        const cells = state.cells;
        const index = cells.findIndex(c => c.id === id);

        const copy = mutation({ ...cells[index] });

        const cellsCopy = [...state.cells];
        cellsCopy[index] = copy;

        return cellsCopy;
    }

    setCellClicked(id) {
        this.setState(previousState => ({
            cells: this.mutateCell(previousState, id, this.setCellClickedMutation)
        }));
    }

    setCellClickedMutation(cell) {
        return {
            ...cell,
            cellClass: this.generateCellClass(cell.id, cell.isDoor, cell.isExist, !cell.visible),
            visible: !cell.visible
        };
    }

    setDoorOpened(id) {
        this.setState(previousState => ({
            cells: this.mutateCell(previousState, id, this.setDoorOpenedMutation)
        }));
    }

    setDoorOpenedMutation(cell) {
        return {
            ...cell,
            doorOpen: !cell.doorOpen
        };
    }

    render() {
        return (
            <>
                { this.mapCells(this.state.cells) }
            </>
        );        
    }
};

export default Cells;