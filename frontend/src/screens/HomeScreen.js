import React from 'react';
import NavbarCustom from '../components/Navbar';
import Banner from '../components/Banner';
import bannerImg from '../banner.jpg';
import background from '../background.worker';
import {
    Layout,
    Card
} from 'antd';
import {ClimbingBoxLoader} from 'react-spinners';


class HomeScreen extends React.Component {

    constructor(props){
        super(props);
        this.fetchWorker = background();
        this.state = {
            loading: true,
            payload: {}
        };
    }

    initTasks = () => {
        this.fetchWorker.onmessage = this.workerThreadMessage;
        this.fetchWorker.postMessage({
            message: 'fetchHomeData'
        });
    }

    componentDidMount = () => {
        this.initTasks();
    }

    componentWillUnmount = () => {
        this.fetchWorker.terminate();
    }

    workerThreadMessage = ({ data }) => {
        if(data.type){
            switch(data.type){
                case 'success':
                    this.setState(prevState => {
                        let old = prevState;
                        old.payload = {...data.payload};
                        console.log(data);
                        old.loading = false;
                        return Object.assign({},old);
                    });
                    break;
                case 'error':
                    console.log("Error");
                    break;
                default:
                    break;
            }
        }
    }

    renderMainContent = () => {
        const { loading, payload } = this.state;
        const gridStyle = {
            width: '33%',
            textAlign: 'center',
            padding: '10px'
        };
        if(!loading){
            return (
                <div className="holder">
                    <Banner src={bannerImg} />
                    <Card>
                        {
                            payload.scoreboard.data.map((item,index) => {
                                return (
                                    <Card.Grid key={`${index}`} gridStyle={gridStyle} >
                                        {
                                            JSON.stringify(item).slice(0,100)
                                        }
                                    </Card.Grid>
                                );
                            })
                        }
                    </Card>
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
                    </Layout.Content>
                </Layout>
            </div>
        );
    }
}

export default HomeScreen;