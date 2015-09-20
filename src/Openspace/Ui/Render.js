//module Openspace.Ui.Render

module.exports.renderGridImpl = function(blocks, selectedBlock, topicsForBlock, personalTimetable){
  return function(){
    React.render(
      React.createElement(Grid, {
        blocks: blocks,
        selectedBlock: selectedBlock,
        topicsForBlock: topicsForBlock,
        personalTimetable: personalTimetable
      }),
      document.getElementById('grid')
    );
  };
};

module.exports.renderPersonalTimetableImpl = function(timetable) {
  return function(){
    React.render(
      React.createElement(Timetable, {
        timetable: timetable
      }),
      document.getElementById('personalTimetable')
    );
  };
};
