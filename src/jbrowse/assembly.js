import config from '../config.json'

const assembly = {
  name: config.reference.name,
  aliases: [config.reference.alias],
  sequence: {
    type: 'ReferenceSequenceTrack',
    trackId: `${config.reference.alias}-ReferenceSequenceTrack`,
    adapter: {
      type: 'BgzipFastaAdapter',
      fastaLocation: {
        uri: `${config.reference.alias}.fasta.gz`
      },
      faiLocation: {
        uri: `${config.reference.alias}.fasta.gz.fai`
      },
      gziLocation: {
        uri: `${config.reference.alias}.fasta.gz.gzi`
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
