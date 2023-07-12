import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Label, Input, FormGroup } from 'reactstrap';

const colorMap = new Map([
  ['colorful', 'plainColors'],
  ['greyscale', 'greys'],
  ['Ygreyscale', 'ygreys'],
  ['reds', 'reds'],
  ['blues', 'blues'],
  ['pale colors', 'lightColors']
]);

class RadioRow extends Component {
  onChange = event => {
    this.props.setColorSetting(
      this.props.trackType,
      colorMap.get(event.target.value)
    );
  };

  render() {
    const colorRadios = Array.from(colorMap).map(([keyColor, valueColor]) => {
      return (
        <Col xs="auto" key={keyColor}>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                value={keyColor}
                checked={this.props.color === valueColor}
                onChange={this.onChange}
              />
              {keyColor}
            </Label>
          </FormGroup>
        </Col>
      );
    });
    return (
      <FormGroup row className="mb-1">
        <Col sm="2">{this.props.rowHeading}:</Col>
        {colorRadios}
      </FormGroup>
    );
  }
}

RadioRow.propTypes = {
  color: PropTypes.string.isRequired,
  rowHeading: PropTypes.string.isRequired,
  setColorSetting: PropTypes.func.isRequired,
  trackType: PropTypes.string.isRequired 
};

export default RadioRow;
