import React, { Component } from 'react';
import {Col, Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';

class ValueForm extends Component {
  
  constructor(props) {
    super(props);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleGenerate = this.handleGenerate.bind(this);
  }

  handleValueChange(e) {
    this.props.onValueChange(e.target.id, e.target.value);
  }

  handleGenerate() {
    this.props.onGenerate();
  }

  render() {
    return (
      <div className='value-form'>
        <h4>Enter seed values from 0-100</h4>
        <Button className="btn-custom top-btn" onClick={this.handleGenerate}>Generate Playlist</Button>
        <Form horizontal>
        <FormGroup controlId="acousticness">
          <Col componentClass={ControlLabel} md={6}>Acousticness</Col>
          <Col md={6}>
            <FormControl className="input-custom" onChange={this.handleValueChange} type="number" max={100} min={0} value={this.props.values.acousticness}/>
          </Col>
        </FormGroup>
        <FormGroup controlId="danceability">
          <Col componentClass={ControlLabel} md={6}>Danceability</Col>
          <Col md={6}>
            <FormControl className="input-custom" onChange={this.handleValueChange} type="number" max={100} min={0} value={this.props.values.danceability}/>
          </Col>
        </FormGroup>
        <FormGroup controlId="energy">
          <Col componentClass={ControlLabel} md={6}>Energy</Col>
          <Col md={6}>
            <FormControl className="input-custom" onChange={this.handleValueChange} type="number" max={100} min={0} value={this.props.values.energy}/>
          </Col>
        </FormGroup>
        <FormGroup controlId="instrumentalness">
          <Col componentClass={ControlLabel} md={6}>Instrumentalness</Col>
          <Col md={6}>
            <FormControl className="input-custom" onChange={this.handleValueChange} type="number" max={100} min={0} value={this.props.values.instrumentalness}/>
          </Col>
        </FormGroup>
        <FormGroup controlId="valence">
          <Col componentClass={ControlLabel} md={6}>Positivity</Col>
          <Col md={6}>
            <FormControl className="input-custom" onChange={this.handleValueChange} type="number" max={100} min={0} value={this.props.values.valence}/>
          </Col>
        </FormGroup>
        </Form>
      </div>
    );
  }
}

export default ValueForm;