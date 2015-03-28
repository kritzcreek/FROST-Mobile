'use strict';
import React from 'react';
import moment from 'moment';
import {ListGroupItem} from 'react-bootstrap';


export function formatBlock(
{
  blockStartHours: startH,
  blockStartMinutes: startM,
  blockEndHours: endH,
  blockEndMinutes: endM
}) {
  let start = moment( startH + ':' + startM, 'HH:mm').format('LT');
  let end = moment( endH + ':' + endM, 'HH:mm').format('LT');
  return start + '-' + end;
}

var ListItemBlock = React.createClass({
    render() {
      var block = this.props.block;
      return (
        <ListGroupItem key={block.blockDescription}
          className="clickable"
          header={block.blockDescription}
          {...this.props}>
          <div>
            {formatBlock(block)}
          </div>
        </ListGroupItem>);
    }
});

export default ListItemBlock