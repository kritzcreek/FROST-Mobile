//module Openspace.Types

module.exports.parseAssignTopic = function(foreign) {
  return {
    topic : foreign.contents[1],
    slot : foreign.contents[0]
  };
};
