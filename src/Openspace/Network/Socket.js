// module Openspace.Network.Socket

module.exports.getSocket = function(url) {
  return new WebSocket(url);
};


module.exports.socketObserver = function(ws) {
  return function (){
    return Rx.Observable.create (function (obs) {
      // Handle messages
      ws.onmessage = obs.onNext.bind(obs);
      //TODO: Handle ServerNotAvailable
      //ws.onerror = obs.onError.bind(obs)
      ws.onclose = obs.onCompleted.bind(obs);
      // Return way to unsubscribe
      return ws.close.bind(ws);
    });
  };
};

module.exports.parseMessage = function(msg){
  return JSON.parse(msg.data);
};

module.exports.emitAction = function(socket) {
  return function (action){
    return function(){
      if(socket.readyState == WebSocket.OPEN){
        socket.send(JSON.stringify(action));
      }
    };
  };
};

module.exports.getSocketUrl = function() {
  var host = window.location.host;
  return host + window.location.pathname.replace('instance/mobile', 'socket');
};

module.exports.emitRefresh = function(socket) {
  return function(){
    //UGLY HACK!
    if(socket.readyState == WebSocket.OPEN){
      socket.send(JSON.stringify({"tag":"RequestState","contents":[]}));
    }else{
      socket.onopen = function(){
        socket.send(JSON.stringify({"tag":"RequestState","contents":[]}));
      };
    }
  };
};
