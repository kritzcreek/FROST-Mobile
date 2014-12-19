module Event.Stream.Input where

import Rx.JQuery
import Rx.Observable

import Data.Either
import Data.Foreign
import Data.Foreign.Class
import Data.Tuple hiding(zip)
import Data.Maybe

import Control.Monad.Eff
import Control.Monad.ST
import qualified Control.Monad.JQuery as J
import Debug.Trace
import DOM

import Render.Types
import Render.Main


foreign import readTopic
"""
function readTopic (){
  return { description : $('#topicInput').val(), typ: $('#typInput').val() };
}
""" :: forall eff. Eff( dom :: DOM | eff ) Foreign

foreign import readSlot
"""
function readSlot (){
  return { room: $('#roomInput').val(), time: parseFloat($('#timeInput').val(), 10) };
}
""" :: forall eff. Eff( dom :: DOM | eff ) Foreign

foreign import getDetail
"""
function getDetail (e){
    return e.originalEvent.detail;
}
""" :: forall eff. J.JQueryEvent -> Foreign

parseTopic :: Foreign -> Either ForeignError Topic
parseTopic ft = do
  t <- read ft :: F Topic
  return t

parseSlot :: Foreign -> Either ForeignError Slot
parseSlot fs = do
  s <- read fs :: F Slot
  return s

parseTimeslotEvent :: J.JQueryEvent -> J.JQueryEvent -> Either ForeignError Timeslot
parseTimeslotEvent se te = parseTimeslot (getDetail se) (getDetail te)

parseTimeslot :: Foreign -> Foreign -> Either ForeignError Timeslot
parseTimeslot fs ft = do
  s <- parseSlot fs
  t <- parseTopic ft
  return $ Tuple s t

type Stream a h eff = Eff( dom :: DOM, trace :: Trace, st :: ST h | eff ) Unit

streams :: forall h eff. Stream AppState h eff
streams = do

  appSt <- newSTRef myState1
  readSTRef appSt >>= renderApp
  renderMenu (show <$> topicTypes)

  document        <- J.select "document"
  menuEmitter     <- J.select "#menuContainer"
  topicEmitter    <- J.select "#topicsContainer"
  gridEmitter     <- J.select "#gridContainer"

  onAddTopic               <- "addTopic" `onAsObservable` menuEmitter
  onRemoveTopic            <- "removeTopic" `onAsObservable` menuEmitter
  onTopicSelect            <- "selectTopic" `onAsObservable` topicEmitter
  onSelectSlotWithTopic    <- "selectSlotWithTopic" `onAsObservable` gridEmitter
  onSelectSlotWithoutTopic <- "selectSlotWithoutTopic" `onAsObservable` gridEmitter
  onDragStartTopic         <- "dragStartTopic" `onAsObservable` topicEmitter
  onDragEndTopic           <- "dragEndTopic" `onAsObservable` topicEmitter
  onDragOverSlot           <- "dragOverSlot" `onAsObservable` gridEmitter

  let onSelect = onTopicSelect `merge` onSelectSlotWithTopic

  let select = (\e -> do
                   let ft = getDetail e
                   case parseTopic ft of
                     Right t -> SelectTopic t
                     Left e -> ShowError (show e)
               ) <$> onSelect

  let add = (\e -> do
                let ft = getDetail e
                case parseTopic ft of
                  Right t -> AddTopic t
                  Left e -> ShowError (show e)
            ) <$> onAddTopic

  let delete = (\e -> do
                   let ft = getDetail e
                   case parseTopic ft of
                     Right t -> DeleteTopic t
                     Left e  -> ShowError (show e)
               ) <$> onRemoveTopic

  let timeTopic =
        do fs <- getDetail <$> onSelectSlotWithoutTopic
           ft <- getDetail <$> onTopicSelect
           return $ parseTimeslot fs ft

  let assign = (\fts -> do
                   case fts of
                     Right (Tuple s t) -> AssignTopic t s
                     Left e -> ShowError (show e)
               ) <$> timeTopic

    
  let dragTopic =
         do ft <- getDetail <$> onDragStartTopic
            fs <- getDetail <$> onDragOverSlot
            onDragEndTopic
            return $ parseTimeslot fs ft

  let drag = (\fts -> do
                 case fts of
                   Right (Tuple s t) -> AssignTopic t s
                   Left e -> ShowError $ show e
             ) <$> dragTopic

  let change = select `merge` add `merge` delete `merge` assign `merge` drag

  subscribe change (\a -> do
                          (modifySTRef appSt $ evalAction a) >>= renderApp
                   )
  

main = runST streams
