import React from "react";
import Movie from "./movie.jsx"

export default function MovieList(props) {
    let fn = (props.onClick instanceof Function) ?props.onClick : ()=>{};
    return props.movieList.length === 0 ? "": (
        <div className="titleList">
            <div className="title">
                <h1>{props.genre}</h1>
                <div className="titles-wrapper">
                    {props.movieList.map(movie => (
                        <Movie key={movie.id}
                               id={movie.id}
                               img={movie.poster_path}
                               overview={movie.overview}
                               title={movie.title}
                               vote_average={movie.vote_average}
                               my_list={movie.my_list}
                               onClick={fn}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}