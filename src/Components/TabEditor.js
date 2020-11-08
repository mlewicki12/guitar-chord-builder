
import React from 'react';
import BaseComponent from './BaseComponent';
import Menu from './Navigation/Menu';

let Keybinds = {
    Actions: [
        {keys: ["ArrowUp", "W"], func: (editor) => editor.changePosition([-1, 0])},
        {keys: ["ArrowDown", "S"], func: (editor) => editor.changePosition([1, 0])},
        {keys: ["ArrowLeft", "A"], func: (editor) => editor.changePosition([0, -1])},
        {keys: ["ArrowRight", "D"], func: (editor) => editor.changePosition([0, 1])},

        {keys: ["Backspace", "Delete"], func: (editor) => editor.delete()},
        {keys: [" "], func: (editor) => editor.advance()},
    ],

    AllowedChars: "1234567890xhps/\\^b"
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
        if(this.state.focus === false) {
            return;
        }

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
        // kill the function if we're not in focus
        if(this.state.focus === false) {
            return;
        }

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

        this.changePosition(offset);
    }

    insert(val) {
        let string = this.state.position[0];
        let column = this.state.position[1];

        let mod = (map) => {
            map[string] = map[string].filter(val => val.position !== column);
            map[string].push({position: column, symbol: val});
            map[string].sort(mapEntrySort);

            return map;
        }

        this.changeMap(mod, [0, 1]);
        this.setState({
            length: this.state.length + 1
        });
    }

    delete() {
        let string = this.state.position[0];
        let column = this.state.position[1];

        let mod = (map) => {
            map[string] = map[string].filter(val => val.position !== column);
            map[string].forEach(val => {
                if(val.symbol === "|") return
                if(val.position < column) return

                val.position -= 1;
            });

            let newLength = this.state.length - 1;
            if(newLength < this.state.default_length) {
                newLength = this.state.default_length;
            }

            this.update({
                length: newLength
            });

            return map;
        }

        this.changeMap(mod, [0, -1]);
    }

    advance() {
        let string = this.state.position[0];
        let column = this.state.position[1];

        let mod = (map) => {
            let max = -1;
            map[string].forEach(val => {
                if(val.symbol === "|") return
                if(val.position < column) return

                val.position += 1;
                if(val.position > max) {
                    max = val.position;
                }
            });

            let newLength = this.state.length + 1;
            if(max > this.state.length) {
                newLength = max;
            } else if(max === this.state.length) {
                newLength = max + 1;
            }

            this.update({
                length: newLength
            });
            return map;
        }


        this.changeMap(mod, [0, 1]);
    }

    reset() {
        this.update(this.initialState(this.props));
    }

    initialState(props) {
        let map = [];
        for(var i = 0; i < this.props.strings.length; ++i) {
            map.push([]);
        }

        let default_length = 25;
        return {
            position: [0, 0],
            default_length: props.default_length || default_length,
            length: props.length || props.default_length || default_length,
            cursor: props.cursor || '|',
            interval: props.interval || 400,
            focus: false,
            map: map,
            displayMode: 'input',
            strings: props.strings
        };
    }

    constructor(props) {
        super(props);

        this.blinkerFunction = this.blinkerFunction.bind(this);
        this.tabControls = this.tabControls.bind(this);
        this.reset = this.reset.bind(this);
        this.focus = this.focus.bind(this);

        this.state = this.initialState(props);
    }

    componentDidMount() {
        document.addEventListener("keydown", this.tabControls, false);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.tabControls, false);
    }

    changePosition(mod) {
        let position = [this.state.position[0] + mod[0], this.state.position[1] + mod[1]]
        let length = this.state.length;

        if(position[0] < 0) position[0] = 0;
        if(position[0] > this.props.strings.length) position[0] = this.props.strings.length;

        if(position[1] < 0) position[1] = 0;
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

    focus(isFocus) {
        this.setState({
            focus: isFocus
        });
    }

    render() {
        console.log(this.state.strings);
        return (
            <React.Fragment>
                {this.state.displayMode === "input" ?
                    <Menu config={this.menuConfig} onChange={(state) => this.update(state)} /> :
                    <div class="tab-builder" onClick={() => this.focus(!this.state.focus)}>
                        <ul className="string-tab">
                            {this.state.strings.map((val, index) => <li key={val}>{val} |{fillTab(this.state.length, this.state.map[index])}</li>)}
                        </ul>
                        <button onClick={this.reset}>Reset</button>
                    </div>}
            </React.Fragment>
        )
    }

    menuConfig = 
    [
        {
            id: "tuning-selector",
            title: "Tuning",
            components: [
                {
                    type: "NoteSelector",
                    notes: ['E', 'B', 'G', 'D', 'A', 'E'],
                    maxStrings: 12,
                    key: "strings"
                }
            ]
        },
        {
            id: "submit-button",
            components: [
                {
                    type: "Button",
                    text: "Submit",
                    onClick: () => this.update({displayMode: "tabs"})
                } 
            ]
        }
    ]
}