const assembly = {
  name: 'IRGSP-1.0',
  aliases: ['Nipponbare'],
  sequence: {
    type: 'ReferenceSequenceTrack',
    trackId: 'Nipponbare-ReferenceSequenceTrack',
    adapter: {
      type: 'BgzipFastaAdapter',
      fastaLocation: {
        uri: 'Nipponbare.fasta.gz'
      },
      faiLocation: {
        uri: 'Nipponbare.fasta.gz.fai'
      },
      gziLocation: {
        uri: 'Nipponbare.fasta.gz.gzi'
      },
    },
  }
}

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

export default assembly
