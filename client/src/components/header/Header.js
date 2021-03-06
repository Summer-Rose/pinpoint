import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Logo from '../logo/Logo';

import '../../index.scss';
import './Header.scss';

class Header extends Component {
    
    renderContent() {
        if (this.props.isLoading) {
            return <p>Loading...</p>
        }
        if (this.props.user === (null || false)) {
            return [
                <li className="Header__nav--item" key="1"><a className="Header__nav--item--text" href="/login">Login</a></li>,
                <li className="Header__nav--item" key="2"><a className="btn btn--yellow" href="/signup">Sign up for free</a></li>
            ];
        }
        return [
            <li className="Header__nav--item" key="1"><a className="Header__nav--item--text" href={this.props.linkHref}>{this.props.linkText}</a></li>,
            <li className="Header__nav--item" key="2"><a className="Header__nav--item--text" href="/api/logout">Logout</a></li>,
            <li className="Header__nav--item" key="3"><Link className="btn btn--yellow" to="/purchase">Buy credits</Link></li>
        ];
    }

    render() {
        return (
            <nav className="Header">
                <Logo className="Header__logo" logoClass="logo--header"/>
                <ul className="Header__nav">
                    {this.renderContent()}
                </ul>
            </nav>
        );
    }
}

function mapStateToProps({ auth: { user, isLoading } }) {
    return { user, isLoading };
}

export default connect(mapStateToProps)(Header);