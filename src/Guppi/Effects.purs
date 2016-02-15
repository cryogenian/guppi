module Guppi.Effects where

import Control.Monad.Aff (Aff())
import Control.Monad.Aff.AVar (AVAR())
import Control.Monad.Eff.Exception (EXCEPTION())

import DOM (DOM())

type GuppiEffects =
  ( dom :: DOM
  , err :: EXCEPTION
  , avar :: AVAR
  )

type Guppi = Aff GuppiEffects
