import React, { Component } from "react";
import Login from '../Login/Login.js'
import Register from '../Login/Register.js'

class LoginParent extends Component {
  constructor(props){
    super(props);
    this.state={
      showLoginComponent: "login"
    }
/*    this.state={
      parentName: "frank",
      parentEmail: "",
      userName: "",
      password: "",
      confirmPassword: ""
      
    }*/
    this.setLoginComponent = this.setLoginComponent.bind(this);
  }
  
  setLoginComponent(componentName){
//    console.log(componentName);
    this.setState({showLoginComponent: componentName});
  }

onChange(e){
  }

  render() {
    return <div>
    {this.state.showLoginComponent === "login" &&
      <Login open={this.props.open} setOpen={this.props.setOpen} setLoggedIn={this.props.setLoggedIn} onChange={this.onChange} 
        setLoginComponent={this.setLoginComponent}
      />
    }
    {this.state.showLoginComponent === "register" &&
      <Register open={this.props.open} setOpen={this.props.setOpen} setLoggedIn={this.props.setLoggedIn} onChange={this.onChange} 
        setLoginComponent={this.setLoginComponent}
      />
    }
    </div>
  }
}

export default LoginParent;
