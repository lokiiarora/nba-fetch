import React from "react";
import { Row, Carousel, Col, Avatar } from "antd";
import { Link } from "react-router-dom";
import _ from "underscore";

export default ({ data, settings, superIndex }) => (
  <Row gutter={40} className="content-row-standings">
    <Carousel {...settings}>
      {_.map(data, (item, index) => {
        return (
          <Col
            className={"slide-standings"}
            key={`carousel-${superIndex}-${index}`}
            span={6}
          >
            <div className="slide-standings-item">
              <Link to={`/team/${item.teamTag}`}>
                <Avatar
                  size="large"
                  className="standings-teamTag"
                  src={`https://cdn.nba.net/assets/logos/teams/secondary/web/${
                    item.teamTag
                  }.svg`}
                />
              </Link>
              <div className="meta">
                <h3>Rank {index + 1}</h3>
                <Link to={`/team/${item.teamTag}`}>
                  <strong>
                    {item.city} {item.nickname}
                  </strong>
                </Link>
                <p>Win % : {item.winPctV2}</p>
              </div>
            </div>
          </Col>
        );
      })}
    </Carousel>
  </Row>
);
