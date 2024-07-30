const profiles = [
    {
        "id": 1,
        "nickname": "JohnDoe",
        "photo": "https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202108%2F20210825184651412.png", // 기본 사진
        "photos": ["https://www.w3schools.com/w3images/mac.jpg", "https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202108%2F20210825184651412.png"], // profile_photo 테이블의 사진들
        "tel": "1234567890",
        "birth": "19900101",
        "gender": 1,
        "tags": "Web, UI/UX, Design",
        "match_ok": 0,
        "location_ok": 0,
        "latitude": 35.8242,
        "longitude": 127.1480,
        "confirmedlist": "",
        "intro": "Front-end Developer가되고싶은 어쩌고 저쩌고메롱메롱어니마ㅓ;ㅣㅏㅓ미ㅏㅓㅎ;ㅣ마ㅓㅇㅎ;ㅏㅣㅓㅁ;ㅏㅣㅇ험;ㅏㅣㅓㅇㅎ;ㅣㅁ",
        "popularity": 150
    },
    {
        "id": 2,
        "nickname": "JaneMac",
        "photo": 102, // 기본 사진
        "photos": ["https://www.w3schools.com/w3images/mac.jpg", "https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202108%2F20210825184651412.png"], // profile_photo 테이블의 사진들
        "tel": "0987654321",
        "birth": "19920202",
        "gender": 2,
        "tags": "Backend, Database, DevOps",
        "match_ok": 0,
        "location_ok": 1,
        "latitude": 35.7168,
        "longitude": 126.7346,
        "confirmedlist": "",
        "intro": "Back-end Developer",
        "popularity": 200
    },
    {
        "id": 3,
        "nickname": "AliceSmith",
        "photo": 103, // 기본 사진
        "photos": ["https://www.w3schools.com/w3images/mac.jpg", "https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202108%2F20210825184651412.png"],
        "tel": "1357924680",
        "birth": "19950315",
        "gender": 2,
        "tags": "Mobile App, iOS Development, Swift",
        "match_ok": 1,
        "location_ok": 1,
        "latitude": 37.7749,
        "longitude": -122.4194,
        "confirmedlist": "",
        "intro": "iOS Developer",
        "popularity": 180
    },
    {
        "id": 4,
        "nickname": "BobJohnson",
        "photo": 104, // 기본 사진
        "photos": ["https://search.pstatic.net/sunny/?src=https%3A%2F%2Fi.pinimg.com%2F736x%2F38%2Fd4%2F7c%2F38d47c3e4bc80d7d0adf2dd77514dafc.jpg&type=sc960_832","https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA2MDJfNjkg%2FMDAxNzE3Mjg4MjI0MDEw.RABBhdpmgY2_o7BRcUpNivr1Q9wt_7ubCTXcsHDDLMog.FzsE6tEJjcS-7iAWuatyT4He9uaImz2ST_RZniu_Vk4g.JPEG%2FIMG_6419.jpg&type=sc960_832"], // profile_photo 테이블의 사진들
        "tel": "2468013579",
        "birth": "19881120",
        "gender": 1,
        "tags": "Full-stack, JavaScript, Node.js",
        "match_ok": 1,
        "location_ok": 1,
        "latitude": 35.6750,
        "longitude": 126.7431,
        "confirmedlist": "",
        "intro": "Full-stack Developer 안녕하세요 선생님 안녕 친구야 인사하는 어린이 착한 어린이 아침해가 떴습니다 자리에서일어나서 세수하고 어쩌고 해야 착한 어린이",
        "popularity": 160
    },
    {
        "id": 5,
        "nickname": "EmilyBrown",
        "photo": 105, // 기본 사진
        "photos": ["https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20160526_113%2Fberry88jin_14642337344703mgR1_PNG%2F%25BD%25BA%25C5%25A9%25B8%25B0%25BC%25A6_2016-05-26_%25BF%25C0%25C8%25C4_12.34.32.png&type=sc960_832","https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDA1MDRfMjEg%2FMDAxNTg4NTI4MDI5OTY3.bz6oPZ-qK5UBkljcMdNF-slH64yxDXwKOT3DaWHLKJog.73JHgNkpSF-rZ_jixItHwglxXnbnVs5L0DhrtNpVdBsg.JPEG.njj04193%2FIMG_5901.JPG&type=sc960_832"], // profile_photo 테이블의 사진들
        "tel": "9876543210",
        "birth": "19971005",
        "gender": 2,
        "tags": "Machine Learning, Python, Data Science",
        "match_ok": 1,
        "location_ok": 1,
        "latitude": 35.6857,
        "longitude": 126.7114,
        "confirmedlist": "",
        "intro": "Data Scientist",
        "popularity": 190
    }
];

export default profiles;