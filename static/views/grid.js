'use strict';

import React from 'react'
import {ListGroup, ListGroupItem} from 'react-bootstrap'
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
          <ListGroupItem key={room.roomName}
            bsStyle={isChosen ? 'info': null}
            onClick={self.clickTopicHandler.bind(self, topic, isChosen)}
            header={topic.topicDescription}>
              <div>{room.roomName}</div>
              {topic.topicTyp}
          </ListGroupItem>
        );
        });
    };

    if(this.props.selectedBlock instanceof Just){
      return (
        <div id='gridContainer'>
          <ListGroup>
           <ListGroupItem key="back">
              <span className="glyphicon glyphicon-menu-left" onClick={this.unselectHandler}/>
           </ListGroupItem>
           <ListItemBlock block={this.props.selectedBlock.value0} bsStyle="success" />
           {rooms(this, this.props.selectedBlock, this.props.topicsForBlock)}
          </ListGroup>
        </div>
      );
    }else{
      return (
        <div id='gridContainer'>
          <ListGroup>
            {blocks}
          </ListGroup>
        </div>
      );
    }
  }
});

export default Grid;