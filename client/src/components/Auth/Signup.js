import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { SIGNUP_USER } from '../../queries'
import Error from '../Error';

const initialState = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: ""
}

class Signup extends Component {

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

    handleSubmit = async (event, signupUser) => {
        event.preventDefault();

        try {
            const { data } = await signupUser()
            localStorage.setItem('token', data.signupUser.token)
            this.clearState();
            await this.props.refetch()
            this.props.history.push('/')
        } catch(e) {
            console.error(e)
        }
        
    }

    validateForm = () => {
        const { username, email, password, passwordConfirmation } = this.state
        const isInvalid = !username || !email || !password
        || password !== passwordConfirmation;

        return isInvalid
    }

    render(){

        const { username, email, password, passwordConfirmation } = this.state

        return (
            <div className="App">
                <h2 className="App">Signup</h2>
                <Mutation mutation={SIGNUP_USER}
                    variables={{ username, email, password }}>
                    {(signupUser, { data, loading, error }) => {

                        return <form className="form" onSubmit={(event) => this.handleSubmit(event, signupUser)}>
                            <input type="text" name="username" value={username} placeholder="Username" onChange={this.handleChange}/>
                            <input type="email" name="email" value={email} placeholder="Email" onChange={this.handleChange}/>
                            <input type="password" name="password" value={password} placeholder="Password" onChange={this.handleChange}/>
                            <input type="password" name="passwordConfirmation" value={passwordConfirmation} placeholder="Confirm Password" onChange={this.handleChange}/>
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

export default Signup