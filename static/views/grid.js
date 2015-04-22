'use strict';

import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import {Maybe, Just, Nothing} from 'Data.Maybe'
import {formatBlock} from 'babel!./components/list-item-block'
import ListItemBlock from 'babel!./components/list-item-block'
import TopicListItem from 'babel!./components/topic-list-item'

React.initializeTouchEvents(true);


var Grid = React.createClass({
  emit (event){
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
  render (){
    var blocks = this.props.blocks
          .map( (block, index) =>
            <ListItemBlock block={block}
              onClick={ this.selectHandler.bind(this, block) } key={index} />
          );

    var topics = (block, topicsForRoom) => {
      return topicsForRoom.map(({room: room, topic: topic}, index) => {
        let isChosen = this.props.personalTimetable
          .filter( t => t.topicDescription === topic.topicDescription
                        && t.topicTyp === topic.topicTyp).length !== 0;
        return (
          <TopicListItem topic={topic} room={room}
            onClick={this.clickTopicHandler.bind(this, topic, isChosen)}
            isChosen={isChosen} key={index}/>
        );
      }, this);
    };

    if(this.props.selectedBlock instanceof Just){
      let backDisplay = ( <span><i className="mdi-navigation-arrow-back"
        style={{'fontSize': '25px', 'position': 'relative', 'top': '5px'}}/> Back </span>);
      return (
        <div id='gridContainer'>
          <ListItemBlock block={this.props.selectedBlock.value0}
           actions={[{ handler: this.unselectHandler, display: backDisplay}]} />
          <ul className="collection">
           {topics(this.props.selectedBlock, this.props.topicsForBlock)}
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