import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Label, Input, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStepBackward,
  faStepForward,
  faSearchPlus,
  faSearchMinus,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import * as tubeMap from '../util/tubemap';
import html2canvas from "html2canvas";
import SelectionDropdown from "./SelectionDropdown";

const ZOOM_FACTOR = 2.0;

class DataPositionFormRow extends Component {
  constructor() {
    super();
    this.onKeyUp = this.onKeyUp.bind(this);
    this.state = {
      isCompress: false,
      isDownloading: false,
      builtInGeneSelect: "none",
      refGeneSelect: "none",
      builtInGeneSelectOptions: [],
      refGeneSelectOptions: [],
      navigationType: "builtinGenes",
    }
  }

  handleZoomIn = () => {
    tubeMap.zoomBy(ZOOM_FACTOR);
  };

  handleZoomOut = () => {
    tubeMap.zoomBy(1.0 / ZOOM_FACTOR);
  };

  handleCompress = () => {
    tubeMap.zoomBy(1e-100, this.state.isCompress ? "Expand" : "Compress");
    this.setState({isCompress: !this.state.isCompress})
  }

  handleReset = () => {
    tubeMap.zoomReset();
    this.setState({isCompress: false})
  }

  resetCompress = () => {
    this.setState({isCompress: false})
  }

  toAboutPage = () => {
    window.open("https://cgm.sjtu.edu.cn/PPanG")
  }

  handleDownloadButton = () => {
    this.setState({isDownloading: true})
    setTimeout(() => html2canvas(document.getElementById('Pangenome browser')).then(canvas => {
      const downloadLink = document.createElement('a');
      downloadLink.href = canvas.toDataURL("image/png");
      downloadLink.download = 'PPanG.png';
      downloadLink.click();
      this.setState({isDownloading: false})
    }), 300)
  };

  onKeyUp(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.props.handleInputChange(event);
      this.props.handleGoButton();
    }
  }

  // When the user clicks on the help icon, open the popup
  // TODO: React-ify
  helpPopupFunction = () => {
    var popup = document.getElementById("helpPopup");
    console.log('HELP');
    popup.classList.toggle("show");
  }

  handleBuiltinGeneChange = (e) => {
    this.setState({builtInGeneSelect: e.target.value})
    this.props.handleInputChange(e)
  }

  handlerefGeneChange = (e) => {
    this.setState({refGeneSelect: e.target.value})
    this.props.handleInputChange(e)
  }

  render() {
    return (
      <Form inline>
        {this.state.navigationType === "builtinGenes" && (
          <React.Fragment>
            <Label
              for="regionSelect"
              className="customData tight-label mb-2 mr-sm-2 mb-sm-0 ml-2"
            >
              Built-in Gene:
            </Label>
            <SelectionDropdown
              className="customDataMounted dropdown mb-2 mr-sm-4 mb-sm-0"
              id="builtinGenes"
              value={this.state.builtInGeneSelect}
              onChange={this.handleBuiltinGeneChange}
              options={this.state.builtInGeneSelectOptions}
            />
          </React.Fragment>
        )}
        {this.state.navigationType === "refGeneID" && (
          <React.Fragment>
            <Label
              for="regionSelect"
              className="customData tight-label mb-2 mr-sm-2 mb-sm-0 ml-2"
            >
              MSU RGAP7 Gene ID:
            </Label>
            <SelectionDropdown
              className="customDataMounted dropdown mb-2 mr-sm-4 mb-sm-0"
              id="refGenes"
              value={this.state.refGeneSelect}
              onChange={this.handlerefGeneChange}
              options={this.state.refGeneSelectOptions}
            />

          </React.Fragment>
        )}
        {this.state.navigationType === "customRegion" && (
          <React.Fragment>
            <Label className="tight-label mb-2 mr-sm-2 mb-sm-0 ml-2" for="region">
              Region:
            </Label>
            <Input
              type="text"
              className="custom-input form-control mb-2 mr-sm-4 mb-sm-0"
              id="region"
              size="36"
              value={this.props.region}
              onChange={this.props.handleInputChange}
              onKeyPress={this.onKeyUp}/>
            &nbsp;
            {this.props.uploadInProgress && (
              <div className="smallLoader" id="fileUploadSpinner" />
            )}
            <div className="popup" onClick={this.helpPopupFunction}>
              <FontAwesomeIcon icon={faQuestionCircle} size="lg" />
              <span className="popuptext" id="helpPopup">
            Coordinate: Search for a coordinate range (e.g. "IRGSP-1.0.chr01:1-100"), or a start position and a distance (e.g. "IRGSP-1.0.chr01:1+100"). Note that the coordinate starts from 0.
          </span>
            </div>
          </React.Fragment>)}
        <Button
          color="primary"
          id="goButton"
          onClick={this.props.handleGoButton}
          disabled={this.props.uploadInProgress}
        >
          Go
        </Button>
        <Button
          color="primary"
          id="goLeftButton"
          onClick={this.props.handleGoLeft}
          disabled={this.props.isGoNextDisabled}
        >
          <FontAwesomeIcon icon={faStepBackward} size="lg" />
        </Button>
        <Button color="primary" id="zoomInButton" onClick={this.handleZoomIn} disabled={this.state.isCompress}>
          <FontAwesomeIcon icon={faSearchPlus} size="lg" />
        </Button>
        <Button color="primary" id="zoomOutButton" onClick={this.handleZoomOut} disabled={this.state.isCompress}>
          <FontAwesomeIcon icon={faSearchMinus} size="lg" />
        </Button>
        <Button
          color="primary"
          id="goRightButton"
          onClick={this.props.handleGoRight}
          disabled={this.props.isGoNextDisabled}
        >
          <FontAwesomeIcon icon={faStepForward} size="lg" />
        </Button>
        <Button
          color="primary"
          id="compressButton"
          onClick={this.handleCompress}
        >
          {this.state.isCompress ? "Expand" : "Compress"}
        </Button>
        <Button
          color="primary"
          id="resetButton"
          onClick={this.handleReset}
        >
          Reset
        </Button>
        {/*<Button*/}
        {/*  color="primary"*/}
        {/*  id="downloadButton"*/}
        {/*  onClick={this.props.clearJBView}*/}
        {/*>*/}
        {/*  Clear Linear Views*/}
        {/*</Button>*/}
        <Button
          color="primary"
          id="downloadButton"
          onClick={this.handleDownloadButton}
          disabled={this.state.isDownloading}
        >
          {this.state.isDownloading ? "Processing..." : "Download Image"}
        </Button>

	{/*<Button*/}
  {/*        color="primary"*/}
  {/*        id="aboutButton"*/}
  {/*        onClick={this.toAboutPage}*/}
  {/*      >*/}
  {/*        About & Manual*/}
  {/*      </Button>*/}
      </Form>
    );
  }
}

DataPositionFormRow.propTypes = {
  handleGoButton: PropTypes.func.isRequired,
  handleGoLeft: PropTypes.func.isRequired,
  handleGoRight: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  region: PropTypes.string.isRequired,
  uploadInProgress: PropTypes.bool.isRequired,
  isGoNextDisabled: PropTypes.bool.isRequired,
  clearJBView: PropTypes.func.isRequired
};

export default DataPositionFormRow;
