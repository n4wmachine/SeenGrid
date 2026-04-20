/* ============================================================
   RANDOM POOLS INDEX
   Mappt Field-Type-Keys + Modul-IDs auf Zufalls-Arrays.
   Wird von Random-Fill (Module-Toolbar, §11 WORKSPACE_SPEC) genutzt.

   Consumer ruft getRandomPool(key). Legacy-Pools (actions,
   atmospheres, moods, ...) und neue Pools (expressions, outfits,
   zones, ...) sind einheitlich auf Keys gemappt.

   Aliase: module-ID oder field-type-id → canonical pool-key.
   Erweitern: neuen Pool-File unter src/data/random/ ablegen,
   in POOLS registrieren, ggf. in ALIASES verlinken.

   Strukturelle Rollen (view, framing als Dropdown-Enum) werden
   NICHT randomized — Random respektiert panel_fields-Schema und
   lässt role/strict-select unberührt (WORKSPACE_SPEC §11.2).
   ============================================================ */

import actions from './actions.json'
import atmospheres from './atmospheres.json'
import moods from './moods.json'
import sensoryDetails from './sensory-details.json'
import settings from './settings.json'
import subjects from './subjects.json'
import textures from './textures.json'
import scenePatterns from './scene-patterns.json'
import expressions from './expressions.json'
import outfits from './outfits.json'
import zones from './zones.json'
import cameraAngles from './camera-angles.json'
import poses from './poses.json'
import objects from './objects.json'
import weather from './weather.json'
import sceneDescriptions from './scene-descriptions.json'

const POOLS = {
  actions,
  atmospheres,
  moods,
  sensory_details: sensoryDetails,
  settings,
  subjects,
  textures,
  scene_patterns: scenePatterns,
  expressions,
  outfits,
  zones,
  camera_angles: cameraAngles,
  poses,
  objects,
  weather,
  scene_descriptions: sceneDescriptions,
}

const ALIASES = {
  action: 'actions',
  atmosphere: 'atmospheres',
  mood: 'moods',
  sensory_detail: 'sensory_details',
  setting: 'settings',
  subject: 'subjects',
  texture: 'textures',
  expression: 'expressions',
  expression_emotion: 'expressions',
  outfit: 'outfits',
  wardrobe: 'outfits',
  zone: 'zones',
  zone_focus: 'zones',
  camera_angle: 'camera_angles',
  pose: 'poses',
  pose_override: 'poses',
  object: 'objects',
  object_anchor: 'objects',
  weather_atmosphere: 'weather',
  scene_description: 'scene_descriptions',
  shot_detail: 'scene_descriptions',
}

export function getRandomPool(key) {
  if (!key) return []
  const canonical = ALIASES[key] || key
  return POOLS[canonical] || []
}

export function pickRandom(key) {
  const pool = getRandomPool(key)
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

export function hasPool(key) {
  if (!key) return false
  const canonical = ALIASES[key] || key
  return Array.isArray(POOLS[canonical]) && POOLS[canonical].length > 0
}

export const RANDOM_POOL_KEYS = Object.keys(POOLS)
