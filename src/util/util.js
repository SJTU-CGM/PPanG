export function parseTranscripts(value) {
  return {
    id: value.substring(0, value.indexOf('(') - 1),
    strand: value.substring(value.indexOf('(') + 1, value.indexOf(')'))
  };
}
