module Openspace.Ui.Render where

import           Prelude
import           Control.Apply
import           Control.Monad.Eff
import           Control.Monad.Eff.Console
import           DOM
import           Data.Array
import           Data.Foreign
import           Data.Function
import qualified Data.Map as M
import           Data.Maybe
import           Data.Tuple
import           Openspace.Types

type AssignedTopic = { topic :: SanitizedTopic, room :: Room, block :: Block}
type SanitizedTimetable = Array AssignedTopic

type SanitizedTopic = { description :: String, typ :: String, host :: String }

sanitizeTopic :: Topic -> SanitizedTopic
sanitizeTopic (Topic t) = { description: t.description
                          , typ: show t.typ
                          , host: t.host
                          }

type TopicsForBlock = Array {topic :: SanitizedTopic, room :: Room}

topicsForBlock :: Block -> AppState -> TopicsForBlock
topicsForBlock b as =
  concatMap (\r -> f (findIn r b as.timeslots) r) as.rooms
  where
    f :: Maybe SanitizedTopic -> Room -> TopicsForBlock
    f s r = case s of
      Just t -> [{topic: t, room: r}]
      Nothing -> []

findIn :: Room -> Block -> M.Map Slot Topic -> Maybe SanitizedTopic
findIn r b timeslots = M.lookup (Slot {block:b, room:r}) timeslots
                       <#> sanitizeTopic

makeGrid :: AppState -> Array (Array (Maybe SanitizedTopic))
makeGrid as = (\r ->
                (\b -> findIn r b as.timeslots ) <$> (sort as.blocks)
              ) <$> as.rooms

foreign import renderGridImpl :: forall eff.
  Fn4
  (Array Block)
  (Maybe Block)
  TopicsForBlock
  (Array SanitizedTopic)
  (Eff( dom::DOM | eff ) Unit)

foreign import renderPersonalTimetableImpl :: forall eff.
  SanitizedTimetable -> Eff( dom::DOM | eff ) Unit

renderPersonalTimetable :: forall eff. AppState -> UiState -> Eff( dom::DOM, console::CONSOLE | eff ) Unit
renderPersonalTimetable as us =
  renderPersonalTimetableImpl $ sorting $ concatMap findAssignedTopic us.personalTimetable
  where timeslots :: Array (Tuple Slot Topic)
        timeslots = Data.List.fromList (M.toList as.timeslots)

        findAssignedTopic :: Topic -> Array AssignedTopic
        findAssignedTopic t = maybe [] construct (timeslots !! (topicIndex t))

        topicIndex :: Topic -> Int
        topicIndex t = fromMaybe (-1) (findIndex (isTopic t) timeslots)

        construct :: Tuple Slot Topic -> Array AssignedTopic
        construct (Tuple (Slot s) t) = singleton { topic: sanitizeTopic t, block: s.block, room: s.room }

        isTopic :: Topic -> Tuple Slot Topic -> Boolean
        isTopic t tuple = t == snd tuple

        sorting :: Array AssignedTopic -> Array AssignedTopic
        sorting = sortBy \at1 at2 -> compare at1.block at2.block

renderGrid :: forall eff. AppState -> UiState -> Eff( dom::DOM | eff ) Unit
renderGrid as us = runFn4 renderGridImpl blocks us.selectedBlock topics timetable
  where topics = maybe [] (flip topicsForBlock as) us.selectedBlock
        blocks = (sort as.blocks)
        timetable = (sanitizeTopic <$> us.personalTimetable)

renderApp :: forall eff. AppState -> UiState -> Eff( dom::DOM, console::CONSOLE | eff ) Unit
renderApp as us = renderGrid as us *> renderPersonalTimetable as us
