import React, {Component} from 'react';

export default class Submitform extends Component {
    render(){
        return(
            <div className="pure-control-group">
                <label>{this.props.label}</label>
                <button type={this.props.type} className={this.props.className}>{this.props.buttonText}</button>
              </div>
        );
    }
}