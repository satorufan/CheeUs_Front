const profiles = [
    {
        "id": 1,
        "nickname": "JohnDoe",
        "photo": 101, // 기본 사진
        "photos": [101, 102], // profile_photo 테이블의 사진들
        "tel": "1234567890",
        "birth": "19900101",
        "gender": 1,
        "tags": "Web, UI/UX, Design",
        "match_ok": 0,
        "location_ok": 0,
        "latitude": "35.8242",
        "longitude": "127.1480",
        "confirmedlist": "",
        "intro": "Front-end Developer가되고싶은 어쩌고 저쩌고메롱메롱어니마ㅓ;ㅣㅏㅓ미ㅏㅓㅎ;ㅣ마ㅓㅇㅎ;ㅏㅣㅓㅁ;ㅏㅣㅇ험;ㅏㅣㅓㅇㅎ;ㅣㅁ",
        "popularity": 150
    },
    {
        "id": 2,
        "nickname": "JaneMac",
        "photo": 102, // 기본 사진
        "photos": [102], // profile_photo 테이블의 사진들
        "tel": "0987654321",
        "birth": "19920202",
        "gender": 2,
        "tags": "Backend, Database, DevOps",
        "match_ok": 0,
        "location_ok": 1,
        "latitude": "35.7168",
        "longitude": "126.7346",
        "confirmedlist": "",
        "intro": "Back-end Developer",
        "popularity": 200
    },
    {
        "id": 3,
        "nickname": "AliceSmith",
        "photo": 103, // 기본 사진
        "photos": [103, 104], // profile_photo 테이블의 사진들
        "tel": "1357924680",
        "birth": "19950315",
        "gender": 2,
        "tags": "Mobile App, iOS Development, Swift",
        "match_ok": 1,
        "location_ok": 1,
        "latitude": "37.7749",
        "longitude": "-122.4194",
        "confirmedlist": "",
        "intro": "iOS Developer",
        "popularity": 180
    },
    {
        "id": 4,
        "nickname": "BobJohnson",
        "photo": 104, // 기본 사진
        "photos": [104], // profile_photo 테이블의 사진들
        "tel": "2468013579",
        "birth": "19881120",
        "gender": 1,
        "tags": "Full-stack, JavaScript, Node.js",
        "match_ok": 1,
        "location_ok": 1,
        "latitude": "35.6750",
        "longitude": "126.7431",
        "confirmedlist": "",
        "intro": "Full-stack Developer 안녕하세요 선생님 안녕 친구야 인사하는 어린이 착한 어린이 아침해가 떴습니다 자리에서일어나서 세수하고 어쩌고 해야 착한 어린이",
        "popularity": 160
    },
    {
        "id": 5,
        "nickname": "EmilyBrown",
        "photo": 105, // 기본 사진
        "photos": [105, 106], // profile_photo 테이블의 사진들
        "tel": "9876543210",
        "birth": "19971005",
        "gender": 2,
        "tags": "Machine Learning, Python, Data Science",
        "match_ok": 1,
        "location_ok": 1,
        "latitude": "35.6857",
        "longitude": "126.7114",
        "confirmedlist": "",
        "intro": "Data Scientist",
        "popularity": 190
    }
];

export default profiles;