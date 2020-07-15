
import React from 'react';
import ChordSelector from './Components/ChordSelector.js';
import NavView from './Components/Navigation/NavView.js';
import TabEditor from './Components/TabEditor.js';

import './Style/App.css';

let tabs = [
    {
        name:       "Chord Builder",
        id:         "builder",
        component:  React.createElement(ChordSelector, {maxStrings: 12})
    },
    {
        name:       "Tab Editor",
        id:         "tabs",
        component:  React.createElement(TabEditor, {strings: ["e", "B", "G", "D", "A", "E"]})
    }
]

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {page: 0}
    }

    render() {
        return (
            <div className="App main">
                <NavView tabs={tabs} />
            </div>
        );
    }
}

export default App;
