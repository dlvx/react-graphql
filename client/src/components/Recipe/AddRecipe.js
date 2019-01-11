import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import withAuth from '../withAuth';
import Error from '../Error';
import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from '../../queries'

const initialState = {
    name: '',
    category: 'Breakfast',
    instructions: '',
    description: '',
    username: ''
}

class AddRecipe extends Component {

    state = {...initialState};

    componentDidMount(){
        const username = this.props.session.getCurrentUser.username
        this.setState({
            username
        })
    }

    clearState = () => {
        this.setState({...initialState})
    }

    handleChange = e => {
        const { name, value } = e.target;

        this.setState({
            [name] : value
        })
    }

    validateForm = () => {
        const { 
            name,
            category,
            description, 
            instructions
        } = this.state;

        const isInvalid = !name || !category 
            || !description || !instructions 

        return isInvalid;
    }

    handleSubmit = async (e, addRecipe) => {
        e.preventDefault();
            
        try {
            await addRecipe()
            this.clearState();
            this.props.history.push('/')         
        } catch(e) {
            console.error(e)
        }
    }

    updateCache = (cache, { data: { addRecipe }}) => {
        const { getAllRecipes } = cache.readQuery({
            query: GET_ALL_RECIPES
        })

        cache.writeQuery({
            query: GET_ALL_RECIPES,
            data: {
                getAllRecipes: [addRecipe, ...getAllRecipes]
            }
        })
    }
    
    render(){

        const { 
            name,
            category,
            description, 
            instructions,
            username
        } = this.state;

        const mutation_variables = {
            name,
            category,
            description, 
            instructions,
            username
        }

        return (
            <Mutation mutation={ADD_RECIPE}
                variables={mutation_variables}
                refetchQueries={() => [
                    { query: GET_USER_RECIPES, variables: { username } }
                ]}
                update={this.updateCache}>
                { ( addRecipe, { data, loading, error }) => (
                    <div className="App">
                        <h2>Add Recipe</h2>
                        <form className="form" onSubmit={(e) => this.handleSubmit(e, addRecipe)}>
                            <input type="text" 
                                name="name"
                                placeholder="Recipe Name"
                                value={name}
                                onChange={this.handleChange} />
                            <select name="category"
                                value={category}
                                onChange={this.handleChange}>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                                <option value="Snack">Snack</option>
                            </select>
                            <input type="text" 
                                name="description"
                                placeholder="Add description"
                                value={description}
                                onChange={this.handleChange} />
                            <textarea type="text" 
                                name="instructions"
                                placeholder="Add instructions"
                                value={instructions}
                                onChange={this.handleChange} />
                            <button 
                                disabled={ loading || this.validateForm() }
                                type="submit" 
                                className="button-primary"
                            >
                                Submit
                            </button>
                            { error && <Error error={error} />}
                        </form>
                    </div>
                )}
            </Mutation>
        )

    }
};



export default withAuth(session => session && session.getCurrentUser)(AddRecipe);