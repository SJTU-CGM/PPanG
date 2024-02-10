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
