const tracks = [
  {
    type: 'FeatureTrack',
    trackId: 'genes',
    name: 'MSU gene annotation',
    assemblyNames: ['IRGSP-1.0'],
    category: ['Genes'],
    adapter: {
      type: 'Gff3TabixAdapter',
      gffGzLocation: {
        uri: 'msu7.gff.gz',
        locationType: 'UriLocation',
      },
      index: {
        location: {
          uri: 'msu7.gff.gz.tbi',
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
      name: 'MAKER gene annotation',
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
