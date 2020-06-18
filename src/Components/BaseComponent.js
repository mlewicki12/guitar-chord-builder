
import React from 'react';

export default class BaseComponent extends React.Component {
    update(state) {
        this.props.onChange && this.props.onChange(state);
        this.setState(state);
    }
}