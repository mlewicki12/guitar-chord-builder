
import React from 'react';
import BaseComponent from './BaseComponent.js';

function fillTab(length, map) {
    let ret = "";
    let symbols = map.map(val => val.symbol);
    let indices = map.map(val => val.position);
    let position = 0;

    for(var i = 0; i < length; ++i) {
        if(i === indices[position]) {
            ret += symbols[position];
            position += 1;
        } else ret += '-';
    }

    return ret;
}

function clearTabBlinker(map, cursor) {
    return map.filter(val => val.symbol !== cursor);
}

export default class TabEditor extends BaseComponent {
    blinkerFunction() {
        let stringMap = this.state.map[this.state.position[0]];
        if(stringMap.find(val => val.symbol === this.state.cursor)) {
            stringMap = clearTabBlinker(stringMap, this.state.cursor);
        } else {
            stringMap.push({position: this.state.position[1], symbol: this.state.cursor});
            stringMap.sort((f, o) => f.position < o.position ? -1 : 1)
        }

        let map = this.state.map;
        map[this.state.position[0]] = stringMap;

        this.update({
            map: map
        })
    }

    constructor(props) {
        super(props);
        this.blinkerFunction = this.blinkerFunction.bind(this);

        let map = [];
        for(var i = 0; i < this.props.strings.length; ++i) {
            map.push([]);
        }

        this.state = {
            position: [0, 0],
            length: props.length || 10,
            cursor: props.cursor || '|',
            map: map
        };
    }

    componentDidMount() {
        this.update({
            blinker: setInterval(this.blinkerFunction, this.props.interval || 500)
        })
    }

    changePosition(mod) {
        let position = [this.state.position[0] + mod[0], this.state.position[1] + mod[1]]
        let length = this.state.length;

        if(position[0] < 0) position[0] = 0;
        if(position[1] < 0) position[1] = 0;
        if(position[0] > this.props.strings.length) position[0] = this.props.strings.length;
        if(position[1] > this.state.length) length += 1;

        clearInterval(this.state.blinker);
        let map = this.state.map;
        map[position[0]] = clearTabBlinker(map[position[0]], this.state.cursor);

        this.update({
            position: position,
            length: length,
            blinker: setInterval(this.blinkerFunction, this.props.interval || 500),
            map: map
        });
    }

    render() {
        return (
            <React.Fragment>
                <ul className="string-tab">
                    {this.props.strings.map((val, index) => <li key={val}>{val} |{fillTab(this.state.length, this.state.map[index])}</li>)}
                </ul>
                <button onClick={() => this.changePosition([0, -1])}>&lt;=</button>
                <button onClick={() => this.changePosition([-1, 0])}>^^</button>
                <button onClick={() => this.changePosition([1, 0])}>vv</button>
                <button onClick={() => this.changePosition([0, 1])}>=&gt;</button>
            </React.Fragment>
        )
    }
}