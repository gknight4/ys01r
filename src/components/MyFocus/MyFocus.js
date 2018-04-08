import React, { Component } from "react";
import { FormGroup, FormControl } from 'react-bootstrap'

class MyFocus extends Component {
  render() {
    return <div>
        <form>
            <FormGroup>
            <FormControl
//                autoFocus
                type="text"
                id="test1"
            />
            </FormGroup>
        </form>
    </div>;
  }
}

export default MyFocus;
