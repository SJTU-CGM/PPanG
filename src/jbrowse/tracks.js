import config from '../config.json'
const tracks = [
  {
    type: 'FeatureTrack',
    trackId: 'genes',
    name: 'Reference gene annotation',
    assemblyNames: [config.reference.name],
    category: ['Genes'],
    adapter: {
      type: 'Gff3TabixAdapter',
      gffGzLocation: {
        uri: `${config.reference.annotation}.gff.gz`,
        locationType: 'UriLocation',
      },
      index: {
        location: {
          uri: `${config.reference.annotation}.gff.gz.tbi`,
          locationType: 'UriLocation',
        },
        indexType: 'TBI',
      },
    }
  }
]

export const getTracks = (accession) => {
  return [
    {
      type: 'FeatureTrack',
      trackId: 'genes',
      name: 'gene annotation',
      assemblyNames: [accession],
      category: ['Genes'],
      adapter: {
        type: 'Gff3TabixAdapter',
        gffGzLocation: {
          uri: `${accession}.gff.gz`,
          locationType: 'UriLocation',
        },
        index: {
          location: {
            uri: `${accession}.gff.gz.tbi`,
            locationType: 'UriLocation',
          },
          indexType: 'TBI',
        },
      }
    }
  ]
}

export default tracks
