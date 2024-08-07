import React, { useState, useEffect, useRef } from 'react'
import './PinnedPost.css';


const PinnedPost = ()=>{
	
	const pinnedData = [
		{
			id: 1,
		//	admin_id: 1,
		//	admin_name: "일하는라이언",
			title: "1번공지",
			title2: "아아 1번공지 잘 들리십니까",
		//	content: "<div><img>img.ur</img><a>하위 여러분들 </a></div>l",
		//	writeday: "2024-01-01",
		//	like: 121,
		//	views: 200,
		},
		{
			id: 2,
			title: "2번공지",
			title2: "아아 2번공지 잘 들리십니까",
		},
		{
			id: 3,
			title: "3번공지",
			title2: "아아 3번공지 잘 들리십니까",
		},
	    {
			id: 4,
			title: "4번공지",
			title2: "아아 4번공지 잘 들리십니까",
		},
	    {
			id: 5,
			title: "5번공지",
			title2: "아아 5번공지 잘 들리십니까",
		},
	];
	
	const [idx, setIdx] = useState(0)
  	const idxRef = useRef(0)
	
  useEffect(() => {
    const updateIndex = () => {
      idxRef.current = (idxRef.current + 1) % pinnedData.length;
      setIdx(idxRef.current);
      setTimeout(updateIndex, 4000);
    };

    const timer = setTimeout(updateIndex, 4000);

    return () => clearTimeout(timer);
  }, [pinnedData.length]);
	
	
  return (
    <ul className="PinnedPost">
      <div className = "PinnedContainer" style={{ transform: `translateY(-${70 * idx}px)` }}>
        {pinnedData.map((item, idx) => {
          return (
            <li className="PinnedContent" key={idx}>
              <div className = "PinnedBox">
                <span className="PinnedHeader"> [공지]</span>
                <div className="PinnedTitle">{item['title']}</div>
                <div className="PinnedTitle2">{item['title2']}</div>
              </div>
            </li>
          );
        })}
      </div>
    </ul>
  );
}
export default PinnedPost;