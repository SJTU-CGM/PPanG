export function parseTranscripts(value) {
  return {
    id: value.substring(value.indexOf(']') + 2, value.indexOf('(') - 1),
    strand: value.substring(value.indexOf('(') + 1, value.indexOf(')'))
  };
}

export const getTrackStart = (track) => track.indexOfFirstBase ?? Number(
  track.name.substring(track.name.indexOf('[') + 1, track.name.indexOf(']')))
