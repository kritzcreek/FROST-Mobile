'use strict';
import React from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import { formatBlock } from 'babel!./components/list-item-block.js'

React.initializeTouchEvents(true);

var Timetable = React.createClass({
  emit: event => this.getDOMNode().dispatchEvent(event),
  render(){
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
