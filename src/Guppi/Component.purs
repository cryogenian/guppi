module Guppi.Component where

import Prelude

import Data.Functor (($>))

import Halogen
import Halogen.HTML.Core (className)
import Halogen.HTML.Events.Indexed as E
import Halogen.HTML.Indexed as H
import Halogen.HTML.Properties.Indexed as P

import Guppi.Effects (Guppi())

type GuppiHTML = ComponentHTML Query
type GuppiDSL = ComponentDSL State Query Guppi

data Query a
  = Inc a
  | Dec a


type State =
  { count :: Int }

initialState :: State
initialState = {count: 0}

comp :: Component State Query Guppi
comp = component render eval

render :: State -> GuppiHTML
render state =
  H.div_
    [
      navbar
    , buttons
    ]
  where
  navbar =
    H.div
      [ P.classes [ className "bar"
                  , className "bar-header"
                  , className "bar-dark"
                  ]
      ]
      [ H.h1
          [ P.classes [ className "title" ] ]
          [ H.text $ show state.count ]
      ]
  buttons =
    H.div
    [ P.classes [ className "button-bar" ] ]
    [ H.button
      [ E.onClick (E.input_ Inc)
      , P.classes [ className "button"
                  , className "button-positive"
                  , className "button-outline"
                  ]
      ]
      [ H.i [ P.classes [ className "icon"
                        , className "ion-plus-round"
                        ]
            ]
        [ ]
      ]
    , H.button
      [ E.onClick (E.input_ Dec)
      , P.classes [ className "button"
                  , className "button-royal"
                  , className "button-outline"
                  ]
      ]
      [ H.i [ P.classes [ className "icon"
                        , className "ion-minus-round"
                        ]
            ]
        [ ]
      ]
    ]


eval :: Natural Query GuppiDSL
eval (Inc next) = modify (\x -> x{count = x.count + 1}) $> next
eval (Dec next) = modify (\x -> x{count = x.count - 1}) $> next
