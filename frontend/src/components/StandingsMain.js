import React from "react";
import { Row, Icon} from "antd";
import StandingsMainAdapter from './StandingsMainAdapter';
import {ClimbingBoxLoader} from 'react-spinners';
import tagManager from "../workers/tag.worker";

class StandingsMain extends React.Component {
  constructor(props) {
    super(props);
    this.tagManager = tagManager();
    this.state = {
      loading: true,
      payload: {
        conf: {
          east: [],
          west: []
        },
        div: {
          east: {
            atlantic: [],
            central: [],
            southeast: []
          },
          west: {
            northwest: [],
            pacific: [],
            southwest: []
          }
        }
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
    const { conf, div } = this.props;
    console.log(this.props);
    this.initTasks({ conf, div });
  };

  initTasks = obj => {
    this.tagManager.onmessage = this.tagonMessage;
    this.tagManager.postMessage({
      type: "tagTotal",
      payload: {
        player: JSON.parse(window.localStorage.getItem("player")),
        ...obj
      }
    });
  };

  tagonMessage = ({ data }) => {
    switch (data.type) {
      case "success":
        console.log(data);
        this.setState(prevState => {
          let old = prevState;
          old.payload = data.payload;
          old.loading = false;
          return Object.assign({}, old);
        });
        break;
      case "error":
        console.log(data.payload);
        break;
      default:
        break;
    }
  };

  componentWillUnmount = () => this.tagManager.terminate();

  renderMainContent = () => {
    const { loading, payload } = this.state;
    const { conf, div } = payload;

    if (!loading) {
      return (
        <div className="inner-standings">
          <Row className="header-row-standings">Conference East Standings</Row>
          <StandingsMainAdapter data={conf.east} superIndex={1} settings={this.carouselSettings} />
          <Row className="header-row-standings">Conference West Standings</Row>
          <StandingsMainAdapter data={conf.west} superIndex={2} settings={this.carouselSettings} />
          <Row className="header-row-standings">Division East Atlantic</Row>
          <StandingsMainAdapter data={div.east.atlantic} superIndex={3} settings={this.carouselSettings} />
          <Row className="header-row-standings">Division East Central</Row>
          <StandingsMainAdapter data={div.east.central} superIndex={4} settings={this.carouselSettings} />
          <Row className="header-row-standings">Division South East</Row>
          <StandingsMainAdapter data={div.east.southeast} superIndex={5} settings={this.carouselSettings} />
          <Row className="header-row-standings">Division North West</Row>
          <StandingsMainAdapter data={div.west.northwest} superIndex={6} settings={this.carouselSettings} />
          <Row className="header-row-standings">Division West Pacific</Row>
          <StandingsMainAdapter data={div.west.pacific} superIndex={7} settings={this.carouselSettings} />
          <Row className="header-row-standings">Division South West</Row>
          <StandingsMainAdapter data={div.west.southwest} superIndex={1} settings={this.carouselSettings} />
        </div>
      );
    }

    return null;
  };

  render() {
    const {loading} = this.state;
    return (
      <section className={`standings standings-main${loading ? ' standings-loading':''}`}>
        <ClimbingBoxLoader color="#000" loading={loading} size={100} />
        {this.renderMainContent()}
      </section>
    );
  }
}

export default StandingsMain;
