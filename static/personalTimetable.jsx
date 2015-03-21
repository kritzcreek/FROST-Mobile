'use strict';
var React = window.React;
var ReactBootstrap = window.ReactBootstrap;
var moment = window.moment;

React.initializeTouchEvents(true);

var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;

var Timetable = React.createClass({
  emit: function(event){
    this.getDOMNode().dispatchEvent(event);
  },
  render: function(){
    var topics = this.props.timetable.map(function(assignedTopic) {
      var room = assignedTopic.room;
      var block = assignedTopic.block;
      var timeStart = moment(block.blockStartHours + ':' + block.blockStartMinutes,
                             'HH:mm').format('LT');
      var timeEnd = moment(block.blockEndHours + ':' + block.blockEndMinutes,
                           'HH:mm').format('LT');
      var topic = assignedTopic.topic;
      return (
          <ListGroupItem key={topic.topicDescription}
           header={topic.topicDescription}>
            <div> {room.roomName} </div>
            <div> {timeStart + ' - ' + timeEnd} </div>
            <div> {topic.topicTyp} </div>
          </ListGroupItem>
      );
    });
    return (<ListGroup> {topics} </ListGroup>);
  }
});
