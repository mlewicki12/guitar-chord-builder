
import React from 'react';
import ChordBuilder from './Chords.js';
import ChordConfig from './Config.js'

import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {page: 0}
    }

    render() {
        return (
            <div className="App main">
                <ChordConfig maxStrings={12}/>
                <ChordBuilder strings={['e', 'B', 'G', 'D', 'A', 'E']} chord={["G", "B", "D"]} range={5} size={5} />
            </div>
        );
    }
}

export default App;
