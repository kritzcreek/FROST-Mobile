'use strict';

import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {Maybe, Just, Nothing} from 'Data.Maybe'
import {formatBlock} from 'babel!./components/list-item-block.js'
import ListItemBlock from 'babel!./components/list-item-block.js'


React.initializeTouchEvents(true);


var Grid = React.createClass({
  emit: function(event){
    this.getDOMNode().dispatchEvent(event);
  },
  selectHandler: function(block){
    this.emit(new CustomEvent('SelectBlock', {'detail': block}));
  },
  unselectHandler: function(){
    this.emit(new CustomEvent('UnselectBlock'));
  },
  clickTopicHandler: function(topic, isChosen){
    this.emit(
      new CustomEvent(isChosen ? 'UnchooseTopic' : 'ChooseTopic', {'detail': topic})
    );
  },
  render: function(){
    var blocks = this.props.blocks
          .map( block => {
            return ( <ListItemBlock block={block} onClick={ this.selectHandler.bind(this, block) } /> );
          });

    var rooms = function(self, block, topicsForRoom) {
      return topicsForRoom.map(function({room: room, topic: topic}) {
        let isChosen = self.props.personalTimetable
          .filter( t => t.topicDescription === topic.topicDescription
                        && t.topicTyp === topic.topicTyp).length !== 0;
        return (
          <li key={room.roomName}
            onClick={self.clickTopicHandler.bind(self, topic, isChosen)}
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
        });
    };

    if(this.props.selectedBlock instanceof Just){
      let backDisplay = ( <span><i className="mdi-navigation-arrow-back"/> Back </span>);
      return (
        <div id='gridContainer'>
          <ListItemBlock block={this.props.selectedBlock.value0}
           actions={[{ handler: this.unselectHandler, display: backDisplay}]} />
          <ul className="collection">
           {rooms(this, this.props.selectedBlock, this.props.topicsForBlock)}
          </ul>
        </div>
      );
    }else{
      return (
        <div id='gridContainer'>
            {blocks}
        </div>
      );
    }
  }
});

export default Grid;