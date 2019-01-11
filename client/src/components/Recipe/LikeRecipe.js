import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import withSession from '../withSession';
import { LIKE_RECIPE, GET_RECIPE, UNLIKE_RECIPE } from '../../queries';

class LikeRecipe extends Component {

    state = {
        username: '',
        liked: false
    }

    componentDidMount(){
        if(this.props.session.getCurrentUser){
            const { username, favorites } = this.props.session.getCurrentUser;
            const { _id } = this.props;
            const prevLiked = favorites.findIndex(favorite => 
                favorite._id === _id
            ) > -1
            this.setState({ username, liked: prevLiked });
        }
    }

    handleClick = (likeRecipe, unlikeRecipe) => {
        this.setState(prevState => ({
            liked: !prevState.liked
        }), () => this.handleLike(likeRecipe, unlikeRecipe));
    }

    handleLike = async (likeRecipe, unlikeRecipe) => {
        
        const mutation = this.state.liked ? likeRecipe : unlikeRecipe
        
        try {
            await mutation();
            await this.props.refetch();
        } catch(e){
            console.error(e)
        }
        
    }

    updateCache = (cache, { data }, incrementer) => {
        const cachedMutation = incrementer > 0 ? data.likeRecipe : data.unlikeRecipe
        
        const { _id } = this.props;

        const { getRecipe } = cache.readQuery({
            query: GET_RECIPE,
            variables: { _id }
        })

        cache.writeQuery({
            query: GET_RECIPE,
            variables: { _id },
            data: {
                getRecipe: {...getRecipe, likes: cachedMutation.likes + incrementer }
            }
        })
    }

    render() {

        const { username, liked } = this.state;
        const { _id } = this.props;

        return (
            <Mutation mutation={UNLIKE_RECIPE} 
                variables={{ _id, username}}
                update={(cache, data) => this.updateCache(cache, data, -1)}>
                {unlikeRecipe => (
                    <Mutation mutation={LIKE_RECIPE}
                        variables={{ _id, username }}
                        update={(cache, data) => this.updateCache(cache, data, 1)}
                    >
                    { likeRecipe => (
                        username && 
                        <button onClick={() => this.handleClick(likeRecipe, unlikeRecipe)}>
                                {liked ? 'Unlike' : 'Like'}
                            </button>
                    )}
                    </Mutation>
                )}
            </Mutation>
        )
    }
}

export default withSession(LikeRecipe)