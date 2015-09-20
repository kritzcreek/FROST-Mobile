//module Openspace.Ui.Localstorage

module.exports.saveImpl = function(key) {
  return function(ts){
    return function(){
      localStorage.setItem(key, JSON.stringify(ts));
    };
  };
};

module.exports.getImpl = function(key) {
  return function(){
    try{
      return JSON.parse(localStorage.getItem(key));
    }
    catch(e){
      return [];
    }
  };
};
