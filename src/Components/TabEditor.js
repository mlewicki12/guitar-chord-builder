
import React from 'react';
import BaseComponent from './BaseComponent.js';

function fillTab(length, stringNum, position) {
    if(position[0] === stringNum) {
        return '-'.repeat(position[1]) + '|' + '-'.repeat(length - position[1]); 
    }

    return '-'.repeat(length + 1);
}

export default class TabEditor extends BaseComponent {
    blinkerFunction() {
        this.update({
            oldString: this.state.position[0],
            position: [this.state.oldString, this.state.position[1]]    
        })
    }

    constructor(props) {
        super(props);
        this.blinkerFunction = this.blinkerFunction.bind(this);

        this.state = {
            position: [0, 0],
            length: props.length || 10,
            oldString: -1,
            blinker: setInterval(this.blinkerFunction, this.props.interval || 500)
        }
    }

    changePosition(mod) {
        clearInterval(this.state.blinker);

        if(this.state.position[0] === -1) {
            this.state.position[0] = this.state.oldString;
        }

        let position = [this.state.position[0] + mod[0], this.state.position[1] + mod[1]]
        let length = this.state.length;

        if(position[0] < 0) position[0] = 0;
        if(position[1] < 0) position[1] = 0;
        if(position[0] > this.props.strings.length) position[0] = this.props.strings.length;
        if(position[1] > this.state.length) length += 1;

        this.update({
            position: position,
            oldString: -1,
            length: length,
            blinker: setInterval(this.blinkerFunction, this.props.interval || 500)
        });
    }

    render() {
        return (
            <React.Fragment>
                <ul className="string-tab">
                    {this.props.strings.map((val, index) => <li key={val}>{val} |{fillTab(this.state.length, index, this.state.position)}</li>)}
                </ul>
                <button onClick={() => this.changePosition([0, -1])}>&lt;=</button>
                <button onClick={() => this.changePosition([-1, 0])}>^^</button>
                <button onClick={() => this.changePosition([1, 0])}>vv</button>
                <button onClick={() => this.changePosition([0, 1])}>=&gt;</button>
            </React.Fragment>
        )
    }
}