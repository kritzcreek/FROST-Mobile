module Openspace.Ui.Localstorage where

import Prelude
import Data.Maybe
import Data.Either
import Data.Foreign
import Data.Foreign.Class
import Control.Monad.Eff
import Openspace.Types
import Openspace.Ui.Render

foreign import data Storage :: !

foreign import saveImpl :: forall eff. String -> Array SanitizedTopic -> Eff( storage :: Storage |eff) Unit

save :: forall eff. String -> Array Topic -> Eff( storage :: Storage |eff) Unit
save key ts = saveImpl key $ sanitizeTopic <$> ts

foreign import getImpl :: forall eff. String -> Eff( storage :: Storage | eff) Foreign

get :: forall eff. String -> Eff( storage :: Storage | eff) (Array Topic)
get key = do
  ts <- getImpl key
  return $ case read ts of
             Right tt -> tt
             Left _ -> []


setTimetable :: forall eff. String -> UiState -> Eff( storage :: Storage | eff) Unit
setTimetable key us = save key us.personalTimetable

getTimetable :: forall eff. String -> Eff( storage :: Storage | eff) UiState
getTimetable key = { selectedBlock: Nothing
                    , personalTimetable: _} <$> get key
