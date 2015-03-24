'use strict';
import React from 'react';
import moment from 'moment';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

React.initializeTouchEvents(true);

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

var Timetable = React.createClass({
  emit: event => this.getDOMNode().dispatchEvent(event),
  render: function(){
    let topics = this.props.timetable
      .map(({room: room, block: block, topic: topic}) =>
          <ListGroupItem key={topic.topicDescription}
           header={topic.topicDescription}>
            <div> {room.roomName} </div>
            <div> {formatBlock(block)} </div>
            <div> {topic.topicTyp} </div>
          </ListGroupItem>
      );
    return <ListGroup> {topics} </ListGroup>;
  }
});

export default Timetable;
