
import Variables from './Variables.js';

export default class ChordFinder {
    constructor(stringNotes, chord) {
        this.setInfo(stringNotes, chord);
    }

    setInfo(stringNotes, chord) {
        if(stringNotes && chord) {
            this.strings = [];
            stringNotes.forEach(val => this.strings.push(this.getStringNotes(val)));
            this.strings = this.strings.map(val => val.filter(x => chord.includes(x.note) || x.note === "M"));
            this.chord = chord;
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

    buildChords(chord, range, strings) {
        let ret = [];
        strings = strings || this.strings;

        if(strings.length < 1) {
            let chordF = chord.map(x => x.fret);
            if((Math.abs(this.getRange(chordF.filter(x => x !== 0))) < range) && // within fingering range ( ͡° ͜ʖ ͡°)
               (this.findAll(chord.map(x => x.note), this.chord))             && // can find all notes within chord
               (chordF.find(x => x !== -1) !== undefined))                                     // not made up only of mutes
                return chordF;
            else return undefined;
        }

        strings[0].forEach(val => ret.push(chord.concat(val)));
        return ret.map(val => this.buildChords(val, range, strings.slice(1))).filter(val => val !== undefined && val.length > 0);
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

    buildScale(note, minor) {
        let steps = minor ? Variables.minorSteps : Variables.majorSteps;
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