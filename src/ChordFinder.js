
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
            ret.push({note: Variables.notes[ind % Variables.notes.length], fret: i});
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
               (chordF.find(x => x !== -1) !== undefined))                       // not made up only of mutes
                return chordF;
            else return undefined;
        }

        strings[0].forEach(val => ret.push(chord.concat(val)));
        return ret.map(val => this.buildChords(val, range, strings.slice(1))).filter(val => val !== undefined && val.length > 0);
    }

    find(note) {
        return Variables.notes.findIndex(e => e === note.toUpperCase());
    }

    flat(note) {
        let ind = this.find(note);
        ind = (ind - 1) === -1 ? Variables.notes.length - 1 : (ind - 1);

        return Variables.notes[ind];
    }

    sharp(note) {
        let ind = this.find(note);
        ind = (ind + 1) % Variables.notes.length;

        return Variables.notes[ind];
    }

    getPerfectFourth(note) {
        let scale = this.buildScale(note, false);
        return scale[4];
    }

    buildScale(note, steps) {
        // if it's a boolean, that means the caller wants a major/minor scale
        if(typeof steps === "boolean") {
            steps = steps ? Variables.minorSteps : Variables.majorSteps;
        }

        // otherwise we trust the steps they provided us
        let ind = Variables.notes.findIndex(e => e === note.toUpperCase());
        let notes = [Variables.notes[ind]];
        steps.forEach(step => {
            ind = (ind + step) % Variables.notes.length;
            notes.push(Variables.notes[ind]);
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