module Openspace.Ui.Stream where

import Control.Monad.Eff
import Control.Monad.ST
import DOM
import Data.Either
import Data.Foreign
import Openspace.Engine
import Openspace.Network.Socket
import Openspace.Types
import Openspace.Ui.Emitter
import Openspace.Ui.Parser
import Openspace.Ui.Render
import Rx.Observable

netStream :: forall eff. Socket -> Eff( net :: Net | eff ) (Observable Action)
netStream socket = do
  onReceive <- socketObserver socket
  return $ actionFromForeign parseAction id <$> (parseMessage <$> onReceive)

main = do
  -- TODO: getSocket :: Either SockErr Socket
  hostName <- getHost
  let sockEmitter = getSocket ("ws://" ++ hostName ++ "/socket")
  -- Initial State
  appSt <- newSTRef myState1
  -- Initial Render
  readSTRef appSt >>= renderApp

  --Request Initial State
  emitRefresh sockEmitter

  -- Observable Action
  --ui  <- uiStream
  net <- netStream sockEmitter
  -- Broadcast the UI Observable
  --subscribe ui (\a -> emitAction sockEmitter (serialize a))
  -- Evaluate Action Observables
  subscribe net (\a -> modifySTRef appSt (evalAction a) >>= renderApp)
