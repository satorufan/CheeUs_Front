import React, { useState } from "react";
import TinderCard from "react-tinder-card";
import "./tinderCards.css";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

function TinderCards() {
  const profiles = [
    {
      nickname: '일론이형',
      photo: `https://media.gettyimages.com/photos/of-tesla-and-space-x-elon-musk-attends-the-2015-vanity-fair-oscar-picture-id464172224?k=6&m=464172224&s=612x612&w=0&h=M9Wf9-mcTJBLRWKFhAX_QGVAPXogzxyvZeCiIV5O3pw=`,
      birth: '1971-06-28',
      gender: 1,
      tags: '술 조아, 개소리 좋아',
      location: 'Palo Alto, CA',
      intro: '화성 갈끄니까아~'
    },
    {
      nickname: '아마존',
      photo: `https://media.gettyimages.com/photos/amazon-ceo-jeff-bezos-founder-of-space-venture-blue-origin-and-owner-picture-id1036094130?k=6&m=1036094130&s=612x612&w=0&h=3tKtZs6_SIXFZ2sdRUB4LjAf_GlfCMekP2Morwkt5EM=`,
      birth: '1964-01-12',
      gender: 1,
      tags: '술좀 사가라',
      location: 'Medina, WA',
      intro: '테무랑 알리가 날 괴롭혀'
    }
  ];

  const swiped = (direction, nickname) => {
    console.log(`I'm in swiped`, nickname);
    // Handle swiped logic here
  };

  const outOfFrame = (nickname) => {
    console.log(`Enough tinder for today for`, nickname);
    // Handle out of frame logic here
  };

  return (
    <div className="tinderCard_container">
      {profiles.map((profile, index) => (
        <TinderCard
          key={index}
          className="swipe"
          preventSwipe={["up", "down"]}
          onSwipe={(dir) => swiped(dir, profile.nickname)}
          onCardLeftScreen={() => outOfFrame(profile.nickname)}
        >
          <div
            className="card"
            style={{
              backgroundImage: `url(${profile.photo})`,
            }}
          >
            <Card className="profile_card">
              <Card.Body>
                <Card.Title>{profile.nickname}</Card.Title>
                <Card.Text>{profile.intro}</Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>Birth: {profile.birth}</ListGroup.Item>
                <ListGroup.Item>Location: {profile.location}</ListGroup.Item>
                <ListGroup.Item>Tags: {profile.tags}</ListGroup.Item>
              </ListGroup>
            </Card>
          </div>
        </TinderCard>
      ))}
    </div>
  );
}

export default TinderCards;