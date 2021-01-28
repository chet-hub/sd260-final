import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import React, {Component} from 'react';
import Header from './components/header.jsx';
import MovieGroupList from './components/movieGroupList.jsx';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            myList: [],
            genreList: []
        }
    }

    searchCallBack = (genreList,myList,doSearchFn)=> {
        this.setState(function (prevState) {
            return {
                myList: myList,
                genreList: genreList,
                doSearch:doSearchFn
            }
        })
    }

    render = () => {
        return (
            <Router>
                <Header searchCallBack={(genreList,myList,doSearchFn)=>{this.searchCallBack(genreList,myList,doSearchFn)}} />
                <Switch>
                    <Route path="/myList" render={() => (
                        <MovieGroupList groupList={this.state.myList} onClick={()=>{this.state.doSearch()}} />
                    )}/>
                    <Route path="/" render={() => (
                        <MovieGroupList groupList={this.state.genreList} onClick={()=>{this.state.doSearch()}} />
                    )}/>
                </Switch>
            </Router>
        );
    };
}

export default App;
