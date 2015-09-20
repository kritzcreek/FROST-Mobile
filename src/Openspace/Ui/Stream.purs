module Openspace.Ui.Stream where

import Prelude

import Control.Monad.Eff
import Control.Monad.Eff.Console
import Control.Monad.ST
import Control.Alt
import DOM
import Data.Either
import Data.Foreign
import Openspace.Engine
import Openspace.Network.Socket
import Openspace.Types
import Openspace.Ui.Emitter
import Openspace.Ui.Parser
import Openspace.Ui.Render
import Openspace.Ui.Engine
import Openspace.Ui.Localstorage
import Rx.Observable

uiStream :: forall eff. Eff ( dom :: DOM, console :: CONSOLE | eff ) (Observable UiAction)
uiStream = do
  observers <- getObservers
  let emitters = emitterLookup observers

      selectBlock = (uiActionFromForeign parseBlock SelectBlock) <<< getDetail
          <$> emitters "SelectBlock"

      unselectBlock = (const UnselectBlock) <$> emitters "UnselectBlock"

      chooseTopic = (uiActionFromForeign parseTopic ChooseTopic) <<< getDetail
          <$> emitters "ChooseTopic"

      unchooseTopic = (uiActionFromForeign parseTopic UnchooseTopic) <<< getDetail
          <$> (emitters "UnchooseTopic" <|> emitters "UnselectTopic")

  return $ selectBlock <|> unselectBlock <|> chooseTopic <|> unchooseTopic

netStream :: forall eff. Socket -> Eff( net :: Net | eff ) (Observable Action)
netStream socket = do
  onReceive <- socketObserver socket
  return $ actionFromForeign parseAction id <$> (parseMessage <$> onReceive)

main = do
  -- TODO: getSocket :: Either SockErr Socket
  socketUrl <- getSocketUrl
  -- let sockEmitter = getSocket ("ws://" ++ "frost.kritzcreek.me" ++ "/socket/0")
  let sockEmitter = getSocket ("ws://" ++ socketUrl)
  -- Initial State

  uiSt <- getTimetable "timetable" >>= newSTRef
  appSt <- newSTRef myState1
  -- Initial Render
  renderApp emptyState emptyUiState

  --Request Initial State
  emitRefresh sockEmitter

  -- Observable Action
  ui  <- uiStream
  net <- netStream sockEmitter
  -- Broadcast the UI Observable
  --subscribe ui (\a -> emitAction sockEmitter (serialize a))
  -- Evaluate Action Observables
  subscribe net (\a -> do
                    appState <- modifySTRef appSt (evalAction a)
                    uiState <- modifySTRef uiSt (evalActionOnUi a)
                    setTimetable "timetable" uiState
                    renderApp appState uiState)
  subscribe ui (\a-> do
                   appState <- readSTRef appSt
                   uiState <- modifySTRef uiSt (evalUiAction a)
                   setTimetable "timetable" uiState
                   renderApp appState uiState)
