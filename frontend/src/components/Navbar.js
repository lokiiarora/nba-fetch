import React from 'react';
import {
    Menu
} from 'antd';
import {
    Link
} from 'react-router-dom'
import logo from '../logo.png'

export default class NavbarCustom extends React.Component {
    
    state = {
        pathNameToKeyMap: null
    };


    componentDidMount = () => {
        this.mapPathNameToKey();
    }

    mapPathNameToKey = () => {
        let key = this.props.match.url.split("/")[1];
        this.setState(prevState => {
            let old = prevState;
            if(!key) old.pathNameToKeyMap = 'home'
            else {
                if(key === 'teams' || key === 'team') old.pathNameToKeyMap = 'team'
                else{
                    old.pathNameToKeyMap = 'standing'
                }
            }
            return Object.assign({}, old)
        })
    }

    toggle = () => {
        this.setState(prevState => {
            let old = prevState;
            old.isOpen = !old.isOpen;
            return Object.assign({},old);
        });
    }

    render() {
        const { pathNameToKeyMap } = this.state;
        const { className } = this.props;
        return (
            <Menu selectedKeys={[pathNameToKeyMap]}  className={className} mode="horizontal" theme="dark">
                <Menu.Item key="logo" className="logo">
                    <img src={logo} alt="NBA LOGO"/>
                </Menu.Item>
                <Menu.Item key="home">
                    <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="team">
                    <Link to="/teams">Teams</Link>
                </Menu.Item>
                <Menu.Item key="standing">
                    <Link to="/standings">Standings</Link>
                </Menu.Item>
            </Menu>
        );
    }
}