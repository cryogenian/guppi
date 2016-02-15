module Main where

import Prelude

import Control.Monad.Aff (runAff, Aff())
import Control.Monad.Eff (Eff())
import Control.Monad.Eff.Class
import Control.Monad.Eff.Exception (throwException, message)
import Halogen
import Halogen.Cordova (onDeviceReady)
import Halogen.Util (appendToBody, onLoad)
import Guppi.Effects (GuppiEffects())
import Guppi.Component (comp, initialState)

foreign import alert :: forall e. String -> Eff e Unit
foreign import alertAff :: forall e. String -> Aff e Unit

main :: Eff GuppiEffects Unit
main = do
  runAff (\e -> alert $ message e) (const (pure unit)) do
    halogen <- runUI comp initialState
    onLoad $ appendToBody halogen.node
