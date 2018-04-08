import React, { Component } from "react";

class focus extends Component {
  render() {
    return <div>
        <form>
            <FormGroup>
            <FormControl
                autoFocus
                type="text"
                id="test1"
            />
            </FormGroup>
        </form>
    </div>;
  }
}

export default focus;
