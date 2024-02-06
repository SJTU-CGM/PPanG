import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label } from 'reactstrap';
import SelectionDropdown from "./SelectionDropdown";

class BedRegionsFormRow extends Component {
  render() {
    return (
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
          value={this.props.regionSelect}
          onChange={this.props.handleInputChange}
          options={this.props.regionSelectOptions}
        />

      </React.Fragment>
    );
  }
}

BedRegionsFormRow.propTypes = {
  regionSelect: PropTypes.string.isRequired,
  regionSelectOptions: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired
};

export default BedRegionsFormRow;
