import React from "react";
import NavbarCustom from "../components/Navbar";
import StandingsHomeFeed from "../components/Standings";
import Banner from "../components/Banner";
import CustomFooter from '../components/CustomFooter';
import bannerImg from "../home-banner.png";
import background from "../workers/background.worker";
import { Layout, Card, Row, Col } from "antd";
import { TimeAgo } from "react-time-ago";
import { ClimbingBoxLoader } from "react-spinners";
class HomeScreen extends React.Component {
  constructor(props) {
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
      message: "fetchHomeData"
    });
  };

  componentDidMount = () => {
    this.initTasks();
  };

  componentWillUnmount = () => {
    this.fetchWorker.terminate();
  };

  workerThreadMessage = ({ data }) => {
    if (data.type) {
      switch (data.type) {
        case "success":
          this.setState(prevState => {
            let old = prevState;
            old.payload = { ...data.payload };
            old.loading = false;
            return Object.assign({}, old);
          });
          break;
        case "error":
          console.log("Error");
          break;
        default:
          break;
      }
    }
  };

  renderMainContent = () => {
    const { loading, payload } = this.state;
    const gridStyle = {
      width: "33%",
      textAlign: "center",
      padding: "10px"
    };
    if (!loading) {
      return (
        <div className="holder">
          <Banner src={bannerImg} positionStyle='left center' />
          <section className="scoreboard-home">
            <Card title="Recent Games">
              {payload.scoreboard.data.map((item, index) => {
                return (
                  <Card.Grid
                    key={`${index}`}
                    style={gridStyle}
                    className="card-grid-custom"
                  >
                    <Row className="card-row-headers-region" gutter={10}>
                      <Col span={8}>
                        <img
                          src={`https://cdn.nba.net/assets/logos/teams/secondary/web/${
                            item.hTeam.triCode
                          }.svg`}
                          className="team-logo"
                          alt=""
                        />
                      </Col>
                      <Col span={8}>
                        <span className="vertical-align">vs</span>
                      </Col>
                      <Col span={8}>
                        <img
                          src={`https://cdn.nba.net/assets/logos/teams/secondary/web/${
                            item.vTeam.triCode
                          }.svg`}
                          className="team-logo"
                          alt=""
                        />
                      </Col>
                    </Row>
                    <Row className="meta-region">
                      <p className="timing">
                        Starts at{" "}
                        <TimeAgo>{new Date(item.startTimeUTC)}</TimeAgo>{" "}
                      </p>
                      <p className="timing venue">
                        Venue: {item.arena.name},{item.arena.city}
                        <br />
                        {item.watch.broadcast.video ? (
                          item.watch.broadcast.video.deepLink ? (
                            item.watch.broadcast.video.deepLink[0] ? (
                              item.watch.broadcast.video.deepLink[0]
                                .desktopWeb ? (
                                <a
                                  target="_blank"
                                  className="watch-links"
                                  href={
                                    item.watch.broadcast.video.deepLink[0]
                                      .desktopWeb
                                  }
                                >
                                  Watch it here
                                </a>
                              ) : (
                                "No Links to Watch the game! :("
                              )
                            ) : (
                              "No Links to Watch the game! :("
                            )
                          ) : (
                            "No Links to Watch the game! :("
                          )
                        ) : (
                          "No Links to Watch the game! :("
                        )}
                      </p>
                    </Row>
                  </Card.Grid>
                );
              })}
            </Card>
          </section>
          <StandingsHomeFeed
            {...this.props}
            {...this.state.payload.standings}
          />
        </div>
      );
    }

    return null;
  };

  render() {
    const { loading } = this.state;
    return (
      <div className="homeScreen">
        <Layout className="main-layout">
          <Layout.Header>
            <NavbarCustom className="nav-menu" {...this.props} />
          </Layout.Header>
          <Layout.Content
            className={loading ? "main-layout loading" : "main-layout"}
          >
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

export default HomeScreen;
