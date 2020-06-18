
import React from 'react';
import ChordSelector from './Components/ChordSelector.js';

import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {page: 0}
    }

    render() {
        return (
            <div className="App main">
                <ChordSelector maxStrings={12}/>
            </div>
        );
    }
}

export default App;
