import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as tubeMap from '../util/tubemap';

class TubeMap extends Component {
  componentDidMount() {
    this.createTubeMap();
  }

  // componentDidUpdate() {
  //   this.createTubeMap();
  // }

  createTubeMap = () => {
    tubeMap.create({
      svgID: '#svg',
      nodes: this.props.nodes,
      tracks: this.props.tracks,
      reads: this.props.reads,
      region: this.props.region,
      annotations: this.props.annotations,
      handleTrackDoubleClick: this.props.handleTrackDoubleClick
    });
  };

  render() {
    return <svg id="svg" alt="Rendered sequence tube map visualization" />;
  }
}

TubeMap.propTypes = {
  nodes: PropTypes.array.isRequired,
  tracks: PropTypes.array.isRequired,
  reads: PropTypes.array.isRequired,
  region: PropTypes.array.isRequired,
  annotations: PropTypes.array.isRequired,
  handleTrackDoubleClick: PropTypes.func.isRequired
};

export default TubeMap;
