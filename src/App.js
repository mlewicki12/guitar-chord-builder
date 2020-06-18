
import React from 'react';
import ChordSelector from './Components/ChordSelector.js';
import TabView from './Components/Navigation/TabView.js';

import './App.css';

let tabs = [
    {
        name:       "Chord Builder",
        id:         "builder",
        component:  React.createElement(ChordSelector, {maxStrings: 12})
    },
    {
        name:       "Tab Creator",
        id:         "tabs",
        component:  React.createElement(React.Fragment)
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
