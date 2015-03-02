var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;
Grid = React.createClass({
  initialState: function() {
    return {selected: null};
  },
  select: function(block){
    this.setState({selected: block});
  },
  render: function(){
    var blocks = this.props.blocks
          .map(function(block) {
            var timeStart = moment(block.blockStartHours + ':' + block.blockStartMinutes,
                                   "HH:mm").format("LT");
            var timeEnd = moment(block.blockEndHours + ':' + block.blockEndMinutes,
                                 "HH:mm").format("LT");
            return (
                <ListGroupItem key={block.blockDescription}
                onClick={this.select.bind(this, block)}>
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
    var rooms = function(block) {
      return this.props.rooms
        .map(function(room) {
          return ("hi");
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
          {rooms(this.state.selected)}
        </ListGroup>
      );
    }
  }
});
