import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {
    renderContent() {
       switch (this.props.auth) {
           case null:
                return;
           case false:
                return [
                    <li key="1"><a href="/auth/google">Login with Google</a></li>,
                    <li key="2"><a href="/auth/facebook">Login with Facebook</a></li>
                ];
           default: 
                return [
                    <li key="1"><Link to="/purchase">Add credits</Link></li>,
                    <li key="2">Credits: {this.props.auth.credits}</li>,
                    <li key="3"><a href="/api/logout">Logout</a></li>
                ];
       }
    }

    render() {
        return (
            <nav>
                <div className="nav-wrapper">
                    <Link 
                        to={this.props.auth ? '/surveys' : '/' } 
                        className="left brand-logo">PinPoint</Link>
                    <ul className="right">
                        {this.renderContent()}
                    </ul>
                </div>
            </nav>
        );
    }
}

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(Header);