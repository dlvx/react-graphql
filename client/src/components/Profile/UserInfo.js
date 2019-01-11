import React from 'react';
import { Link } from 'react-router-dom';

const formatDate = date => {
    const newDate = new Date(date).toLocaleDateString('en-US')
    const newTime = new Date(date).toLocaleTimeString('en-US')

    return `${newDate} at ${newTime}`
}

const UserInfo = ({ session }) => {
    
    const user = session.getCurrentUser
    
    return <div className="App">
        <h3>User Info </h3>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Join Date: {formatDate(user.joinDate)}</p>
        <ul>
            <h3>{user.username}'s Favorites</h3>
            {user.favorites.map(favorite =>
                <li key={`fav_${favorite._id}`}>
                    <Link to={`/recipes/${favorite._id}`}><p>{favorite.name}</p></Link>
                </li>
            )}
            {!user.favorites.length &&
                <p><strong>You have no favorites</strong></p>
            }
        </ul>
    </div>
};



export default UserInfo;