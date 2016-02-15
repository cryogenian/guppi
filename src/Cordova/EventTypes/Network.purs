module Cordova.EventTypes.Network where

import DOM.Event.Types (EventType(..))

online :: EventType
online = EventType "online"

offline :: EventType
offline = EventType "offline"
