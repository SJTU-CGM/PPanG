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

const ZOOM_FACTOR = 2.0;

class DataPositionFormRow extends Component {
  constructor() {
    super();
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  handleZoomIn = () => {
    tubeMap.zoomBy(ZOOM_FACTOR);
  };

  handleZoomOut = () => {
    tubeMap.zoomBy(1.0 / ZOOM_FACTOR);
  };

  handleDownloadButton = () => {
    const svgN = document.getElementById('svg');
    const svgData = new XMLSerializer().serializeToString(svgN);
    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8'
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'graph.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
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

  render() {
    return (
      <Form inline>
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
	  onKeyPress={this.onKeyUp}
        />
        &nbsp;
        {this.props.uploadInProgress && (
          <div className="smallLoader" id="fileUploadSpinner" />
        )}
        <div className="popup" onClick={this.helpPopupFunction}>
          <FontAwesomeIcon icon={faQuestionCircle} size="lg" />
          <span className="popuptext" id="helpPopup">
            Coordinate: Search for a coordinate range (e.g. "IRGSP-1.0.chr01:1-100"), or a start position and a distance (e.g. "IRGSP-1.0.chr01:1+100"). Note that the coordinate starts from 0.
            <br/>
            Gene/Transcript Id: Search the gene/transcript id (e.g. "LOC_Os01g66100") in msu7 in selected chromosome and find the gene region.
          </span>
        </div>
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
        >
          <FontAwesomeIcon icon={faStepBackward} size="lg" />
        </Button>
        <Button color="primary" id="zoomInButton" onClick={this.handleZoomIn}>
          <FontAwesomeIcon icon={faSearchPlus} size="lg" />
        </Button>
        <Button color="primary" id="zoomOutButton" onClick={this.handleZoomOut}>
          <FontAwesomeIcon icon={faSearchMinus} size="lg" />
        </Button>
        <Button
          color="primary"
          id="goRightButton"
          onClick={this.props.handleGoRight}
        >
          <FontAwesomeIcon icon={faStepForward} size="lg" />
        </Button>
        <Button
          color="secondary"
          id="downloadButton"
          onClick={this.handleDownloadButton}
        >
          Download Image
        </Button>
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
};

export default DataPositionFormRow;
