import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Collapse,
  Container, Form,
  FormGroup,
  Input,
  Label
} from 'reactstrap';
// TODO: use datagrid to show features
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import SelectionDropdown from "./SelectionDropdown";
import blatCols from '../blat/blatCols.json'
import {fetchAndParse} from "../fetchAndParse";

class VisualizationOptions extends Component {
  state = {
    isOpenLegend: false,
    isOpenVisualizationOptions: true,
    isOpenFeatureCard: false,
    isOpenBlat: false,
    isFullBlat: false,
    blatQuery: "",
    blatCount: 25,
    blatResult: undefined
  };

  toggleLegend = e => {
    this.setState({ isOpenLegend: !this.state.isOpenLegend });
    e.preventDefault();
  };

  toggleFeatureCard = e => {
    this.setState({ isOpenFeatureCard: !this.state.isOpenFeatureCard });
    e.preventDefault();
  };

  toggleBlat = e => {
    this.setState({ isOpenBlat: !this.state.isOpenBlat });
    e.preventDefault();
  };

  toggleVisOptions = e => {
    this.setState({
      isOpenVisualizationOptions: !this.state.isOpenVisualizationOptions
    });
    e.preventDefault();
  };

  toggleFullBlat = () => {
    this.setState({isFullBlat: !this.state.isFullBlat})
  }

  handleMappingQualityCutoffChange = event => {
    this.props.handleMappingQualityCutoffChange(event.target.value);
  };

  handleSelectTranscript = event => {
    this.props.handleSelectTranscript(event.target.value);
  }

