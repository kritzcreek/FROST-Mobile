'use strict';
import React from 'react';
import moment from 'moment';


export function formatBlock(
{
  blockStartHours: startH,
  blockStartMinutes: startM,
  blockEndHours: endH,
  blockEndMinutes: endM
}) {
  let start = moment( startH + ':' + startM, 'HH:mm').format('LT');
  let end = moment( endH + ':' + endM, 'HH:mm').format('LT');
  return start + ' - ' + end;
}

var ListItemBlock = React.createClass({
    generateActions (actions=[]) {
      return actions.map(({handler, display}) => {
          return (<div className="card-action clickable"
                  style={{padding: '10px', marginBottom: '2px'}}>
                    <a style={{position: 'relative', bottom: '5px'}}
                    onClick={handler}>
                      {display}
                    </a>
                  </div>);
        });
    },
    render() {
      var block = this.props.block;
      return (
        <div key={this.props.key} {...this.props}>
          <div className="z-depth-2 card teal darken-1">
            <div className="card-content white-text">
              <span className="card-title">{block.blockDescription}</span>
              <p>{formatBlock(block)}</p>
            </div>
            {this.generateActions(this.props.actions)}
          </div>
        </div> );
    }
});

export default ListItemBlock
