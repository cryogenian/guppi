module PhoneGap.App where

import Prelude
import Control.Monad.Eff (Eff())

foreign import data PhoneGapApp :: *
foreign import data PHONE_GAP :: !

foreign import initialize
  :: forall e
   . PhoneGapApp
  -> Eff (phoneGap :: PHONE_GAP|e) Unit
