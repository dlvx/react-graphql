import React from 'react';
import { Query } from 'react-apollo';
import { GET_RECIPE } from '../../queries';
import LikeRecipe from './LikeRecipe';

const RecipePage = ({ match }) => {
    const { _id } = match.params

    return <Query query={GET_RECIPE} variables={{ _id }}>
        {({ data, loading, error }) => {
            if(loading) return <div>Loading</div>
            if(error) return <div>Error</div>

            const recipe = data.getRecipe

            const {
                name, 
                category, 
                description,
                instructions,
                likes,
                username
            } = recipe

            return (
                <div className="App">
                    <h2>{name}</h2>
                    <p>Category: {category}</p>
                    <p>Description: {description}</p>
                    <p>Instructions: {instructions}</p>
                    <p>Likes: {likes}</p>
                    <p>Created By: {username}</p>
                    <LikeRecipe _id={_id}/>
                </div>
            )
        }}
    </Query>
};



export default RecipePage;