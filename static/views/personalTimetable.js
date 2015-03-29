'use strict';
import React from 'react';
import { formatBlock } from 'babel!./components/list-item-block.js'

React.initializeTouchEvents(true);

var Timetable = React.createClass({
  emit: event => this.getDOMNode().dispatchEvent(event),
  render(){
    let topics = this.props.timetable
      .map(({room: room, block: block, topic: topic}) =>
          <li className="collection-item" key={topic.topicDescription}>
            <div className="row">
              <div className="col s9">
                <h5>{topic.topicDescription}</h5>
                <div> {topic.topicTyp + ' - ' + room.roomName} </div>
                <div> {formatBlock(block)} </div>
              </div>
              <div className="col s3">
                <p className={'mdi-navigation-cancel'}
                  style={{fontSize: '30px', color: '#ef5350'}}></p>
              </div>
            </div>
          </li>
      );
    return (
      <ul className="collapsible">
        <li>
          <div className="collapsible-header red lighten-1">
            <i className="mdi-device-access-time"></i> Personal Timetable
          </div>
          <div className="collapsible-body">
            <ul className="collection">
              {topics}
            </ul>
          </div>
        </li>
      </ul>);
  }
});

export default Timetable;
