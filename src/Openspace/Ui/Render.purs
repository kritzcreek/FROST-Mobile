module Openspace.Ui.Render where

import           Control.Apply
import           Control.Monad.Eff
import           DOM
import           Data.Array
import           Data.Function
import qualified Data.Map as M
import           Data.Maybe
import           Data.Tuple
import           Debug.Trace
import           Openspace.Types

type SanitizedTopic = { topicDescription :: String, topicTyp :: String }
type AssignedTopic = { topic :: SanitizedTopic, room :: Room, block :: Block}
type SanitizedTimetable = [AssignedTopic]

type TopicsForBlock = [{topic :: SanitizedTopic, room :: Room}]

topicsForBlock :: Block -> AppState -> TopicsForBlock
topicsForBlock b as =
  concatMap (\r -> f (findIn r b as.timeslots) r) as.rooms
  where
    f :: Maybe SanitizedTopic -> Room -> TopicsForBlock
    f s r = case s of
      Just t -> [{topic: t, room: r}]
      Nothing -> []

sanitizeTopic :: Topic -> SanitizedTopic
sanitizeTopic (Topic t) = { topicDescription: t.topicDescription,
                            topicTyp: show t.topicTyp }

findIn :: Room -> Block -> M.Map Slot Topic -> Maybe SanitizedTopic
findIn r b timeslots = M.lookup (Slot {block:b, room:r}) timeslots
                       <#> sanitizeTopic

makeGrid :: AppState -> [[Maybe SanitizedTopic]]
makeGrid as = (\r ->
                (\b -> findIn r b as.timeslots ) <$> (sort as.blocks)
              ) <$> as.rooms

foreign import renderGridImpl
  """
  function renderGridImpl(blocks, selectedBlock, topicsForBlock, personalTimetable){
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
    }
  }
  """ :: forall eff. Fn4 [Block] (Maybe Block) TopicsForBlock [SanitizedTopic] (Eff( dom::DOM | eff ) Unit)

foreign import renderPersonalTimetableImpl
  """
  function renderPersonalTimetableImpl(timetable) {
    return function(){
      React.render(
        React.createElement(Timetable, {
          timetable: timetable
        }),
        document.getElementById('personalTimetable')
      );
    };
  }
  """ :: forall eff. SanitizedTimetable -> Eff( dom::DOM | eff ) Unit

renderPersonalTimetable :: forall eff. AppState -> UiState -> Eff( dom::DOM, trace::Trace | eff ) Unit
renderPersonalTimetable as us =
  renderPersonalTimetableImpl $ sorting $ concatMap findAssignedTopic us.personalTimetable
  where timeslots :: [Tuple Slot Topic]
        timeslots = M.toList as.timeslots

        findAssignedTopic :: Topic -> [AssignedTopic]
        findAssignedTopic t = maybe [] construct (timeslots !! (topicIndex t))

        topicIndex :: Topic -> Number
        topicIndex t = findIndex (isTopic t) timeslots

        construct :: Tuple Slot Topic -> [AssignedTopic]
        construct (Tuple (Slot s) t) = singleton { topic: sanitizeTopic t, block: s.block, room: s.room }

        isTopic :: Topic -> Tuple Slot Topic -> Boolean
        isTopic t tuple = t == snd tuple

        sorting :: [AssignedTopic] -> [AssignedTopic]
        sorting = sortBy \at1 at2 -> compare at1.block at2.block

renderGrid :: forall eff. AppState -> UiState -> Eff( dom::DOM | eff ) Unit
renderGrid as us = runFn4 renderGridImpl blocks us.selectedBlock topics timetable
  where topics = maybe [] (flip topicsForBlock as) us.selectedBlock
        blocks = (sort as.blocks)
        timetable = (sanitizeTopic <$> us.personalTimetable)

renderApp :: forall eff. AppState -> UiState -> Eff( dom::DOM, trace::Trace | eff ) Unit
renderApp as us = renderGrid as us *> renderPersonalTimetable as us
