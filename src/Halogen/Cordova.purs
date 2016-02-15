module Halogen.Cordova where

import Prelude

import Control.Monad.Eff (Eff())
import Control.Monad.Eff.Class (MonadEff, liftEff)

import DOM (DOM())
import DOM.Event.EventTarget (eventListener, addEventListener)
import DOM.HTML (window)
import DOM.HTML.Window (document)
import DOM.HTML.Types (htmlDocumentToEventTarget)

import Cordova.EventTypes (deviceready)

onDeviceReady
  :: forall m e
   . (MonadEff (dom :: DOM|e) m)
  => Eff (dom :: DOM|e) Unit
  -> m Unit
onDeviceReady callback = do
  liftEff
  $ window
  >>= document
  >>= htmlDocumentToEventTarget
  >>> addEventListener
        deviceready
        (eventListener \_ -> callback)
        false
