
import React from 'react';
import BaseComponent from './BaseComponent';
import Menu from './Navigation/Menu';
import ChordBuilder from './ChordBuilder';

import ChordFinder from '../ChordFinder';
import Variables from '../Variables';

export default class ChordSelector extends BaseComponent {
    ChordFinder = new ChordFinder();
    buildChord = (chordNote, chordIsMinor) => {return this.ChordFinder.buildChord(chordNote, [1, 3, 5], chordIsMinor);}

    initialState() {
        return {
            strings: Variables.defaultTuning,
            chord: Variables.defaultChord,
            chordMode: undefined,
            displayMode: "input",
            chordNote: "G",
            chordTonality: "major"
        };
    }

    constructor(props) {
        super(props);
        this.state = this.initialState()

        this.reset = this.reset.bind(this);

        this.addHook(["chordNote", "chordTonality"], (state) => this.update({chord: this.buildChord(state.chordNote, state.chordTonality === "minor")}));
    }

    reset() {
        this.setState(this.initialState());
    }

    render() {
        return (
            <React.Fragment>
                {this.state.displayMode === "input" &&
                    <Menu config={this.menuConfig} onChange={(state) => this.update(state)} />
                }
                {this.state.displayMode === "chords" &&
                    <ChordBuilder strings={this.state.strings} chord={this.state.chord} range={5} size={30} reset={this.reset}/>
                }
            </React.Fragment>
        )       
    }

    // defined at the bottom bc this takes a fuckton of space
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
            id: "chord-mode-selector",
            title: "Mode",
            components: [
                {
                    type: "Radio",
                    key: "chordMode",
                    default: "chord",
                    name: "mode",
                    class: "padding-child flex-row",
                    options: [
                        {
                            value: "chord",
                            name: "Chord",
                            class: "center flex-row"
                        },
                        {
                            value: "note",
                            name: "Note",
                            class: "center flex-row"
                        }
                    ]
                }
            ]
        },
        {
            id: "chord-selector",
            title: "Chord",
            components: [
                {
                    type: "Conditional",
                    getView: (state) => state.chordMode === null ? null : state.chordMode,
                    chord: [
                        {
                            id: "chord-note-selector",
                            components: [
                                {
                                    type: "Select",
                                    defaultValue: "g",
                                    key: "chordNote",
                                    options: Variables.notes.map(val => {return {
                                        name: val
                                    }})
                                }
                            ]
                        },
                        {
                            id: "chord-tonality-selector",
                            components: [
                                {
                                    type: "Select",
                                    defaultValue: "major",
                                    key: "chordTonality",
                                    options: [
                                        {
                                            value: "major",
                                            name: "Major"
                                        },
                                        {
                                            value: "minor",
                                            name: "Minor"
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    note: [
                        {
                            id: "chord-note-selector",
                            components: [
                                {
                                    type: "NoteSelector",
                                    notes: ['G', 'B', 'D'],
                                    maxStrings: 12,
                                    key: "chord"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: "submit-button",
            components: [
                {
                    type: "Button",
                    text: "Submit",
                    onClick: () => this.update({displayMode: "chords"})
                } 
            ]
        }
    ]
}