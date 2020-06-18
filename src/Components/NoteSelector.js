
import React from 'react';
import BaseComponent from './BaseComponent.js';
import Variables from '../Variables.js';

export default class NoteSelector extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            notes: this.props.notes || Variables.defaultTuning
        };
    }

    addString() {
        let len = this.state.notes.length;
        let note = "E";
        if(len < 6) {
            note = Variables.defaultTuning[len];
        } else {
            note = Variables.getPerfectFourth(this.state.notes[len-1]);
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
                            {Variables.notes.map(val =>
                                <option value={val} key={val}>{val}</option>
                            )}
                        </select>
                    ))}
                </div>
                <div>
                    <button onClick={() => this.addString()} disabled={this.state.notes.length >= this.props.maxStrings}>Add a {this.props.text || "string"}</button> 
                    <button onClick={() => this.removeString()} disabled={this.state.notes.length === 1}>Remove a {this.props.text || "string"}</button> 
                </div>
            </React.Fragment>
        );
    }
}