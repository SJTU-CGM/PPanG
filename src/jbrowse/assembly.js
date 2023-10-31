export const getAssembly = (accession) => {
  return {
    name: accession,
    sequence: {
      type: 'ReferenceSequenceTrack',
      trackId: `${accession}-ReferenceSequenceTrack`,
      adapter: {
        type: 'BgzipFastaAdapter',
        fastaLocation: {
          uri: `${accession}.fasta.gz`
        },
        faiLocation: {
          uri: `${accession}.fasta.gz.fai`
        },
        gziLocation: {
          uri: `${accession}.fasta.gz.gzi`
        },
      },
    }
  }
}
