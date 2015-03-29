'use strict';
import React from 'react';
import { formatBlock } from 'babel!./components/list-item-block'
import TimetableListItem from 'babel!./components/timetable-list-item'
import Collapsible from 'babel!./components/collapsible'

React.initializeTouchEvents(true);

var Timetable = React.createClass({
  emit: event => this.getDOMNode().dispatchEvent(event),
  render(){
    let topics = this.props.timetable
      .map(({room: room, block: block, topic: topic}) =>
        <TimetableListItem room={room} block={block} topic={topic}/>
      );
    return (
      <Collapsible displayText="Personal Timetable" icon="mdi-device-access-time">
        {topics}
      </Collapsible>
      );
  }
});

export default Timetable;
