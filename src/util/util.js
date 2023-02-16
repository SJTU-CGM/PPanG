export function parseTranscripts(value) {
  return {
    id: value.substring(value.indexOf(']') + 2, value.indexOf('(') - 1),
    strand: value.substring(value.indexOf('(') + 1, value.indexOf(')'))
  };
}
