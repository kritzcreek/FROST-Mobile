module Openspace.Ui.Engine where

import Openspace.Types
import Data.Maybe (Maybe(..))
import Data.Array (delete, concatMap, filter)
import Data.Foldable (elem)

evalUiAction :: UiAction -> UiState -> UiState
evalUiAction (SelectBlock b) us =
  us {selectedBlock = Just b}
evalUiAction UnselectBlock us =
  us {selectedBlock = Nothing}
evalUiAction (ChooseTopic t) us =
  us {personalTimetable = t : us.personalTimetable}
evalUiAction (UnchooseTopic t) us =
  us {personalTimetable = delete t us.personalTimetable}

evalActionOnUi :: Action -> UiState -> UiState
evalActionOnUi (DeleteTopic t) us =
  us { personalTimetable = delete t us.personalTimetable }
evalActionOnUi (DeleteBlock b) us =
  us { selectedBlock = unselectIfEqual b us.selectedBlock }
  where unselectIfEqual b mb = if Just b == mb
                               then Nothing
                               else mb
-- This removes Topics from the Personal Timetabel that aren't contained in the requested Application state to prevent leaks.
evalActionOnUi (ReplayActions as) us =
  us { personalTimetable = filter (flip elem validTopics) us.personalTimetable}
  where
    validTopics :: [Topic]
    validTopics = concatMap isAddTopic as

    isAddTopic :: Action -> [Topic]
    isAddTopic (AddTopic a) = [a]
    isAddTopic _ = []

evalActionOnUi _ us = us
