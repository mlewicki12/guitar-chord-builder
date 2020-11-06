
import React from 'react';
import BaseComponent from '../BaseComponent.js';

export default class NavView extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: props.tabs[0]
        }
    }

    render() {
        return (
            <React.Fragment>
                <div class="tab nav flex-column">
                    {this.props.tabs.map(tab => 
                        <button onClick={() => this.update({activeTab: tab})} disabled={tab.id === this.state.activeTab.id}>{tab.name}</button>
                    )}
                </div>
                <div class="tab">
                    {this.state.activeTab.component}
                </div>
            </React.Fragment>
        )
    }
}