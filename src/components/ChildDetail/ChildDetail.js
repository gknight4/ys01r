import React, { Component } from "react";
//import {FormControl, FormGroup} from 'react-bootstrap'; // ControlLabel, Button
import dateformat from 'dateformat'
import { Link } from 'react-router-dom'
import TDC from '../TDC/TDC.js'
import { po } from '../utils.js'

class ChildDetail extends Component {
  constructor(props){
    super(props);
    this.state={
      ysAddType: "lunch",
      transactions: []
    }
    this.handleAddTypeChange = this.handleAddTypeChange.bind(this);
  }
  
/*
 transaction:
 amount, date, id, name, user- id, username, parentname, flags, confirmCode
*/  
  loadChild(){
//      let path = this.props.location.pathname ;
//      let childname = path.substr(path.lastIndexOf("/") + 1) ;
//    console.log (childname);
    let url = "http://yourstash.tr8.us:6026/api/transactions?username=" + this.props.match.params.childName;
    let getObj = po('GET', '');
    getObj.headers['Authorization'] = sessionStorage.getItem("auth");
    fetch(url, getObj)
        .then(response => {
            response.json()
            .then(resp=>{
//                console.log(resp);
                let balance = 0 ;
                resp.map(x => balance += x.amount);
                this.setState({transactions: resp, balance: balance})
//                console.log(balance);
            })
            
        });
      
  }

    componentWillMount(){
        this.loadChild();
    }

  
  childTransactions = [
    {"name": "hot lunch",
      "date": "2018-03-06T12:00:00Z",
      "amount": 123.45,
      "id": 5},
    {"name": "hot lunch",
      "date": "2018-03-06T12:00:00Z",
      "amount": 123.45,
      "id": 6},
    {"name": "hot lunch",
      "date": "2018-03-06T12:00:00Z",
      "amount": 123.45,
      "id": 7},
    {"name": "hot lunch",
      "date": "2018-03-06T12:00:00Z",
      "amount": 123.45,
      "id": 8}
  ];

  recentAdds = [
    {name: "hot lunch", amount: 2.5},
    {name: "hot lunch", amount: 2.5},
    {name: "hot lunch", amount: 2.5},
    {name: "hot lunch", amount: 2.5},
    {name: "hot lunch", amount: 2.5},
/*    "hot lunch, $2.50",
    "AR Points $5.00",
    "hot lunch, $2.50",
    "AR Points $5.00",
    "hot lunch, $2.50",
    "AR Points $5.00",
    "hot lunch, $2.50",
    "AR Points $5.00",
    "hot lunch, $2.50",
    "AR Points $5.00",
    "hot lunch, $2.50",
    "AR Points $5.00",
    "hot lunch, $2.50",
    "AR Points $5.00",*/
  ]

  handleAddTypeChange(event){
    this.setState({ysAddType: event.target.value})
  };

  setAddType(event){
//    console.log("here");
    console.log(event);
  }

  renderAddTypeRows(data) {
    return data.map((addType, index) => {
      // anon func maintains scope!
        // Pass in a function to our onClick, and make it anon
        // to maintain scope.  The function body can be anything
        // which will be executed on click only.  Our song value
        // is maintained via a closure so it works.
        return (
            <tr key={index}>
                <TDC
                  key={index}
                  itemId={index}
                  onHeaderClick={this.setAddType}
                  item={addType.name + " " + addType.amount} />
            </tr>
        );
    });  // no need to bind with anon function
}

  render() {

//    {this.props.titles.map(title =>
//               <th key={title}>{title}</th>
//             )}
//    console.log(new Date(this.childTransactions[0].date));
//    var str = this.childTransactions[0].date ;
//    var dt = dateformat (new Date(str), "mm-dd-yyyy") ;
//    var fm = dateformat(dt, "mm-dd-yyyy") ;
//    console.log(dt);
    return <div><h1>Transactions for {this.props.match.params.childName}</h1>
    <table><tbody>
      {
        this.state.transactions.map(
        (t, i) => (i > this.state.transactions.length - 6) && <tr key={t.id}>{/* show 5 most recent*/}
          <td>
            <Link to={{pathname: "/transactions/" + this.props.match.params.childName + "/" + t.id, testit: "two"}}>
            {dateformat (new Date(t.date), "mm-dd-yyyy")}</Link>&nbsp;</td>
          <td>{t.name}&nbsp;</td>
          <td>{"$" + (t.amount / 100)}</td>
        </tr>)
      }

        <tr><td>Balance</td><td></td><td>{"$" + (this.state.balance / 100)}</td></tr>
    </tbody></table>
{/*      <form onSubmit={this.handleSubmit}>
      <FormGroup
        controlId="formAddType"
      >
      <h2>Add a Trans</h2>
      <FormControl
        type="text"
        value={this.state.ysAddType}
        onChange={this.handleAddTypeChange}
      />
      </FormGroup>
        <h3>Recents</h3>
        <div style={{
          height: '100px',
          width: '200px',
          overflowY: 'scroll',
          cursor: 'pointer'
        }}>
        <table><tbody>
        {this.renderAddTypeRows(this.recentAdds)}
        </tbody></table>
        </div>
      </form>*/}
        <Link to={"/transactions/" + this.props.match.params.childName + "/new"}>Add a new transaction</Link>
    </div>;
  }
}

export default ChildDetail;
