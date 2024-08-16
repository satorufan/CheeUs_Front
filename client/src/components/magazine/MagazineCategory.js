import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
//import "./MagazineCategory.css";
import './Magazine.css';

function MagazineCategory() {
    const navigate = useNavigate();

    const cards = [
        {
            bgImage: "/images/popup.jpg",
            title: "이달의 POP-UP",
            description: "이번달에 열리는 술 POP-UP을 소개합니다.",
            path: "/magazine/popup"
        },
        {
            bgImage: "/images/tmi.jpg",
            title: "술 TMI",
            description: " 이 술에는 말이야.. 전해져오는 이야기가 있지..",
            path: "/magazine/tmi"
        },
        {
            bgImage: "/images/recipe.jpg",
            title: "섞어섞어 Recipe",
            description: "섞고~ 섞고~ 돌리고! 섞고~",
            path: "/magazine/recipe"
        },
        {
            bgImage: "/images/recommend.jpg",
            title: "이주의 술집추천",
            description: "이주의 핫한 술집은 어딜까?",
            path: "/magazine/recommend"
        },
    ];

    const handleCardClick = (path) => {
        navigate(path);
    };

    return (
        <div className="magazine-category-container">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="magazine-page-card"
                    onClick={() => handleCardClick(card.path)}
                    style={{ backgroundImage: `url(${card.bgImage})` }}
                >
                    <div className="magazine-page-content">
                        <div className="magazine-page-detail">
                            <h4 className="magazine-page-title">{card.title} <ArrowOutwardIcon /></h4>
                            <div className="magazine-page-title-content">{card.description}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MagazineCategory;