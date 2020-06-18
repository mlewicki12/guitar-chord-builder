
import React from 'react';
import BaseComponent from './BaseComponent.js';

let Keybinds = {
    Actions: [
        {keys: ["ArrowUp", "W"], func: (editor) => editor.changePosition([-1, 0])},
        {keys: ["ArrowDown", "S"], func: (editor) => editor.changePosition([1, 0])},
        {keys: ["ArrowLeft", "A"], func: (editor) => editor.changePosition([0, -1])},
        {keys: ["ArrowRight", "D"], func: (editor) => editor.changePosition([0, 1])},

        {keys: ["Backspace", "Delete"], func: (editor) => editor.delete()},
        {keys: [" "], func: (editor) => editor.advance()},
    ],

    AllowedChars: "1234567890xhp/\\^b"
};

function fillTab(length, map) {
    let ret = "";
    let symbols = map.map(val => val.symbol);   
    let indices = map.map(val => val.position);
    let position = 0;                           

    for(var i = 0; i < length; ++i) {
        if(i === indices[position]) {
            ret += symbols[position];
            while(indices[position] === i) {
                position += 1;
            }
        } else ret += '-';
    }

    return ret;
}

function clearTabBlinker(map, cursor) {
    return map.filter(val => val.symbol !== cursor);
}

function mapEntrySort(f, o) {
    if(f.position < o.position) { // if f comes before o
        return -1;
    } 
    
    if(f.position > o.position) { // if f comes after o
        return 1;
    }

    if(f.symbol === "|") return -1; // is f a pipe
    if(o.symbol === "|") return  1; // is o a pipe

    return -1; // whatever, f comes first, should never be reached
}

export default class TabEditor extends BaseComponent {
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
        let action = Keybinds.Actions.find(val => val.keys.includes(event.key));
        if(action) {
            action.func(this);
        }

        if(Keybinds.AllowedChars.includes(event.key)) {
            this.insert(event.key);
        }
    }

    changeMap(func, offset) {
        let map = this.state.map;

        this.update({
            map: func(map)
        });

        this.changePosition(offset || [0, 1]);
    }

    insert(val) {
        let position = this.state.position;
        let mod = (map) => {
            map[position[0]] = map[position[0]].filter(val => val.position !== position[1]);
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
            map[position[0]].forEach(val => {
                if(val.symbol === "|") return
                if(val.position < position[1]) return

                val.position -= 1;
            })
            return map;
        }

        this.changeMap(mod, [0, -1]);
    }

    advance() {
        let position = this.state.position;
        let mod = (map) => {
            let max = -1;
            map[position[0]].forEach(val => {
                if(val.symbol === "|") return
                if(val.position < position[1]) return

                val.position += 1;
                if(val.position > max) {
                    max = val.position;
                }
            });

            if(max > this.state.length) {
                this.update({
                    length: max
                });
            } else if(max === this.state.length) {
                this.update({
                    length: max + 1
                });
            }

            return map;
        }


        this.changeMap(mod, [0, 0]);
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
            interval: props.interval || 400,
            map: map
        };
    }

    componentDidMount() {
        document.addEventListener("keydown", this.tabControls, false);

        this.update({
            blinker: setInterval(this.blinkerFunction, this.state.interval)
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
            blinker: setInterval(this.blinkerFunction, this.state.interval),
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