import {objects} from './objects'
import {destination, place, waypoint} from './core-world'
import {vessel, residence, aircraft, experience} from './assets'
import {editorialOps} from './editorial-ops'

export const schemaTypes = [
  ...objects,
  destination, place, waypoint,
  vessel, residence, aircraft, experience,
  ...editorialOps,
]
