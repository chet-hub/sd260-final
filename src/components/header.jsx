import React from 'react';
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

class Header extends React.Component {
    static propTypes = {location: PropTypes.object.isRequired};
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            searchHandle: props.search,
            resultSize: null
        }
    }
    queryCallback = (value)=>{
        this.state.searchHandle(value).then(([movieSize,myListSize]) => {
            this.setState((state, props) => {
                const path = props.location.pathname;
                return {resultSize: path === '/' ? movieSize : myListSize}
            });
        })
    }

    handleChange = (event) => {
        this.setState({value: event.target.value});
        this.queryCallback(event.target.value)
    }

    handleSubmit = (event) => {
        this.setState({value: event.target.value});
        this.queryCallback(event.target.value)
        event.preventDefault();
    }

    render() {
        return (
            <header className="header">
                <a href="/">
                    <img
                        src="https://fontmeme.com/permalink/190707/fd4735271a0d997cbe19a04408c896fc.png"
                        alt="netflix-font"
                        border="0"
                    />
                </a>
                <div id="navigation" className="navigation">
                    <nav>
                        <ul>
                            <li>
                                <Link to="/myList">My List</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <form id="search" className="search" onSubmit={this.handleSubmit}>
                    <input type="search" placeholder="Search for a title..." value={this.state.value}
                           onChange={this.handleChange}/>
                    <div className="searchResults">
                        {this.state.value.trim() === '' ?"":`Find ${this.state.resultSize} results with query '${this.state.value}'`}
                    </div>
                </form>
            </header>
        )
    }

}

export default withRouter(Header)