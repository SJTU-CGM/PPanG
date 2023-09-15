export function parseTranscripts(value) {
  return {
    id: value.substring(value.indexOf(':') + 2, value.length - 4),
    strand: value.charAt(value.length - 2)
  };
}

export const getTrackStart = (track) => track.indexOfFirstBase ?? Number(
  track.name.substring(track.name.indexOf('[') + 1, track.name.indexOf(']')))


export const titleCase = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
