import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ApolloConsumer } from 'react-apollo'
import { SEARCH_RECIPES } from '../../queries'

const SearchItem = ({ recipe }) => (
    <li>
        <Link to={`/recipes/${recipe._id}`}>
            <h4>{recipe.name}</h4>
        </Link>
        <p>Likes: {recipe.likes}</p>
    </li>
)

class Search extends Component {

    state = {
        searchResults: []
    }

    handleChange = ({ searchRecipes : searchResults }) => {
        this.setState({
            searchResults
        })
    }

    render(){

        const { searchResults } = this.state
        return (
            <ApolloConsumer>
                {client => {
                    
                    return (<div className="App">
                        <input type="search" placeholder="Search for recipes"
                            onChange={ async e => {
                                e.persist();
                                const { data } = await client.query({
                                    query: SEARCH_RECIPES,
                                    variables: {
                                        searchTerm: e.target.value
                                    }
                                })

                                this.handleChange(data)
                            }}
                        />
                        <ul>
                            {searchResults.map(recipe => 
                                <SearchItem key={recipe._id} recipe={recipe} />
                            )}
                        </ul>
                    </div>)
                }}
            </ApolloConsumer>
        )
    }
}

export default Search;