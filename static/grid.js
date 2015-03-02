var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;

Grid = React.createClass({
  topicsForIndex: function(index) {
    var topicsForBlock = _.map(this.props.grid, function(x) {return x[index];});
    return _.zip(this.props.rooms, topicsForBlock);
  },
  getInitialState: function() {
    return {selected: null, index: null};
  },
  select: function(block, index){
    this.setState({selected: block, index: index});
  },
  render: function(){
    var blocks = this.props.blocks
          .map(function(block, index) {
            var timeStart = moment(block.blockStartHours + ':' + block.blockStartMinutes,
                                   "HH:mm").format("LT");
            var timeEnd = moment(block.blockEndHours + ':' + block.blockEndMinutes,
                                 "HH:mm").format("LT");
            return (
                <ListGroupItem key={block.blockDescription}
                onClick={this.select.bind(this, block, index)}>
                <div>
                  <div>
                    {block.blockDescription}
                  </div>
                  <div>
                    {timeStart + " - " + timeEnd}
                  </div>
                </div>
                </ListGroupItem>
            );
          },this);
    var rooms = function(block, topicsForRoom) {
      return topicsForRoom.map(function(topicForRoom) {
        var room = topicForRoom[0];
        var topic = topicForRoom[1].value0;
          return (
              <ListGroupItem key={room.roomName}>
                <div>{room.roomName}</div>
                <div>{topic ? topic.topicDescription : ''}</div>
              </ListGroupItem>);
        }, this);
    }
    if(this.state.selected == null){
      return(
        <ListGroup>
          {blocks}
        </ListGroup>);
    }else{
       return(
        <ListGroup>
          <ListGroupItem key="back" onClick={this.select.bind(this, null, null)}>
            {"Zurück"}
          </ListGroupItem>
          {rooms(this.state.selected, this.topicsForIndex(this.state.index))}
        </ListGroup>
      );
    }
  }
});
