import logo from './logo.svg';
import './App.css';

import React from 'react';
import Maze from './Maze';

const COLUMN_SIZE = 100;
const CELL_HEIGHT = COLUMN_SIZE - 5;
const NUMBER_COLUMNS = 8;
const NUMBER_ROWS = NUMBER_COLUMNS;
const GRID_WIDTH = COLUMN_SIZE * NUMBER_COLUMNS;

function App() {
  return (
    <div className="App">
      <p>Hostile Mazes is powered by <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">React</a> and Create React App.</p>
      <Maze cellHeight={CELL_HEIGHT} columnSize={COLUMN_SIZE} columns={NUMBER_COLUMNS} gridWidth={GRID_WIDTH} rows={NUMBER_ROWS} />
    </div>
  );
}

export default App;