  handleBlat = async () => {
    this.setState({blatResult: "BLAT searching..."})
    fetchAndParse(`${this.props.apiUrl}/blatSearch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        seq: this.state.blatQuery,
        full: this.state.isFullBlat,
        count: this.state.blatCount
      })
    }).then(res => {
      this.setState({blatResult: res.result})
    }).catch(() => {
      this.setState({blatResult: "BLAT search failed"})
    });
  }

  render() {
    const { visOptions, toggleFlag } = this.props;
    const mappingQualityOptions = Array.from(Array(61).keys()).map(i => {
      return (
        <option value={i} key={i}>
          {i}
        </option>
      );
    });
    return (
      <Container>
        <div id="accordion">
          <Card>
            <CardHeader onClick={this.toggleBlat}>
              <h5 className="mb-0">
                <a href="#blat" onClick={this.toggleBlat}>
                  BLAT - Search for your interested sequence
                </a>
              </h5>
            </CardHeader>
            <Collapse isOpen={this.state.isOpenBlat}>
              <CardBody>
                <Input
                  type="textarea"
                  style={{marginBottom: "8px", height: "100px"}}
                  value={this.state.blatQuery}
                  placeholder="Input the query sequence here"
                  size="500"
                  onChange={e => this.setState({blatQuery: e.target.value})}
                />
                <Form inline>
                  <Label check>
                    <Input
                      type="checkbox"
                      value={this.state.isFullBlat}
                      onChange={this.toggleFullBlat}
                    />
                    Search all samples (9 references default)
                  </Label>
                  <Label
                  style={{margin: "0 5px 0 20px"}}>
                    BLAT result count:
                  </Label>
                  <SelectionDropdown
                    value={this.state.blatCount}
                    onChange={event => this.setState({blatCount: event.target.value})}
                    options={[25, 50, 100]}
                  />
                  <Button
                    color="primary"
                    onClick={this.handleBlat}
                  >
                    Search
                  </Button>
                </Form>
                {this.state.blatResult !== undefined && (
                  typeof this.state.blatResult === 'string'
                    ? this.state.blatResult :
                    (<div style={{height: 500, width: '100%', margin: '0 15px'}}>
                      <h6>Just copy the tRegion in "Region" box above for visualization in PPanG</h6>
                      <DataGrid
                        rows={this.state.blatResult}
                        columns={blatCols}
                        getRowId={row => row.tRegion}
                        components={{Toolbar: GridToolbar}}
                        initialState={{
                          pagination: {
                            pageSize: 25,
                          },
                        }}
                      />
                    </div>)
                )}
              </CardBody>
            </Collapse>
          </Card>
          <Card>
            <CardHeader id="feature" onClick={this.toggleFeatureCard}>
              <h5 className="mb-0">
                <a href="#collapse" onClick={this.toggleFeatureCard}>
                  Features
                </a>
              </h5>
            </CardHeader>
            <Collapse isOpen={this.state.isOpenFeatureCard}>
              <CardBody>
                <div id="featureCard" />
              </CardBody>
            </Collapse>
          </Card>
          <Card>
            <CardHeader id="legendCard" onClick={this.toggleLegend}>
              <h5 className="mb-0">
                <a href="#collapse" onClick={this.toggleLegend}>
                  Legend
                </a>
              </h5>
            </CardHeader>
            <Collapse isOpen={this.state.isOpenLegend}>
              <CardBody>
                <div id="legendDiv" />
              </CardBody>
            </Collapse>
          </Card>

          <Card>
            <CardHeader id="visOptionsCard" onClick={this.toggleVisOptions}>
              <h5 className="mb-0">
                <a href="#collapse" onClick={this.toggleVisOptions}>
                  Visualization Options
                </a>
              </h5>
            </CardHeader>
            <Collapse isOpen={this.state.isOpenVisualizationOptions}>
              <CardBody>
                <FormGroup>
                  <h5>General</h5>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="checkbox"
                        checked={visOptions.removeRedundantNodes}
                        onChange={() => toggleFlag('removeRedundantNodes')}
                      />
                      Remove redundant nodes
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="checkbox"
                        checked={visOptions.compressedView}
                        onChange={() => toggleFlag('compressedView')}
                      />
                      Hide all text
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="checkbox"
                        checked={visOptions.transparentNodes}
                        onChange={() => toggleFlag('transparentNodes')}
                      />
                      Fully transparent nodes
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="checkbox"
                        checked={visOptions.showExons}
                        onChange={() => toggleFlag('showExons')}
                      />
                      Show exons on tracks
                    </Label>
                  </FormGroup>
                </FormGroup>
                {visOptions.showExons && (
                  <React.Fragment>
                      <label className="tight-label">Select genes of no interest to hide:</label>
                    <div style={{maxWidth: "60%"}}>
                        <SelectionDropdown
                          value={visOptions.transcriptSelected}
                          onChange={this.handleSelectTranscript}
                          options={visOptions.transcriptSelectOptions}
                          isMulti
                        />
                    </div>
                  </React.Fragment>
                )}
                {/*<FormGroup>*/}
                {/*  <h5>Sequence Reads</h5>*/}
                {/*  <FormGroup check>*/}
                {/*    <Label check>*/}
                {/*      <Input*/}
                {/*        type="checkbox"*/}
                {/*        checked={visOptions.showReads}*/}
                {/*        onChange={() => toggleFlag('showReads')}*/}
                {/*      />*/}
                {/*      Show sequence reads*/}
                {/*    </Label>*/}
                {/*  </FormGroup>*/}
                {/*  {visOptions.showReads && (*/}
                {/*    <React.Fragment>*/}
                {/*      <FormGroup check>*/}
                {/*        <Label check>*/}
                {/*          <Input*/}
                {/*            type="checkbox"*/}
                {/*            checked={visOptions.showSoftClips}*/}
                {/*            onChange={() => toggleFlag('showSoftClips')}*/}
                {/*          />*/}
                {/*          Show soft clips*/}
                {/*        </Label>*/}
                {/*      </FormGroup>*/}
                {/*      <FormGroup check>*/}
                {/*        <Label check>*/}
                {/*          <Input*/}
                {/*            type="checkbox"*/}
                {/*            checked={visOptions.colorReadsByMappingQuality}*/}
                {/*            onChange={() =>*/}
                {/*              toggleFlag('colorReadsByMappingQuality')*/}
                {/*            }*/}
                {/*          />*/}
                {/*          Color reads by mapping quality*/}
                {/*        </Label>*/}
                {/*      </FormGroup>*/}
                {/*      <Form inline>*/}
                {/*        <Label className="mr-sm-2 " for="dataSourceSelect">*/}
                {/*          Mapping Quality Cutoff:*/}
                {/*        </Label>*/}
                {/*        <Input*/}
                {/*          type="select"*/}
                {/*          id="dataSourceSelect"*/}
                {/*          className="custom-select"*/}
                {/*          value={visOptions.mappingQualityCutoff}*/}
                {/*          onChange={this.handleMappingQualityCutoffChange}*/}
                {/*        >*/}
                {/*          {mappingQualityOptions}*/}
                {/*        </Input>*/}
                {/*      </Form>*/}
                {/*    </React.Fragment>*/}
                {/*  )}*/}
                {/*</FormGroup>*/}

                {/*<h5>Colors</h5>*/}
                {/*<Form>*/}
                {/*  <RadioRow*/}
                {/*    rowHeading="Haplotypes"*/}
                {/*    color={visOptions.haplotypeColors}*/}
                {/*    trackType="haplotypeColors"*/}
                {/*    setColorSetting={this.props.setColorSetting}*/}
                {/*  />*/}
                {/*  {visOptions.showReads &&*/}
                {/*    !visOptions.colorReadsByMappingQuality && (*/}
                {/*      <React.Fragment>*/}
                {/*        <RadioRow*/}
                {/*          rowHeading="Reads (forward strand)"*/}
                {/*          color={visOptions.forwardReadColors}*/}
                {/*          trackType="forwardReadColors"*/}
                {/*          setColorSetting={this.props.setColorSetting}*/}
                {/*        />*/}
                {/*        <RadioRow*/}
                {/*          rowHeading="Reads (reverse strand)"*/}
                {/*          color={visOptions.reverseReadColors}*/}
                {/*          trackType="reverseReadColors"*/}
                {/*          setColorSetting={this.props.setColorSetting}*/}
                {/*        />*/}
                {/*      </React.Fragment>*/}
                {/*    )}*/}
                {/*</Form>*/}
              </CardBody>
            </Collapse>
          </Card>
        </div>
      </Container>
    );
  }
}

VisualizationOptions.propTypes = {
  handleMappingQualityCutoffChange: PropTypes.func.isRequired,
  setColorSetting: PropTypes.func.isRequired,
  handleSelectTranscript: PropTypes.func.isRequired,
};

export default VisualizationOptions;
