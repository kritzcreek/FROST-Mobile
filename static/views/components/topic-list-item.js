'use strict';
import React from 'react';

var TopicListItem = React.createClass({

  render() {
    let {topic: topic, room: room, isChosen: isChosen} = this.props;
    return (
      <li key={this.props.key}
        onClick={this.props.onClick}
        className="collection-item">
        <div className="row">
          <div className="col s9">
            <h5>{topic.topicDescription}</h5>
            {topic.topicTyp} - {room.roomName}
          </div>
          <div className="col s3">
            <p className={isChosen ? 'mdi-action-favorite': 'mdi-action-favorite-outline'}
              style={{fontSize: '30px', color: '#00897b'}}></p>
          </div>
        </div>
      </li>
    );
  }

});

export default TopicListItem;