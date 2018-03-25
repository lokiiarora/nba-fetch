import React from 'react';
import {
    Layout
} from 'antd';
import NavbarCustom from '../components/Navbar';
import {ClimbingBoxLoader} from 'react-spinners';


class ScoreboardScreen extends React.Component {

    state = {
        loading: true
    }

    render() {
        const { loading } = this.state;
        return (
            <div className="homeScreen">
                <Layout className="main-layout">
                    <Layout.Header>
                        <NavbarCustom className="nav-menu" {...this.props} />
                    </Layout.Header>
                    <Layout.Content className={(loading)? "main-layout loading": "main-layout"}>
                        <ClimbingBoxLoader color="#000" loading={loading} size={100} />
                    </Layout.Content>
                </Layout>
            </div>
        );
    }
}


export default ScoreboardScreen;