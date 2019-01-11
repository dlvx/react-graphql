import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { SIGNIN_USER } from '../../queries'
import Error from '../Error';

const initialState = {
    username: "",
    password: "",
}

class Signin extends Component {

    state = {...initialState};

    clearState = () => {
        this.setState({...initialState})
    }

    handleChange = event => {
        const { name, value } = event.target;

        this.setState({
            [name]: value
        })
    }

    handleSubmit = async (event, signinUser) => {
        event.preventDefault();

        try {
            const { data } = await signinUser()
            localStorage.setItem('token', data.signinUser.token)
            this.clearState();
            await this.props.refetch()
            this.props.history.push('/')
        } catch(e) {
            console.error(e)
        }
        
    }

    validateForm = () => {
        const { username, password } = this.state
        const isInvalid = !username || !password

        return isInvalid
    }

    render(){

        const { username, password } = this.state
        
        return (
            <div className="App">
                <h2 className="App">Signin</h2>
                <Mutation mutation={SIGNIN_USER}
                    variables={{ username, password }}>
                    {(signinUser, { data, loading, error }) => {

                        return <form className="form" onSubmit={(event) => this.handleSubmit(event, signinUser)}>
                            <input type="text" name="username" value={username} placeholder="Username" onChange={this.handleChange}/>
                            <input type="password" name="password" value={password} placeholder="Password" onChange={this.handleChange}/>
                            <button className="button-primary" 
                                disabled={loading || this.validateForm()}
                            >
                                Submit
                            </button>

                            { error && <Error error={error}/>}
                        </form>
                    }}
                </Mutation>
            </div>
        )
    }
}

export default Signin