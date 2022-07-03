import React from "react";

class Card extends React.Component{

    render(){
        return(
            <div className="mb-3">
                <h3 className="card-header">{this.props.title}</h3>
                <div className="card-body">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Card