module Openspace.Ui.Emitter where

import           Control.Monad.Eff
import qualified Control.Monad.Eff.JQuery as J
import           Control.Plus
import           DOM
import qualified Data.Map as M
import           Data.Maybe
import           Data.Traversable
import           Data.Tuple
import           Prelude
import           Rx.Observable

foreign import onAsObservable :: forall eff. String -> J.JQuery -> Eff(dom :: DOM | eff) (Observable J.JQueryEvent)

type Observer = Tuple String (Observable J.JQueryEvent)
type Observers = M.Map String (Observable J.JQueryEvent)

mkObservable :: forall eff. J.JQuery -> String -> Eff(dom :: DOM | eff) (Tuple String (Observable J.JQueryEvent))
mkObservable emitter event = (Tuple event) <$> (event `onAsObservable` emitter)

getObservers :: forall eff. Eff(dom :: DOM | eff) Observers
getObservers = do
    gridEmitter <- J.select "#gridContainer"
    timetableEmitter <- J.select "#personalTimetableContainer"
    let grid = mkObservable gridEmitter <$>
               ["SelectBlock", "UnselectBlock", "ChooseTopic", "UnchooseTopic"]
    let personalTimetable = mkObservable timetableEmitter <$> ["UnselectTopic"]
    M.fromList <<< Data.List.toList <$> (sequence $ grid <> personalTimetable)

emitterLookup :: Observers -> String -> Observable J.JQueryEvent
emitterLookup es s =
  case M.lookup s es of
    Just ob -> ob
    Nothing -> empty
