import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import "./boardCategory.css";

function BoardCategory() {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();

    const cards = [
        {
            bgImage: "/images/community.jpg",
            title: "자유게시판",
            description: "열린 대화의 장!",
            path: "/board/freeboard"
        },
        {
            bgImage: "/images/shortform.jpg",
            title: "숏폼 게시판",
            description: "숏폼으로 전하는 알코올 팁!",
            path: "/board/shortform"
        },
        {
            bgImage: "/images/event.jpg",
            title: "이벤트 게시판",
            description: "어떤 이벤트가 기다리고 있을까?",
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

export default BoardCategory;