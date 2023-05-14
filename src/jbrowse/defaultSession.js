const session = {
  name: 'this session',
  margin: 0,
  view: {
    id: 'linearGenomeView',
    minimized: false,
    type: 'LinearGenomeView',
    offsetPx: 191980240,
    bpPerPx: 0.1554251851851852,
    displayedRegions: [
      {
        refName: 'chr01',
        start: 0,
        end: 133797422,
        reversed: false,
        assemblyName: 'IRGSP-1.0',
      },
    ],
    tracks: [
      // {
      //   id: '4aZAiE-A3',
      //   type: 'ReferenceSequenceTrack',
      //   configuration: 'Nipponbare-ReferenceSequenceTrack',
      //   minimized: false,
      //   displays: [
      //     {
      //       id: 'AD3gqvG0_6',
      //       type: 'LinearReferenceSequenceDisplay',
      //       showForward: true,
      //       showReverse: true,
      //       showTranslation: true,
      //     },
      //   ],
      // },
      {
        id: 'T6uhrtY40O',
        type: 'FeatureTrack',
        configuration: 'genes',
        minimized: false,
        displays: [
          {
            id: 'AD3gqvG0_6',
            type: 'LinearBasicDisplay'
          },
        ],
      },
    ],
    hideHeader: true,
    hideHeaderOverview: true,
    hideNoTracksActive: false,
    trackSelectorType: 'hierarchical',
    trackLabels: 'overlapping',
    showCenterLine: false,
    showCytobandsSetting: true,
    showGridlines: true,
  },
}

export const getDefaultSession = (accession) => {
  return {
    name: 'this session',
    margin: 0,
    view: {
      id: 'linearGenomeView',
      minimized: false,
      type: 'LinearGenomeView',
      offsetPx: 191980240,
      bpPerPx: 0.1554251851851852,
      displayedRegions: [
        {
          refName: 'chr01',
          start: 0,
          end: 133797422,
          reversed: false,
          assemblyName: accession,
        },
      ],
      tracks: [
        // {
        //   id: '4aZAiE-A3',
        //   type: 'ReferenceSequenceTrack',
        //   configuration: `${accession}-ReferenceSequenceTrack`,
        //   minimized: false,
        //   displays: [
        //     {
        //       id: 'AD3gqvG0_6',
        //       type: 'LinearReferenceSequenceDisplay',
        //       showForward: true,
        //       showReverse: true,
        //       showTranslation: true,
        //     },
        //   ],
        // },
        {
          id: 'T6uhrtY40O',
          type: 'FeatureTrack',
          configuration: 'genes',
          minimized: false,
          displays: [
            {
              id: 'AD3gqvG0_6',
              type: 'LinearBasicDisplay'
            },
          ],
        },
      ],
      hideHeader: true,
      hideHeaderOverview: true,
      hideNoTracksActive: false,
      trackSelectorType: 'hierarchical',
      trackLabels: 'overlapping',
      showCenterLine: false,
      showCytobandsSetting: true,
      showGridlines: true,
    },
  }
}
export default session
