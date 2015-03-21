module Openspace.Ui.Engine where

import Openspace.Types
import Data.Maybe (Maybe(..))
import Data.Array (delete)

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
evalActionOnUi _ us = us
