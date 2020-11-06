
import React from 'react';
import BaseComponent from './BaseComponent.js';
import ChordDisplay from './ChordDisplay.js';

import ChordFinder from '../ChordFinder.js';

export default class ChordBuilder extends BaseComponent {
    constructor(props) {
        super(props);

        this.finder = new ChordFinder(props.strings, props.chord);
        let chords = [];
        let chordsTemp = this.finder.buildChords([], this.props.range);

        let stack = [chordsTemp];
        while(stack.length > 0) {
            let top = stack.pop();
            if(top.slice(1).find(val => Array.isArray(val))) {
                stack.push(top.slice(1));
            }

            if(isNaN(top[0])) {
                stack.push(top[0]);
            } else {
                chords.push(top);
            }
        }

        this.state = {chords: chords, page: 0}

    }

    render() {
        let maxPage = Math.floor(this.state.chords.length / this.props.size);
        return (
            <div className="chord-selector">
                <div className="center flex-row">
                    {this.state.chords.slice(
                        this.state.page * this.props.size,
                        (this.state.page + 1) * this.props.size
                    ).map(val => <ChordDisplay key={val} strings={this.props.strings} frets={val} />)}
                </div>
                <div>
                    <div className="center flex-row">
                        <button onClick={() => this.setState({page: 0})} disabled={this.state.page === 0}>First</button>
                        <button onClick={() => this.setState({page: Math.max(this.state.page - 1, 0)})} disabled={this.state.page === 0}>Previous</button>
                        <button onClick={() => this.setState({page: Math.min(this.state.page + 1, maxPage)})} disabled={this.state.page === maxPage}>Next</button>
                        <button onClick={() => this.setState({page: maxPage})} disabled={this.state.page === maxPage}>Last</button>
                    </div>
                    <p>Page {this.state.page + 1} of {Math.floor(this.state.chords.length / this.props.size) + 1}</p>
                </div>
            </div>
        );
    }
}