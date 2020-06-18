
import React from 'react';
import BaseComponent from './BaseComponent.js';
import NoteSelector from './NoteSelector.js';
import ChordBuilder from './ChordBuilder.js';

import Variables from '../Variables.js';

export default class ChordSelector extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            strings: Variables.defaultTuning,
            chord: Variables.defaultChord,
            chordMode: "chord",
            displayMode: "input"
        };
    }

    updateStrings(notes) {
        this.update({strings: notes});
    }

    updateChord(notes) {
        this.update({chord: notes});
    }

    render() {
        return (
            <React.Fragment>
            {this.state.displayMode === "input" &&
                <div className="flex-column">
                    <div className="flex-column" id="tuning-selector">
                        <p>Tuning</p>
                        <NoteSelector notes={this.state.strings} maxStrings={12} onChange={(state) => this.updateStrings(state.notes)}/>
                    </div>

                    <div className="flex-column" id="chord selector">
                        <p>Chord</p>
                        <select id="mode-selector" onChange={(event) => this.update({chordMode: event.target.value})}>
                            <option value="chord">Chord Mode</option>
                            <option value="note">Note Mode</option>
                        </select>
                        {this.state.chordMode === "note"              ?
                            <NoteSelector notes={this.state.chord} onChange={(state) => this.updateChord(state.notes)}/>  :
                            <p>Placeholder</p>
                            }
                    </div>

                    <button onClick={() => this.update({displayMode: "chords"})}>Submit</button>
                </div>
            }
            {this.state.displayMode === "chords" &&
                <ChordBuilder strings={this.state.strings} chord={this.state.chord} range={5} size={20} />
            }
            </React.Fragment>
        )       
    }
}