import { PureComponent } from 'react';
import './Cell.css';

import Center from './Center';
import Corner from './Corner';
import Door from './Door';
import Horizontal from './Horizontal';
import Vertical from './Vertical';

class Cell extends PureComponent {
    render() {
        return (
            <div key={this.props.id} className={this.props.cellClass} onClick={this.props.onClicked}>
                <Corner />
                <Horizontal />
                <Corner />
                { this.props.isDoor ? <Door open={this.props.doorOpen} onClick={this.props.onDoorClicked} /> : <Vertical /> }
                <Center id={this.props.id} />
                <Vertical />
                <Corner />
                <Horizontal />
                <Corner />
            </div>
        )
    }
}

export default Cell;