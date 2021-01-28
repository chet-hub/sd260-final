import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import React, {Component, Fragment} from 'react';
import Header from './components/header.jsx';
import MovieList from './components/movieList.jsx';
import * as MovieAPI from './lib/MovieAPI';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            queryResultSize: null,
            allMovies: [],
            allGenres: [],
            movieGenreList: [],
            myList: []
        }
    }

    getDate = () => {
        return Promise.all([MovieAPI.getAll(), MovieAPI.genres()])
    }

    FetchDataAndUpdateSAPPState = () => {
        this.getDate().then(result => {
            this.setState((prevState) => this.buildStateObject(result[0], result[1], prevState.query))
        })
    }

    filterMovies = (movies, query) => {
        return (!query || query.toString().trim() === '') ? movies : movies.filter(movie => {
            return (movie.title.match(query) != null) || (movie.overview.match(query) != null)
        })
    }

    buildStateObject = (movies, genres, query) => {
        const filterMoviesList = this.filterMovies(movies, query);
        const result = {
            query: query || '',
            queryResultSize: filterMoviesList.length+"",
            allMovies: movies,
            allGenres: genres,
            movieGenreList: this.buildMovieGenreList(genres, filterMoviesList),
            myList: filterMoviesList.filter(movie => (movie.my_list === true))
        }
        return result
    }

    componentDidMount = () => {
        this.FetchDataAndUpdateSAPPState()
    }

    buildMovieGenreList = (genreObjectArray, movies) => {
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

    searchHandle = (query) => {
        const that = this;
        return new Promise(function (resolve, reject) {
            that.setState(function (prevState) {
                return that.buildStateObject(prevState.allMovies, prevState.allGenres, query);
            }, function () {
                resolve([that.state.queryResultSize,that.state.myList.length])
            })
        })
    }

    render = () => {
        return (
            <Router>
                <Header search={this.searchHandle.bind(this)} />
                <Switch>
                    <Route path="/myList" render={() => (
                        <MovieList
                            genre='My List'
                            movieList={this.state.myList}
                            onClick={() => {
                                this.FetchDataAndUpdateSAPPState()
                            }}
                        />
                    )}/>
                    <Route path="/" render={() => (
                        <Fragment>
                            {this.state.movieGenreList.map(movieGenre => (
                                <MovieList
                                    key={movieGenre.id}
                                    genre={movieGenre.name}
                                    movieList={movieGenre.movieList}
                                    onClick={() => {
                                        this.FetchDataAndUpdateSAPPState()
                                    }}
                                />
                            ))}
                        </Fragment>
                    )}/>
                </Switch>
            </Router>
        );
    };
}

export default App;
