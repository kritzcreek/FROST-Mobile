window.jQuery = window.$ = require('jquery');
require('rx');
require('rx-jquery');

window.Grid = require('babel!./views/grid.js');
window.Timetable = require('babel!./views/personalTimetable.js');
window.React = require('react');

require('Openspace.Ui.Stream').main();
