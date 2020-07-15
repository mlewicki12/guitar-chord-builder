
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
            <div class="display">
                <div class="flex-row">
                    {this.props.tabs.map(tab => 
                        <button onClick={() => this.update({activeTab: tab})} disabled={tab.id === this.state.activeTab.id}>{tab.name}</button>
                    )}
                </div>
                {this.state.activeTab.component}
            </div>
        )
    }
}