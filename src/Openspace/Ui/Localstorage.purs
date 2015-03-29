module Openspace.Ui.Localstorage where

import Data.Maybe
import Data.Either
import Data.Foreign
import Data.Foreign.Class
import Control.Monad.Eff
import Openspace.Types
import Openspace.Ui.Render

foreign import data Storage :: !

foreign import saveImpl 
"""
function saveImpl(key) {
  return function(ts){
    return function(){
      localStorage.setItem(key, JSON.stringify(ts));
    }
  }
}
""" :: forall eff. String -> [SanitizedTopic] -> Eff( storage :: Storage |eff) Unit

save key ts = saveImpl key $ sanitizeTopic <$> ts

foreign import getImpl
"""
function getImpl(key) {
  return function(){
    try{
      return JSON.parse(localStorage.getItem(key));
    } 
    catch(e){
      return [];
    }
  }
}
""" :: forall eff. String -> Eff( storage :: Storage | eff) Foreign

get :: forall eff. String -> Eff( storage :: Storage | eff) [Topic]
get key = do 
  ts <- getImpl key
  return $ case read ts of
             Right tt -> tt
             Left _ -> []


setTimetable :: forall eff. String -> UiState -> Eff( storage :: Storage | eff) Unit
setTimetable key us = save key us.personalTimetable

getTimetable :: forall eff. String -> Eff( storage :: Storage | eff) UiState
getTimetable key = (\k -> { selectedBlock: Nothing
                          , personalTimetable: k}) <$> get key
