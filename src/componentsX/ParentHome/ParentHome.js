import React, { Component } from "react";
import ChildBalance from '../ChildBalance/ChildBalance.js'

class ParentHome extends Component {
  render() {
    return <div>
      <ChildBalance ysparent={'gknight4'} yschild={'charlie'}/>
      <ChildBalance ysparent={'gknight4'} yschild={'randol'}/>
    </div>;
  }
}

export default ParentHome;
