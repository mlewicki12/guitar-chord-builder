
import React from 'react';
import BaseComponent from './BaseComponent.js';
import NoteSelector from './NoteSelector.js';
import ChordBuilder from './ChordBuilder.js';

import ChordFinder from '../ChordFinder.js';
import Variables from '../Variables.js';

export default class ChordSelector extends BaseComponent {
    ChordFinder = new ChordFinder();

    constructor(props) {
        super(props);

        this.state = {
            strings: Variables.defaultTuning,
            chord: Variables.defaultChord,
            chordMode: "chord",
            displayMode: "input",
            chordNote: "G",
            chordIsMinor: false
        };
    }

    render() {
        let buildChord = (chordNote, chordIsMinor) => {return this.ChordFinder.buildChord(chordNote, [1, 3, 5], chordIsMinor);}

        return (
            <React.Fragment>
                {this.state.displayMode === "input" &&
                    <div className="flex-column">
                        <div className="flex-column" id="tuning-selector">
                            <p>Tuning</p>
                            <NoteSelector notes={this.state.strings} maxStrings={12} onChange={(state) => this.update({strings: state.notes})}/>
                        </div>

                        <div className="flex-column" id="chord selector">
                            <p>Chord</p>
                            <select id="mode-selector" onChange={(event) => this.update({chordMode: event.target.value})}>
                                <option value="chord">Chord Mode</option>
                                <option value="note">Note Mode</option>
                            </select>
                            {this.state.chordMode === "note" ?
                                <NoteSelector notes={this.state.chord} key={this.state.chord} text={"note"} onChange={(state) => this.update({chord: state.notes})}/>  :
                                <div>
                                    <select id="chord-note-selector" defaultValue={this.state.chordNote}
                                            onChange={(event) => this.update({chordNote: event.target.value, chord: buildChord(event.target.value, this.state.chordIsMinor)})}>
                                        {Variables.notes.map(note => 
                                            <option value={note}>{note}</option>
                                        )}
                                    </select>
                                    <select id="chord-mode-selector" defaultValue={this.state.chordIsMinor} 
                                            onChange={(event) => this.update({chordIsMinor: event.target.value, chord: buildChord(this.state.chordNote, event.target.value)})}>
                                        <option value="major">Major</option>
                                        <option value="minor">Minor</option>
                                    </select>
                                </div>
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