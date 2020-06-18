
import React from 'react';
import BaseComponent from './BaseComponent.js';

export default class ChordDisplay extends BaseComponent {
    render() {
        let frets = this.props.frets.map(x => x === -1 ? "X" : x)
        return (
            <ul className="string-tab">
                {this.props.strings.map((val, index) => <li key={val}>{val}|--{frets[index]}{frets[index] > 9 ? "-" : "--"}---</li>)}
            </ul>
        )
    }
}