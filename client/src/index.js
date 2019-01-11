import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import './index.css';
import NavBar from './components/Navbar';
import App from './components/App';
import Search from './components/Recipe/Search';
import AddRecipe from './components/Recipe/AddRecipe';
import RecipePage from './components/Recipe/RecipePage';
import Profile from './components/Profile/Profile';
import withSession from './components/withSession';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';

// import * as serviceWorker from './serviceWorker';
import ApolloClient from 'apollo-boost';    
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
    uri: 'https://react-graphql-jdelva.herokuapp.com/graphql',
    fetchOptions: {
        credentials: 'include'
    },
    request: operation => {
        const token = localStorage.getItem('token');
        operation.setContext({
            headers: {
                authorization: token
            }
        })
    },
    onError: ({ networkError }) => {
        if(networkError) {
            console.log('Network Error', networkError)

            // if(networkError.statusCode === 401){
            //     localStorage.removeItem('token')
            // }
        }
    }
});

const Root = ({ refetch, session }) => (
    <Router>
        <Fragment>
        <NavBar session={session}/>
            <Switch>
                <Route path="/" exact component={App}/>
                <Route path="/search" exact component={Search}/>
                <Route path="/recipes/add" exact render={props => <AddRecipe session={session} {...props}/>}/>
                <Route path="/recipes/:_id" exact component={RecipePage}/>
                <Route path="/profile" exact render={props => <Profile session={session} {...props}/>}/>
                <Route path="/signin" render={props => <Signin refetch={refetch} {...props}/>}/>
                <Route path="/signup" render={props => <Signup refetch={refetch} {...props}/>}/>
                <Redirect to = "/"/>
            </Switch>
        </Fragment>
    </Router>
)

const RootWithSession = withSession(Root)

ReactDOM.render(
    <ApolloProvider client={client}>
        <RootWithSession />
    </ApolloProvider>, 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
