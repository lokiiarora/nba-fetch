import React from 'react';
import {
    Layout
} from 'antd';
import Banner from '../components/Banner';
import CustomFooter from '../components/CustomFooter';
import BannerSrc from '../team-banner.png';
import {ClimbingBoxLoader} from 'react-spinners';
import NavbarCustom from '../components/Navbar';

class TeamsScreen extends React.Component {

    state = {
        loading: true
    }

    componentDidMount = () => {
        setTimeout(() => {
            this.setState(prevState => ({
                loading: false
            }))
        },1000);
    }

    renderMainContent = () => {
        const {loading} = this.state;

        if(!loading) {
            return (
                <div className="holder">
                    <Banner src={BannerSrc} />
                </div>
            );
        }


        return null;
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
                        {this.renderMainContent()}
                        <CustomFooter footerStyle={{
                            textAlign:'center'
                        }} show={!loading}>
                            All of this is made using <a href="https://nba.com/" target="_blank" rel="noopener noreferrer">NBA.com's</a> data that is harvested responsibily. <br/> All rights for this data is with the party mentioned above
                        </CustomFooter>
                    </Layout.Content>
                </Layout>
            </div>
        );
    }
}

export default TeamsScreen;