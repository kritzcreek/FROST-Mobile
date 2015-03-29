'use strict';

import React from 'react';

var Collapsible = React.createClass({

  render() {
    return (
      <ul className="collapsible">
        <li>
          <div className="collapsible-header red lighten-1">
            <i className={this.props.icon}></i> {this.props.displayText}
          </div>
          <div className="collapsible-body">
            <ul className="collection">
              {this.props.children}
            </ul>
          </div>
        </li>
      </ul>
    );
  }

});

export default Collapsible;