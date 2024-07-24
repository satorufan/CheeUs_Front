import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import "./MagazineCategory.css";

function MagazineCategory() {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();

    const cards = [
        {
            bgImage: "/images/popup.jpg",
            title: "이달의 POP-UP",
            description: "이번달에 열리는 술 POP-UP을 소개합니다.",
            path: "/board/freeboard"
        },
        {
            bgImage: "/images/tmi.jpg",
            title: "술 TMI",
            description: " 이 술에는 말이야.. 전해져오는 이야기가 있지..",
            path: "/board/shortform"
        },
        {
            bgImage: "/images/recipe.jpg",
            title: "섞어섞어 Recipe",
            description: "섞고~ 섞고~ 돌리고! 섞고~",
            path: "/board/eventboard"
        },
        {
            bgImage: "/images/recomend.jpg",
            title: "이주의 술집추천",
            description: "이주의 핫한 술집은 어딜까?",
            path: "/board/eventboard"
        },
    ];

    const handleCardClick = (index, path) => {
        if (activeIndex === index) {
            navigate(path); // 같은 카드를 두 번 클릭하면 해당 경로로 이동
        } else {
            setActiveIndex(index); // 다른 카드를 클릭하면 활성화
        }
    };

    return (
        <div className="board-category-container">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`board-page-card ${activeIndex === index ? "active" : ""}`}
                    onClick={() => handleCardClick(index, card.path)}
                    style={{ backgroundImage: `url(${card.bgImage})` }}
                >
                    <div className="board-page-content">
                        <div className="board-page-detail">
                            <h4 className="board-page-title">{card.title} <ArrowOutwardIcon /></h4>
                            <div className="board-page-title-content">{card.description}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MagazineCategory;