
import React from 'react';
import BaseComponent from './BaseComponent.js';

function fillTab(length, map) {
    let ret = "";
    let symbols = map.map(val => val.symbol);   // NOTE: if the blinker is on a value (like 4), it adds two elements to indices
    let indices = map.map(val => val.position); //       so the array is [1, 1, 4], and since the second 1 is never hit, position doesn't advance
    let position = 0;                           //       like it should and doesn't draw the following values
                                                //       possible ways to fix: save value under blinker before blinking, or priority for blinker and disallow duplicates

    for(var i = 0; i < length; ++i) {
        if(i === indices[position]) {
            debugger;
            ret += symbols[position];
            position += 1;
        } else ret += '-';
    }

    return ret;
}

function clearTabBlinker(map, cursor) {
    return map.filter(val => val.symbol !== cursor);
}

function mapEntrySort(f, o) {
    return f.position < o.position ? -1 : 1;
}

export default class TabEditor extends BaseComponent {
    allowedChars = "1234567890xhp/\\^b";
    
    blinkerFunction() {
        let stringMap = this.state.map[this.state.position[0]];
        if(stringMap.find(val => val.symbol === this.state.cursor)) {
            stringMap = clearTabBlinker(stringMap, this.state.cursor);
        } else {
            stringMap.push({position: this.state.position[1], symbol: this.state.cursor});
            stringMap.sort(mapEntrySort);
        }

        let map = this.state.map;
        map[this.state.position[0]] = stringMap;

        this.update({
            map: map
        })
    }

    tabControls(event) {
        if(event.key === "ArrowUp") {
            this.changePosition([-1, 0]);
        } else if(event.key === "ArrowDown") {
            this.changePosition([1, 0]);
        } else if(event.key === "ArrowRight") {
            this.changePosition([0, 1]);
        } else if(event.key === "ArrowLeft" || event.key === "Space") {
            this.changePosition([0, -1]);
        } else if(event.key === "Backspace" || event.key === "Delete") {
            this.delete();
        } else if(this.allowedChars.includes(event.key)) {
            this.insert(event.key);
        }
    }

    changeMap(func, offset) {
        let map = this.state.map;

        map = func(map);

        this.update({
            map: map
        });

        this.changePosition(offset || [0, 1]);
    }

    insert(val) {
        let position = this.state.position;
        let mod = (map) => {
            map[position[0]].push({position: position[1], symbol: val});
            map[position[0]].sort(mapEntrySort);

            return map;
        }

        this.changeMap(mod, [0, 1]);
    }

    delete() {
        let position = this.state.position;
        let mod = (map) => {
            map[position[0]] = map[position[0]].filter(val => val.position !== position[1]);
            return map;
        }

        this.changeMap(mod, [0, -1]);
    }

    constructor(props) {
        super(props);
        this.blinkerFunction = this.blinkerFunction.bind(this);
        this.tabControls = this.tabControls.bind(this);

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
        document.addEventListener("keydown", this.tabControls, false);

        this.update({
            blinker: setInterval(this.blinkerFunction, this.props.interval || 500)
        })
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.tabControls, false);
    }

    changePosition(mod) {
        let position = [this.state.position[0] + mod[0], this.state.position[1] + mod[1]]
        let length = this.state.length;

        if(position[0] < 0) position[0] = 0;
        if(position[1] < 0) position[1] = 0;
        if(position[0] > this.props.strings.length) position[0] = this.props.strings.length;
        if(position[1] >= this.state.length) length += 1;

        clearInterval(this.state.blinker);
        let map = this.state.map;
        map = map.map(val => clearTabBlinker(val, this.state.cursor));

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
            </React.Fragment>
        )
    }
}