module Cordova.EventTypes where

import DOM.Event.Types (EventType(..))

deviceready :: EventType
deviceready = EventType "deviceready"

pause :: EventType
pause = EventType "pause"

resume :: EventType
resume = EventType "resume"

backbutton :: EventType
backbutton = EventType "backbutton"

menubutton :: EventType
menubutton = EventType "menubutton"

searchbutton :: EventType
searchbutton = EventType "searchbutton"

startcallbutton :: EventType
startcallbutton = EventType "startcallbutton"

endcallbutton :: EventType
endcallbutton = EventType "endcallbutton"

volumedownbutton :: EventType
volumedownbutton = EventType "volumedownbutton"

volumeupbutton :: EventType
volumeupbutton = EventType "volumeupbutton"
