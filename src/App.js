
import React from 'react';
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
            </div>
        );
    }
}

export default App;
