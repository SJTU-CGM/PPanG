import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import HeaderForm from './components/HeaderForm';
import TubeMapContainer from './components/TubeMapContainer';
import CustomizationAccordion from './components/CustomizationAccordion';
import { dataOriginTypes } from './enums';
import * as tubeMap from './util/tubemap';
import config from './config.json';
import assembly, {getAssembly} from './jbrowse/assembly'
import tracks, {getTracks} from './jbrowse/tracks'
import defaultSession, {getDefaultSession} from './jbrowse/defaultSession'

import {
  createViewState,
  JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view'
import {Button, Collapse} from "reactstrap";
import SelectionDropdown from "./components/SelectionDropdown";

const accessions = [
  "ARC10497",
  "CHAOMEO",
  "KETANNANGKA",
  "LARHAMUGAD",
  "LIMA",
  "NATELBORO",
  "PR106",
  "TG22"
]

class App extends Component {
  constructor(props) {
    super(props);
    const ds = config.DATA_SOURCES[0];
    let xgFile = ds.xgFile;
    let region = ds.defaultPosition;
    let gamFile = undefined;
    if(ds.gamFile){
      gamFile = ds.gamFile;
    }
    let gbwtFile = undefined;
    if(ds.gbwtFile){
      gbwtFile = ds.gbwtFile;
    }
    let bedFile = undefined;
    if(ds.bedFile){
      bedFile = ds.bedFile;
    }
    let dataPath = 'default';
    if(ds.useMountedPath){
      dataPath = 'mounted';
    }
    this.state = {
      // These describe the files on the server side that we are working on.
      fetchParams: {
        // This is the query (like path:start-end) we are displaying.
        region: region,
        xgFile: xgFile,
        gbwtFile: gbwtFile,
        gamFile: gamFile,
        bedFile: bedFile,
        // This is the type of data paths we are working with, such as "mounted".
        // All the paths are scoped to a type on the server side.
        dataPath: dataPath
      },
      // This is a little like dataPath, but lets us toggle between data from
      // the server and local test data. TODO: Unify?
      dataOrigin: dataOriginTypes.API,
      // These are the current rendering settings.
      visOptions: {
        removeRedundantNodes: true,
        compressedView: false,
        transparentNodes: true,
        showExons: true,
        showReads: false,
        showSoftClips: true,
        haplotypeColors: 'greys',
        forwardReadColors: 'reds',
        reverseReadColors: 'blues',
        colorReadsByMappingQuality: false,
        mappingQualityCutoff: 0,
        transcriptSelected: [],
        transcriptSelectOptions: [],
        transcripts: {}
      },
      jbrowseViewStates: {
        "IRGSP-1.0": createViewState({
          assembly,
          tracks,
          defaultSession,
          location: 'chr01:38382382-38385504',
        })
      },
      accessionSelected: "ARC10497"
    };
  }

  componentDidUpdate() {
    const { visOptions } = this.state;
    visOptions.compressedView
      ? tubeMap.setNodeWidthOption(1)
      : tubeMap.setNodeWidthOption(0);
    tubeMap.setMergeNodesFlag(visOptions.removeRedundantNodes);
    tubeMap.setTransparentNodesFlag(visOptions.transparentNodes);
    tubeMap.setShowReadsFlag(visOptions.showReads);
    tubeMap.setShowExonsFlag(visOptions.showExons);
    tubeMap.setSoftClipsFlag(visOptions.showSoftClips);
    tubeMap.setColorSet('haplotypeColors', visOptions.haplotypeColors);
    tubeMap.setColorSet('forwardReadColors', visOptions.forwardReadColors);
    tubeMap.setColorSet('reverseReadColors', visOptions.reverseReadColors);
    tubeMap.setColorReadsByMappingQualityFlag(
      visOptions.colorReadsByMappingQuality
    );
    tubeMap.setMappingQualityCutoff(visOptions.mappingQualityCutoff);
    try {
      tubeMap.selectTranscript(visOptions.transcriptSelected);
    } catch (e) {
      console.error(e);
    }
  }

  jbrowseNav() {
    for (let accession in this.props.regions) {
      if (accession in this.state.jbrowseViewStates) {
        this.state.jbrowseViewStates[accession].session.view.navToLocString(this.props.regions[accession])
      }
    }
  }

  setFetchParams = fetchParams => {
    this.setState({
      fetchParams: fetchParams,
      dataOrigin: dataOriginTypes.API
    });
  };

  toggleVisOptionFlag = flagName => {
    if (flagName === "showExons") {
      const haplotypeColors = this.state.visOptions[flagName] ? "lightColors" : "greys";
      this.setState(state => ({
        visOptions: {
          ...state.visOptions,
          [flagName]: !state.visOptions[flagName],
          haplotypeColors: haplotypeColors
        }
      }));
    } else {
      this.setState(state => ({
        visOptions: {
          ...state.visOptions,
          [flagName]: !state.visOptions[flagName]
        }
      }));
    }
  };

  handleMappingQualityCutoffChange = value => {
    this.setState(state => ({
      visOptions: {
        ...state.visOptions,
        mappingQualityCutoff: value
      }
    }));
  };

  setColorSetting = (key, value) => {
    this.setState(state => ({
      visOptions: {
        ...state.visOptions,
        [key]: value
      }
    }));
  };

  setDataOrigin = dataOrigin => {
    this.setState({ dataOrigin });
  };

  loadTranscriptSelectOptions = (transcriptSelectOptions, transcripts) => {
    this.setState(state => ({
      visOptions: {
        ...state.visOptions,
        transcriptSelectOptions: transcriptSelectOptions,
        transcripts: transcripts
      }
    }));
  }

  handleSelectTranscript = (value) => {
    this.setState(state => ({
      visOptions: {
        ...state.visOptions,
        transcriptSelected: value
      }
    }));
  }

  handleChangeRegion = (region) => {
    this.props.regions = region
    this.jbrowseNav()
  }

  render() {
    const { jbrowseViews } = this.state;
    return (
      <div>
        <HeaderForm
          setFetchParams={this.setFetchParams}
          setDataOrigin={this.setDataOrigin}
          setColorSetting={this.setColorSetting}
          dataOrigin={this.state.dataOrigin}
          apiUrl={this.props.apiUrl}
        />
        <TubeMapContainer
          fetchParams={this.state.fetchParams}
          dataOrigin={this.state.dataOrigin}
          apiUrl={this.props.apiUrl}
          loadTranscriptSelectOptions={this.loadTranscriptSelectOptions}
          handleChangeRegion={this.handleChangeRegion}
        />
        <div style={{margin: "20px"}}>
          <JBrowseLinearGenomeView viewState={this.state.jbrowseViewStates['IRGSP-1.0']}/>
          {/*<Collapse>*/}
            <SelectionDropdown
              value={this.state.accessionSelected}
              options={accessions}
              onChange={(event) => this.setState({accessionSelected: event.target.value})}/>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => {
                const assembly = getAssembly(this.state.accessionSelected)
                const tracks = getTracks(this.state.accessionSelected)
                const defaultSession = getDefaultSession(this.state.accessionSelected)
                let location;
                if (this.state.accessionSelected in this.props.regions) {
                  location = this.props.regions[this.state.accessionSelected]
                } else {
                  location = "chr01:1-1000"
                }
                this.setState((state) => ({
                  jbrowseViewStates: {
                    ...state.jbrowseViewStates,
                    [this.state.accessionSelected]: createViewState({
                      assembly,
                      tracks,
                      defaultSession,
                      location: location
                    })
                  }
                }))
              }}
            >+</Button>
            {Object.entries(this.state.jbrowseViewStates).filter(e => !e[0].startsWith("IRGSP")).map(e => {
              return <JBrowseLinearGenomeView viewState={e[1]}/>
            })}
          {/*</Collapse>*/}
        </div>
        <CustomizationAccordion
          visOptions={this.state.visOptions}
          toggleFlag={this.toggleVisOptionFlag}
          handleMappingQualityCutoffChange={
            this.handleMappingQualityCutoffChange
          }
          handleSelectTranscript={this.handleSelectTranscript}
          setColorSetting={this.setColorSetting}
        />
      </div>
    );
  }
}

App.propTypes = {
  apiUrl: PropTypes.string,
  regions: PropTypes.object,
}

App.defaultProps = {
  // Backend the whole app will hit against. Usually should be picked up from
  // the config or the browser, but needs to be swapped out in the fake
  // browser testing environment to point to a real testing backend.
  // Note that host includes the port.
  apiUrl: (config.BACKEND_URL || `http://${window.location.host}`) + '/api/v0',
  regions: {
    "IRGSP-1.0": "chr01:38382382-38385504",
    "ARC10497": "chr01:38938856-38941978",
    "CHAOMEO": "chr01:39649118-39652240",
    "KETANNANGKA": "chr01:39379545-39382667",
    "LARHAMUGAD": "chr01:40029054-40032176",
    "LIMA": "chr01:39932788-39935910",
    "NATELBORO": "chr01:38813443-38816565",
    "PR106": "chr01:39631014-39634136",
    "TG22": "chr01:38728489-38731611"
  }
};

export default App;
