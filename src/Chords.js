
import React from 'react';

export class ChordFinder {
    notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
    defaultTuning = ["E", "B", "G", "D", "A", "E"];

    constructor(stringNotes, chord) {
        this.setInfo(stringNotes, chord);
    }

    setInfo(stringNotes, chord) {
        if(stringNotes && chord) {
            this.strings = [];
            stringNotes.forEach(val => this.strings.push(this.getStringNotes(val)));
            this.strings = this.strings.map(val => val.filter(x => chord.includes(x.note) || x.note === "M"));
        }
    }

    getStringNotes(note, range) {
        let ind = this.find(note);
        range = range || 12;
        let ret = [];
        for(var i = 0; i < range; ++i) {
            ret.push({note: this.notes[ind % this.notes.length], fret: i});
            ind += 1;
        }

        ret.push({note: "M", fret: -1});
        return ret;
    }

    getRange(arr) {
        let min = 13, max = -1;
        arr.forEach(val => {
            if(val < min) {
                min = val;
            }

            if(val > max) {
                max = val;
            }
        });

        return max - min;
    }

    findAll(chord, notes) {
        let ret = true;

        notes.forEach(val => {
            if(!chord.find(x => x === val)) {
                ret = false;
            }
        });

        return ret;
    }

    buildChords(chord, chordNotes, range, strings) {
        let ret = [];
        strings = strings || this.strings;

        if(strings.length < 1) {
            let chordF = chord.map(x => x.fret)
            if((Math.abs(this.getRange(chordF.filter(x => x !== 0))) < range) && // within fingering range ( ͡° ͜ʖ ͡°)
               (this.findAll(chord.map(x => x.note), chordNotes))             && // can find all notes within chord
               (chordF.find(x => x !== -1)))                                     // not made up only of mutes
                return chordF;
            else return undefined;
        }

        strings[0].forEach(val => ret.push(chord.concat(val)));
        return ret.map(val => this.buildChords(val, chordNotes, range, strings.slice(1))).filter(val => val !== undefined && val.length > 0);
    }

    find(note) {
        return this.notes.findIndex(e => e === note.toUpperCase());
    }

    flat(note) {
        let ind = this.find(note);
        ind = (ind - 1) === -1 ? this.notes.length - 1 : (ind - 1);

        return this.notes[ind];
    }

    sharp(note) {
        let ind = this.find(note);
        ind = (ind + 1) % this.notes.length;

        return this.notes[ind];
    }

    getPerfectFourth(note) {
        let scale = this.buildScale(note);
        return scale[4];
    }

    majorSteps = [2, 2, 1, 2, 2, 2, 1];
    minorSteps = [2, 1, 2, 2, 1, 2, 2];
    buildScale(note, minor) {
        let steps = minor ? this.minorSteps : this.majorSteps;
        let ind = this.notes.findIndex(e => e === note.toUpperCase());
        let notes = [this.notes[ind]];
        steps.forEach(step => {
            ind = (ind + step) % this.notes.length;
            notes.push(this.notes[ind]);
        });

        return notes;
    }

    buildChord(note, shape, minor) {
        let scale = this.buildScale(note, minor);
        let ret = [];
        shape.forEach(val => {
            ret.push(scale[(val - 1) % (scale.length - 1)])});

        return ret;
    }

    buildBasicChord(note, minor) {
        return this.buildChord(note, [1, 3, 5], minor);
    }
}

export var ChordFinderStatic = new ChordFinder();

class ChordDisplay extends React.Component {
    render() {
        let frets = this.props.frets.map(x => x === -1 ? "X" : x)
        return (
            <ul className="string-tab">
                {this.props.strings.map((val, index) => <li key={val}>{val}|--{frets[index]}{frets[index] > 9 ? "-" : "--"}---</li>)}
            </ul>
        )
    }
}

export class ChordBuilder extends React.Component {
    constructor(props) {
        super(props);

        this.finder = new ChordFinder(['e', 'B', 'G', 'D', 'A', 'E'], ["G", "B", "D"]);
        let chords = [];
        let chordsTemp = this.finder.buildChords([], this.props.chord, this.props.range);

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
            <React.Fragment>
                <div className="flex-row">
                    {this.state.chords.slice(
                        this.state.page * this.props.size,
                        (this.state.page + 1) * this.props.size
                    ).map(val => <ChordDisplay key={val} strings={this.props.strings} frets={val} />)}
                </div>
                <div className="flex-row">
                    <button onClick={() => this.setState({page: 0})} disabled={this.state.page === 0}>First</button>
                    <button onClick={() => this.setState({page: Math.max(this.state.page - 1, 0)})} disabled={this.state.page === 0}>Previous</button>
                    <button onClick={() => this.setState({page: Math.min(this.state.page + 1, maxPage)})} disabled={this.state.page === maxPage}>Next</button>
                    <button onClick={() => this.setState({page: maxPage})} disabled={this.state.page === maxPage}>Last</button>
                </div>
                <p>Page {this.state.page + 1} of {Math.floor(this.state.chords.length / this.props.size) + 1}</p>
            </React.Fragment>
        );
    }
}

export default ChordBuilder;