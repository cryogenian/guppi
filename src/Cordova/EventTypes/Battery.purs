module Cordova.EventTypes.Battery where

import DOM.Event.Types (EventType(..))

batterycritical :: EventType
batterycritical = EventType "batterycritical"

batterylow :: EventType
batterylow = EventType "batterylow"

batterystatus :: EventType
batterystatus = EventType "batterystatus"
