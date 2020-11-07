
import React from 'react'
import BaseComponent from '../BaseComponent';
import NoteSelector from "../NoteSelector";

export default class Menu extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            // state needs to be defined here so I can use it
        };
    }

    fillKey(key, value) {
        var newObj = {};
        newObj[key] = value;
        return newObj;
    }

    defineMenuSection(details) {
        // kinda iffy but this should stop conditional components from displaying title if they aren't drawing
        var sections = details.components.map(comp =>
                          this.defineMenuComponent(comp)).filter(val => val !== null);

        if(sections.length > 0) {
            return (
                <div className={"flex-column " + details.className} id={details.id}>
                    {details.title && <h3>{details.title}</h3>}
                    {sections}
                </div>
            )
        }
    }

    defineMenuComponent(details) {
        switch(details.type) {
            case 'NoteSelector':
                return this.defineNoteSelectorComponent(details);

            case 'Radio':
                return this.defineRadioComponent(details);

            case 'Conditional':
                return this.defineConditionalComponent(details);

            case 'Select':
                return this.defineSelectComponent(details);

            case 'Button':
                return this.defineButtonComponent(details);

            default:
                // not sure how returning null works,
                // so doing this for now
                return (<React.Fragment></React.Fragment>)
        }
    }

    defineSelectComponent(details) {
       return (
          <select defaultValue={details.defaultValue}
            onChange={(event) => {
                this.update(this.fillKey(details.key, event.target.value));
            }}>
              {details.options.map(option => 
                  <option value={option.value || option.name.toLowerCase()}>{option.name}</option>
              )}
          </select>
       );
    }

    defineButtonComponent(details) {
        return (
            <button onClick={details.onClick}>{details.text}</button>
        );
    }

    defineConditionalComponent(details) {
        var view = details.getView(this.state);
        if(view) {
          return details[view].map(section => this.defineMenuSection(section));
        }

        return null;
    }

    defineRadioComponent(details) {
        return (
            <div className="center flex-row">
              {details.options.map(option => 
                  <React.Fragment>
                      <input type="radio" id={option.value || option.name.toLowerCase()} value={option.value || option.name.toLowerCase()} name={details.name} onClick={() => {
                          this.update(this.fillKey(details.key, option.value || option.name.toLowerCase()));
                      }} />
                      <label for={option.value || option.name.toLowerCase()}>{option.name}</label>
                  </React.Fragment>
              )}
            </div>
        );
    }

    // the purpose of this class is to take an object and define a menu around it
    defineNoteSelectorComponent(details) {
        return (
            <NoteSelector notes={details.notes} maxStrings={12} onChange={(state) => {
                this.update(this.fillKey(details.key, state.notes)); 
            }}/>
        )    
    }

    render() {
        return this.props.config.map(section => this.defineMenuSection(section));
    }
}