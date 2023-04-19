import React from 'react';
import './Door.css';

const BASE_CLASS = "cell-door";
const CLOSED_CLASS = "cell-door-closed";
const OPEN_CLASS = "cell-door-open";

const Door = ({open = false, onClick}) => {
    const MODIFIER = open ? OPEN_CLASS : CLOSED_CLASS;
    const name = `${BASE_CLASS} ${MODIFIER}`;
    return <div className={name} onClick={onClick}></div>
};

export default Door;