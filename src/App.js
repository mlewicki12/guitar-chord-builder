
import React from 'react';
import ChordSelector from './Components/ChordSelector.js';
import TabView from './Components/Navigation/TabView.js';
import TabEditor from './Components/TabEditor.js';

import './App.css';

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
                <TabView tabs={tabs} />
            </div>
        );
    }
}

export default App;
