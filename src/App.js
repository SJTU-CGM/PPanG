import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import HeaderForm from './components/HeaderForm';
import TubeMapContainer from './components/TubeMapContainer';
import CustomizationAccordion from './components/CustomizationAccordion';
import { dataOriginTypes } from './enums';
import * as tubeMap from './util/tubemap';
import config from './config.json';
import {getAssembly} from './jbrowse/assembly'
import {getTracks} from './jbrowse/tracks'
import {getDefaultSession} from './jbrowse/defaultSession'

import {
  createViewState,
  JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view'
import {Button, ButtonGroup, Form, Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import SelectionDropdown from "./components/SelectionDropdown";
import {Cross} from "./components/Cross";
import {setDrawTextFlag, update} from "./util/tubemap";
import {defaultConfiguration} from "./jbrowse/configuration";

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
        haplotypeColors: 'lightColors',
        exonColors: 'greys',
        forwardReadColors: 'reds',
        reverseReadColors: 'blues',
        colorReadsByMappingQuality: false,
        mappingQualityCutoff: 0,
        transcriptSelected: [],
        transcriptSelectOptions: [],
        transcripts: {}
      },
      jbrowseViewStates: {},
      showReorderLinearViewModel: false
    };
  }

  componentDidUpdate() {
    const { visOptions } = this.state;
    tubeMap.setDrawTextFlag(!visOptions.compressedView);
    tubeMap.setMergeNodesFlag(visOptions.removeRedundantNodes);
    tubeMap.setTransparentNodesFlag(visOptions.transparentNodes);
    tubeMap.setShowReadsFlag(visOptions.showReads);
    tubeMap.setShowExonsFlag(visOptions.showExons);
    tubeMap.setSoftClipsFlag(visOptions.showSoftClips);
    tubeMap.setColorSet('haplotypeColors', visOptions.haplotypeColors);
    tubeMap.setColorSet('forwardReadColors', visOptions.forwardReadColors);
    tubeMap.setColorSet('reverseReadColors', visOptions.reverseReadColors);
    tubeMap.setColorSet('exonColors', visOptions.exonColors);
    tubeMap.setColorReadsByMappingQualityFlag(
      visOptions.colorReadsByMappingQuality
    );
    tubeMap.setMappingQualityCutoff(visOptions.mappingQualityCutoff);
    try {
      tubeMap.selectTranscript(visOptions.transcriptSelected);
    } catch (e) {
      console.error(e);
    }
    tubeMap.update();
  }

  setFetchParams = fetchParams => {
    this.setState({
      fetchParams: fetchParams,
      dataOrigin: dataOriginTypes.API
    });
  };

  handleClickReorder = () => {
    this.setState({showReorderLinearViewModel: !this.state.showReorderLinearViewModel})
  }

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

  handleChangeRegion = (reference, pathCoords, indexOfFirstBase) => {
    this.props.reference = reference
    this.props.pathCoords = pathCoords
    this.props.indexOfFirstBase = indexOfFirstBase
  }

  clearJBrowseViews = () => {
    this.setState((state) => ({
      jbrowseViewStates: {
        // [this.props.reference]: state.jbrowseViewStates[this.props.reference]
      },
    }))
  }

  clearJBrowseView = (trackName) => {
    let jbrowseViewStates = this.state.jbrowseViewStates
    delete jbrowseViewStates[trackName]
    this.setState({jbrowseViewStates: jbrowseViewStates})
  }

  moveJBrowseViewBehind = (i) => {
    const jbrowseViews = this.getJBrowseViewList()
    let tmp = jbrowseViews[i]
    jbrowseViews[i] = jbrowseViews[i + 1]
    jbrowseViews[i + 1] = tmp
    this.setState({jbrowseViewStates: Object.fromEntries(jbrowseViews)})
  }

  resetCompress = () => {
    this.HeaderForm.resetCompress()
  }

  getJBrowseViewState = (trackName, location) => {
    const accession = trackName.substring(0, trackName.indexOf(".chr"))
    const assembly = getAssembly(accession)
    const tracks = getTracks(accession)
    const defaultSession = getDefaultSession(accession)
    if (location === undefined && trackName in this.props.regions) {
      location = this.props.regions[trackName]
    }
    return createViewState({
      assembly,
      tracks,
      defaultSession,
      configuration: defaultConfiguration,
      disableAddTracks: true,
      location: location
    })
  }

  getJBrowseViewList = () => {
    return Object.entries(this.state.jbrowseViewStates).filter(e => e[1] !== undefined)
  }

  addJBrowseView = (trackName, location, addReference=false) => {
    if ((!addReference && !trackName.includes('[')) ||
      this.state.jbrowseViewStates[trackName] !== undefined) return
    this.setState((state) => ({
      jbrowseViewStates: {
        ...state.jbrowseViewStates,
        [trackName]: this.getJBrowseViewState(trackName, location)
      },
    }))
  }

  jbrowseNav = (regionStart, regionEnd) => {
    if (this.props.indexOfFirstBase !== undefined) {

      const graphStart = this.props.indexOfFirstBase
      const chrId = graphStart.match(/chr\d+/)[0];
      const indexOfFirstBase = Number(graphStart.substring(graphStart.indexOf(':') + 1))
      this.props.regions = {}
      for (let accession in this.props.pathCoords) {
        const region = `${chrId}:${this.props.pathCoords[accession] + regionStart - indexOfFirstBase + 1}-${this.props.pathCoords[accession] + regionEnd - indexOfFirstBase + 1}`
        this.props.regions[accession] = region
        if (accession === this.props.reference) {
          this.addJBrowseView(accession, region, true)
        }
        if (this.state.jbrowseViewStates[accession] !== undefined) {
          this.state.jbrowseViewStates[accession].session.view.navToLocString(region)
        }
      }
    }
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
          clearJBView={this.clearJBrowseViews}
          ref={node => this.HeaderForm = node}
        />
        <div id="Pangenome browser">
          <TubeMapContainer
            fetchParams={this.state.fetchParams}
            dataOrigin={this.state.dataOrigin}
            apiUrl={this.props.apiUrl}
            loadTranscriptSelectOptions={this.loadTranscriptSelectOptions}
            handleChangeRegion={this.handleChangeRegion}
            handleTrackDoubleClick={this.addJBrowseView}
            jbrowseNav={this.jbrowseNav}
            resetCompress={this.resetCompress}
          />
          {(this.getJBrowseViewList().length > 0) &&
            <div style={{margin: "-20px 20px 20px 20px"}}>
              {this.getJBrowseViewList().map(e => {
                return <div>
                  <JBrowseLinearGenomeView viewState={e[1]}/>
                </div>
              })}
              <Modal isOpen={this.state.showReorderLinearViewModel} toggle={this.handleClickReorder}>
                <ModalHeader toggle={this.handleClickReorder}>Rearrange Linear Views</ModalHeader>
                <ModalBody>
                  <Table hover>
                    <thead><tr>
                      <th>Order</th><th>Trackname</th><th>Operation</th>
                    </tr></thead>
                    <tbody>
                    {this.getJBrowseViewList().map((e, index) =>
                      <tr>
                      <th scope="row">{index}</th>
                        {e[0].startsWith(this.props.reference) ? <th scope="row">{e[0]}</th> : <td>{e[0]}</td>}
                      <td><ButtonGroup>
                        <Button disabled={index===0} color="primary" size="sm" onClick={() => {this.moveJBrowseViewBehind(index - 1)}}>↑</Button>
                        <Button disabled={index===this.getJBrowseViewList().length-1} color="primary" size="sm" onClick={() => {this.moveJBrowseViewBehind(index)}}>↓</Button>
                        {!e[0].startsWith(this.props.reference) && (<Button color="danger" size="sm" onClick={() => {this.clearJBrowseView(e[0])}}>×</Button>)}
                      </ButtonGroup></td>
                    </tr>)}
                    </tbody>
                  </Table>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={this.handleClickReorder}>
                    Done
                  </Button>
                </ModalFooter>
              </Modal>
          </div>}
        </div>
        <CustomizationAccordion
          visOptions={this.state.visOptions}
          toggleFlag={this.toggleVisOptionFlag}
          handleMappingQualityCutoffChange={
            this.handleMappingQualityCutoffChange
          }
          apiUrl={this.props.apiUrl}
          handleSelectTranscript={this.handleSelectTranscript}
          setColorSetting={this.setColorSetting}
          handleClickReorder={this.handleClickReorder}
        />
      </div>
    );
  }
}

App.propTypes = {
  apiUrl: PropTypes.string,
  pathCoords: PropTypes.object,
  regions: PropTypes.object,
  indexOfFirstBase: PropTypes.number,
  reference: PropTypes.string
}

App.defaultProps = {
  // Backend the whole app will hit against. Usually should be picked up from
  // the config or the browser, but needs to be swapped out in the fake
  // browser testing environment to point to a real testing backend.
  // Note that host includes the port.
  apiUrl: (config.BACKEND_URL || `http://${window.location.host}`) + '/api/v0',
  reference: `${config.reference.name}.chr01[38382380]`,
  regions: {}
};

export default App;
