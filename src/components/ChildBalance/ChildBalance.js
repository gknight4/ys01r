import React, { Component } from "react";
import { Link } from 'react-router-dom'

class ChildBalance extends Component {

  getChildBalance = function (ysparent, yschild){
    var url = "/child/charlie";
    if (yschild === "charlie"){
      return <div><Link to={url}>Charlie:</Link>$35.00</div> ;
    } else {
      return "Randol: $25.00"
    }
  }

  render() {
    return <div>
      {this.getChildBalance(this.props.ysparent, this.props.yschild)}
    </div>;
  }
}

export default ChildBalance;
