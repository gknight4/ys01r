import React, { Component } from "react";
import Navbar from 'react-bootstrap/lib/Navbar'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import NavDropdown from 'react-bootstrap/lib/NavDropdown'
//import MenuItem from 'react-bootstrap/lib/MenuItem'
import { Link } from 'react-router-dom'
//import { test1 } from '../utils.js'
//import Login from '../Login/Login.js'
import LoginParent from '../LoginParent/LoginParent.js'
import AddChild from '../AddChild/AddChild.js'
import history from '../../history.js'
import { saveAuth } from '../utils.js'// pi, 

class YSHeader extends Component {
  constructor(props){
    super(props);
    this.doOnSelect = this.doOnSelect.bind(this);
    this.state={
      open: history.location.pathname === "/login",
      addChildOpen: false
    };
    this.toggleLogin=this.toggleLogin.bind(this);
    this.getLoginData=this.getLoginData.bind(this);
    this.setOpen=this.setOpen.bind(this);
    this.setAddChildOpen=this.setAddChildOpen.bind(this);
    this.toggleAddChild=this.toggleAddChild.bind(this);

  }
  
  doOnSelect(e){
//    console.log("sel");
    console.log(e);
    switch(e){
        case "logout":
            this.logout();
            break ;
        default:
            break ;
    }
  }
  
  logout(){
    this.props.setLoggedIn(false);
    saveAuth("", "", "", false);
  }
  
  toggleLogin(){
      this.setState({open: !this.state.open});
//      console.log("toggle");
  }
  
  toggleAddChild(){
      this.setState({addChildOpen: !this.state.addChildOpen});
  }
  
  getLoginData(data){
//      let addObj = {loginData: data};
//      this.setState(addObj);
      this.props.parentData({loginData: data});// send up to App
  }
  
/*  showLogInOut(){
//      return "Login" ;
//    console.log("long in show");
//      console.log(this.props.loggedIn);
      return (this.props.loggedIn) ? "Logout" : "Login";
  }*/
  
  setOpen(open){
      this.setState({open: open});
  }
  
  setAddChildOpen(open){
    this.setState({addChildOpen: open});
  }
  
  
  LogInOut(){
      return

  }
  
  render() {
    return    <div>
    <Navbar onSelect={this.doOnSelect}>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/parenthome">Home</Link>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav>
{/*        <NavItem eventKey={1}>
          Test 1
        </NavItem>
        <NavItem eventKey={2} href="#">
          Link
        </NavItem>*/}

        <NavDropdown open={this.state.addChildOpen} onToggle={this.toggleAddChild} eventKey={3} title="Add Child" id="basic-nav-dropdown-addchild">
            <AddChild setOpen={this.setAddChildOpen} />
        </NavDropdown>
        
{/*        <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
          <MenuItem eventKey={3.1}>Action</MenuItem>
          <MenuItem eventKey={3.2}>Another action</MenuItem>
          <MenuItem eventKey={3.3}>Something else here</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey={3.4}>Separated link</MenuItem>
        </NavDropdown>*/}
      </Nav>
      <Nav pullRight> {
        this.props.loggedIn ? (
          <NavItem eventKey={"logout"} href="#">
            Logout
          </NavItem>
        ) : (
          <NavDropdown open={this.state.open} onToggle={this.toggleLogin} title="Login" id="mine">
            <LoginParent  open={this.state.open} setOpen={this.setOpen} setLoggedIn={this.props.setLoggedIn}/>
          </NavDropdown>
        )
      } </Nav>
    </Navbar>
    </div>;
  }
}

/*
<NavDropdown open={this.state.menuOpen} onToggle={val => this.dropdownToggle(val)} title={selectedSubjectsHeader} id="sel-subjects-dropdown">
    { this.props.selectedSubjects.map(s =>
        <MenuItem onClick={() => this.menuItemClickedThatShouldntCloseDropdown()} className="default-cursor no-hover" key={s._id}>
            <span className="label label-info"><span style={{ cursor: 'pointer' }}>X</span><span style={{ marginLeft: 5, paddingLeft: 5, borderLeft: '1px solid white' }}>{s.name}</span></span>
        </MenuItem>)
    }
</NavDropdown> * 
*/

export default YSHeader;
