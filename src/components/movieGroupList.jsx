import React, {Fragment} from "react";
import MovieList from "./movieList.jsx"

export default function movieGroupList(props) {
    return (!(props.groupList instanceof Array) || props.groupList.length === 0) ? "": (
        <Fragment>
            {props.groupList.map(group => (
                <MovieList key={group.id} {...group} onClick={props.onClick}/>
            ))}
        </Fragment>
    )
}