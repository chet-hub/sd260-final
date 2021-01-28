import React from "react";
import * as MovieAPI from '../lib/MovieAPI';

export default class Movie extends React.Component {
    constructor(props) {
        super(props)
        this.state = { ...props };
    }

    addButtonHandle = ()=>{

        if(this.state.my_list === false){
            MovieAPI.addToList({id:this.state.id}).then(() => {
                this.setState((prevState)=>{
                    prevState.onClick({id:this.state.id, my_list:true});
                    return {my_list:true}
                })
            })
        }else{
            MovieAPI.removeFromList({id:this.state.id}).then(() => {
                this.setState((prevState)=>{
                    prevState.onClick({id:this.state.id, my_list:false});
                    return {my_list:false}
                })
            })
        }
    }

    render = ()=>{
        return (
            <div className="movie">
                <img src={this.state.img} alt="Movie poster" />
                <div className="overlay">
                    <div className="title">{this.state.title}</div>
                    <div className="rating">{this.state.vote_average}/10</div>
                    <div className="plot">
                        {this.state.overview}
                    </div>
                    <div data-toggled={this.state.my_list} className="listToggle">
                        <div onClick={this.addButtonHandle}>
                            <i className="fa fa-fw fa-plus"></i>
                            <i className="fa fa-fw fa-check"></i>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

