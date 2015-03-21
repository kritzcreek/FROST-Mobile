'use strict';

var React = window.React;
var ReactBootstrap = window.ReactBootstrap;
var _ = window._;
var moment = window.moment;

React.initializeTouchEvents(true);

var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;

var Grid = React.createClass({
  emit: function(event){
    this.getDOMNode().dispatchEvent(event);
  },
  selectHandler: function(block){
    this.emit(
      new CustomEvent('SelectBlock',
                      {
                        'detail': block
                      })
    );
  },
  unselectHandler: function(){
    this.emit(new CustomEvent('UnselectBlock'));
  },
  clickTopicHandler: function(topic, isChosen){
    this.emit(
      new CustomEvent(isChosen ? 'UnchooseTopic' : 'ChooseTopic',
                      {
                        'detail': topic
                      })
    );
  },
  render: function(){
    var blocks = this.props.blocks
          .map(function(block) {
            var timeStart = moment(block.blockStartHours + ':' + block.blockStartMinutes,
                                   'HH:mm').format('LT');
            var timeEnd = moment(block.blockEndHours + ':' + block.blockEndMinutes,
                                 'HH:mm').format('LT');
            return (
              <ListGroupItem key={block.blockDescription}
                className="clickable"
                onClick={this.selectHandler.bind(this, block)}
                header={block.blockDescription}>
                <div>
                  {timeStart + ' - ' + timeEnd}
                </div>
              </ListGroupItem>
            );
          }, this);

    var rooms = function(self, block, topicsForRoom) {
      return topicsForRoom.map(function(topicForRoom) {
        var room = topicForRoom.room;
        var topic = topicForRoom.topic;
        var isChosen = _.find(self.props.personalTimetable,
                              function(t){
                                return t.topicDescription === topic.topicDescription
                                  && t.topicTyp === topic.topicTyp;
                              });
        return (
          <ListGroupItem key={room.roomName}
            bsStyle={isChosen ? 'info': ''}
            onClick={self.clickTopicHandler.bind(self, topic, isChosen)}
            header={topic.topicDescription}>
              <div>{room.roomName}</div>
              {topic.topicTyp}
          </ListGroupItem>
        );
        });
    };

    var selectedBlock = this.props.selectedBlock.value0;
    if(!selectedBlock){
      return (
        <div id='gridContainer'>
          <ListGroup>
            {blocks}
          </ListGroup>
        </div>
      );
    }else{
       return (
        <div id='gridContainer'>
          <ListGroup>
           <ListGroupItem key="back" className="clickable"
             onClick={this.unselectHandler}>
           Zurück
         </ListGroupItem>
           {rooms(this,
                  selectedBlock,
                  this.props.topicsForBlock)}
          </ListGroup>
        </div>
      );
    }
  }
});
