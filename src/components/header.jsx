import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from "prop-types";
import {withRouter} from "react-router";
import * as MovieAPI from "../lib/MovieAPI";

class Header extends React.Component {
    static propTypes = {location: PropTypes.object.isRequired};

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            queryResultSize: null,
            searchCallBack: props.searchCallBack
        }
    }

    filterMovies = (movies, query) => {
        return (!query || query.toString().trim() === '') ? movies : movies.filter(movie => {
            return (movie.title.match(query) != null) || (movie.overview.match(query) != null)
        })
    }

    buildMyList = (movies) => {
        return {
            "id": null,
            "name": "My List",
            movieList: movies.filter(movie => (movie.my_list === true))
        }
    }

    buildGenreList = (genreObjectArray, movies) => {
        //genres are displayed in alphabetical order.
        genreObjectArray.sort((a, b) => a.name.localeCompare(b.name))
        genreObjectArray.map(genreObject => {
            genreObject['movieList'] = [];
            movies.forEach(function (movie) {
                if (movie.genre_ids.find(id => genreObject.id === id) >= 0) {
                    genreObject['movieList'].push(movie)
                }
            })
            return genreObject;
        })
        return genreObjectArray;
    }

    getDateFromServer = () => {
        return Promise.all([MovieAPI.getAll(), MovieAPI.genres()])
            .then(([movies, genres]) => [this.filterMovies(movies, this.state.value), genres])
    }

    componentDidMount = () => {
        this.doSearch()
    }

    doSearch = () => {
        const that = this;
        this.getDateFromServer().then(function ([movies, genres]) {
            const genreList = that.buildGenreList(genres, movies)
            const myList = that.buildMyList(movies)
            that.setState((state, props) => {
                const path = props.location.pathname;
                return {queryResultSize: path === '/' ? movies.length : myList.movieList.length}
            });
            that.state.searchCallBack(genreList, [myList], that.doSearch)
        })
    }

    handleChange = (event) => {
        const that = this;
        that.setState({value: event.target.value}, function () {
            that.doSearch()
        })
    }

    handleSubmit = (event) => {
        this.doSearch()
        event.preventDefault();
    }

    render() {
        return (
            <Fragment>
                <header className="header">
                    <Link to="/" onClick={this.doSearch}>
                        <img src="https://fontmeme.com/permalink/190707/fd4735271a0d997cbe19a04408c896fc.png"
                             alt="netflix-font" border="0"/>
                    </Link>
                    <div id="navigation" className="navigation">
                        <nav>
                            <ul>
                                <li>
                                    <Link to="/myList" onClick={this.doSearch}>My List</Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <form id="search" className="search" onSubmit={this.handleSubmit}>
                        <input type="search" placeholder="Search for a title..." value={this.state.value}
                               onChange={this.handleChange}/>
                        <div className="searchResults">
                            {this.state.value.trim() === '' ? "" : `Find ${this.state.queryResultSize} results with query '${this.state.value}'`}
                        </div>
                    </form>
                </header>
            </Fragment>
        )
    }

}

export default withRouter(Header)