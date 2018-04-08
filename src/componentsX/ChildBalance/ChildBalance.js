import React, { Component } from "react";

class ChildBalance extends Component {

  getChildBalance = function (ysparent, yschild){
    var url = "/child/charlie";
    if (yschild === "charlie"){
      return <div><a href={url}>Charlie:</a>$35.00</div> ;
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
