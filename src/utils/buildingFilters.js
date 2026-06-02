const likelyResidentialTypes = new Set([
  'house',
  'residential',
  'apartments',
  'detached',
  'semidetached_house',
  'terrace',
  'farm',
  'farmhouse',
])

export function filterBuildingsByMode(features, mode = 'all') {
  if (!Array.isArray(features)) {
    return []
  }

  if (mode === 'likelyResidential') {
    return features.filter((feature) => {
      const buildingTag =
        feature?.properties?.tags?.building || feature?.properties?.building

      return typeof buildingTag === 'string' && likelyResidentialTypes.has(buildingTag)
    })
  }

  return features
}
