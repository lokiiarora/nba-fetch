import React from "react";
import { Layout, Row, Icon, Avatar, Col, Carousel } from "antd";
import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import CustomFooter from "../components/CustomFooter";
import tagManager from "../workers/tag.worker";
import BannerSrc from "../team-banner.png";
import { ClimbingBoxLoader } from "react-spinners";
import NavbarCustom from "../components/Navbar";

class SpecificTeamScreen extends React.Component {
  constructor(props) {
    super(props);
    this.tagManager = tagManager();
    this.state = {
      loading: true,
      payload: {
        metaData: {},
        roster: []
      }
    };
  }

  carouselSettings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    prevArrow: <Icon type="left-circle" />,
    nextArrow: <Icon type="right-circle" />
  };

  componentDidMount = () => {
    this.initTasks();
  };

  initTasks = () => {
    this.tagManager.onmessage = this.threadMessage;
    const { teamID } = this.props.match.params;
    this.tagManager.postMessage({
      type: "getTeamDataAndRoster",
      payload: {
        player: JSON.parse(window.localStorage.getItem("player")),
        id: teamID
      }
    });
  };

  threadMessage = ({ data }) => {
    if (data.type) {
      switch (data.type) {
        case "success":
          this.setState(prevState => {
            let old = prevState;
            old.payload = data.payload;
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
    const { teamID } = this.props.match.params;

    if (!loading) {
      return (
        <div className="holder">
          <Banner src={BannerSrc} />
          <Row align="left" className="header-row-standings align-left">
            <Link to="/teams">
              <Icon type="left" />Go Back to Teams
            </Link>
          </Row>
          <Row align="center" className="header-row-standings align-center">
            <Col span={6} className="avatar-div">
              <Avatar
                className="full-flex"
                src={`https://cdn.nba.net/assets/logos/teams/secondary/web/${teamID}.svg`}
              />
              <strong>
                {payload.roster[0][0].teamData.city}{" "}
                {payload.roster[0][0].teamData.nickname}{" "}
              </strong>
              <p>
                Division Rank: <strong>{payload.metaData.divRank}</strong>
              </p>
              <p>
                Conference Rank: <strong>{payload.metaData.confRank}</strong>
              </p>
              <p>
                <strong className="success">{payload.metaData.win}</strong> wins
                this season
              </p>
              <p>
                <strong className="loss">{payload.metaData.loss}</strong> losses
                this season
              </p>
            </Col>
          </Row>
          <Row className="header-row-standings align-left">
            <strong>Roster</strong>
          </Row>
          <Row
            gutter={40}
            className="content-row-standings standings standings-main"
          >
            <Carousel {...this.carouselSettings}>
              {payload.roster.map((playerTuple, index) => {
                console.log(playerTuple);
                return (
                  <div
                    key={`Headshots-${index}`}
                    className="player-headshots-tuple"
                  >
                    <div className="headshot-div">
                      <Avatar
                        className="full-flex eightypercent"
                        src={`http://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${
                          playerTuple[0].personId
                        }.png`}
                      />
                      <p className="name">{playerTuple[0].firstName}{" "}{playerTuple[0].lastName}</p>
                    </div>
                    {playerTuple[1] && (
                      <div className="headshot-div">
                        <Avatar
                          className="full-flex eightypercent"
                          src={`http://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${
                            playerTuple[1].personId
                          }.png`}
                        />
                        <p className="name">{playerTuple[1].firstName}{" "}{playerTuple[1].lastName}</p>
                        
                      </div>
                    )}
                  </div>
                );
              })}
            </Carousel>
          </Row>
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
            <CustomFooter
              footerStyle={{
                textAlign: "center"
              }}
              show={!loading}
            >
              All of this is made using{" "}
              <a
                href="https://nba.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                NBA.com's
              </a>{" "}
              data that is harvested responsibily. <br /> All rights for this
              data is with the party mentioned above
            </CustomFooter>
          </Layout.Content>
        </Layout>
      </div>
    );
  }
}

export default SpecificTeamScreen;
