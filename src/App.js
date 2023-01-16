import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import HeaderForm from './components/HeaderForm';
import TubeMapContainer from './components/TubeMapContainer';
import CustomizationAccordion from './components/CustomizationAccordion';
import { dataOriginTypes } from './enums';
import * as tubeMap from './util/tubemap';
import config from './config.json';
import {parseTranscripts} from "./util/util";

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
        geneSelected: 'All',
        geneSelectOptions: ['All'],
        transcriptSelected: 'All',
        transcriptSelectOptions: ['All'],
        transcripts: {}
      }
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
      tubeMap.selectGene(visOptions.geneSelected);
      tubeMap.selectTranscript(visOptions.transcriptSelected);
    } catch (e) {
      console.error(e);
    }
  }

  setFetchParams = fetchParams => {
    this.setState({
      fetchParams: fetchParams,
      dataOrigin: dataOriginTypes.API
    });
  };

  toggleVisOptionFlag = flagName => {
    this.setState(state => ({
      visOptions: {
        ...state.visOptions,
        [flagName]: !state.visOptions[flagName]
      }
    }));
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

  handleSelectGene = (value) => {
    let transcriptSelectOptions = ['All'];
    if (value !== 'All') {
      let geneId = parseTranscripts(value).id;
      transcriptSelectOptions = transcriptSelectOptions.concat(this.state.visOptions.transcripts[geneId].transcripts);
    }
    this.setState(state => ({
      visOptions: {
        ...state.visOptions,
        geneSelected: value,
        transcriptSelectOptions: transcriptSelectOptions,
        transcriptSelected: 'All'
      }
    }));
  }

  loadGeneSelectOptions = (geneOptions, transcripts) => {
    const geneSelectOptions = ['All'].concat(geneOptions);
    this.setState(state => ({
      visOptions: {
        ...state.visOptions,
        geneSelectOptions: geneSelectOptions,
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

  render() {
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
          loadGeneSelectOptions={this.loadGeneSelectOptions}
        />
        <CustomizationAccordion
          visOptions={this.state.visOptions}
          toggleFlag={this.toggleVisOptionFlag}
          handleMappingQualityCutoffChange={
            this.handleMappingQualityCutoffChange
          }
          handleSelectGene={this.handleSelectGene}
          handleSelectTranscript={this.handleSelectTranscript}
          setColorSetting={this.setColorSetting}
        />
      </div>
    );
  }
}

App.propTypes = {
  apiUrl: PropTypes.string
}

App.defaultProps = {
  // Backend the whole app will hit against. Usually should be picked up from
  // the config or the browser, but needs to be swapped out in the fake
  // browser testing environment to point to a real testing backend.
  // Note that host includes the port.
  apiUrl: (config.BACKEND_URL || `http://${window.location.host}`) + '/api/v0'
};

export default App;
