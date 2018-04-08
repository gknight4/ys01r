import React, { Component } from "react";
//import createReactClass from 'create-react-class'

class TDC extends Component {
  handleClick = () => {
    this.props.onHeaderClick(this.props.itemId);
  }

  render() {
    return (
      <td onClick={this.handleClick}>
        {this.props.item}
      </td>
    );
  }}
/*class TDC extends Component {
//  var TDC = createReactClass({
  render() {
    return (
      <td onClick={this._onClick}>
        {this.props.item}
      </td>
    );
  }
  _onClick() {
    console.log(this.props);
    console.log("click1");
    this.props.onItemClick(this.props.itemId);
  }
}*/

export default TDC;
