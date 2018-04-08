import React, { Component } from "react";

class ChildDetail extends Component {
  render() {
    console.log(this.props.match.params.childName);
    return <div>Child Detail is for {this.props.match.params.childName}!</div>;
  }
}

export default ChildDetail;
