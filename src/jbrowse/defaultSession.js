const session = {
  name: 'this session',
  margin: 0,
  view: {
    id: 'linearGenomeView',
    minimized: false,
    type: 'LinearGenomeView',
    displayName: "IRGSP-1.0",
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
            type: 'LinearBasicDisplay',
            heightPreConfig: 70
          },
        ],
      },
    ],
    hideHeader: true,
    hideHeaderOverview: true,
    hideNoTracksActive: false,
    trackSelectorType: 'hierarchical',
    trackLabels: 'hidden',
    showCenterLine: false,
    showCytobandsSetting: false,
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
      displayName: accession,
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
              type: 'LinearBasicDisplay',
              heightPreConfig: 70
            },
          ],
        },
      ],
      hideHeader: true,
      hideHeaderOverview: true,
      hideNoTracksActive: false,
      trackSelectorType: 'hierarchical',
      trackLabels: 'hidden',
      showCenterLine: false,
      showCytobandsSetting: false,
      showGridlines: true,
    },
  }
}
export default session
