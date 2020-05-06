
import React from 'react';
import { ChordFinderStatic, ChordBuilder } from './Chords.js';

class ConfigBase extends React.Component {
    update(state) {
        this.props.onChange && this.props.onChange(state);
        this.setState(state);
    }
}

export class NoteSelector extends ConfigBase {
    constructor(props) {
        super(props);

        this.state = {
            notes: this.props.notes || ["E", "B", "G", "D", "A", "E"]
        };
    }

    addString() {
        let len = this.state.notes.length;
        let note = "E";
        if(len < 6) {
            note = ChordFinderStatic.defaultTuning[len];
        } else {
            note = ChordFinderStatic.getPerfectFourth(this.state.notes[len-1]);
        }


        let newNotes = this.state.notes.concat([note]);
        debugger;
        this.update({notes: newNotes});
    }

    removeString() {
       let notes = this.state.notes;
       notes.pop();
       
       this.update({notes: notes});
    }

    render() {
        return (
            <React.Fragment>
                <div className="flex-row">
                    {this.state.notes.map((string, ind) => (
                        <select id={"string-" + ind} key={"string-" + ind} defaultValue={string} onChange={(event) => {
                                let notes = this.state.notes;
                                notes[event.target.attributes.id.value.replace("string-", "")] = event.target.value;
                                this.update({notes: notes});
                                }}>
                            {ChordFinderStatic.notes.map(val =>
                                <option value={val} key={val}>{val}</option>
                            )}
                        </select>
                    ))}
                </div>
                <div>
                    <button onClick={() => this.removeString()} disabled={this.state.notes.length === 1}>-</button> 
                    <button onClick={() => this.addString()} disabled={this.state.notes.length >= this.props.maxStrings}>+</button> 
                </div>
            </React.Fragment>
        );
    }
}

export class ChordConfig extends ConfigBase {
    constructor(props) {
        super(props);

        this.state = {
            strings: ChordFinderStatic.defaultTuning,
            chord: ["G", "B", "D"],
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

export default ChordConfig;