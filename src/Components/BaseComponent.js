
import React from 'react';

export default class BaseComponent extends React.Component {
    hooks = {}

    update(state) {
        this.props.onChange && this.props.onChange(state);
        this.setState(state);

        Object.keys(state).forEach(val => {
            if(this.hooks[val]) {
                this.hooks[val](state);
            }
        })
    }

    addHook(keys, func) {
        if(Array.isArray(keys)) {
            keys.forEach(val => this.hooks[val] = func);
        } else this.hooks[keys] = func;
    }
}