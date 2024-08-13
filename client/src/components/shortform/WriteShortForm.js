import React, { useState, useRef, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import '@toast-ui/editor/dist/toastui-editor.css';
import ToastEditor from '../toast/ToastEditor';
import { addBoard } from '../../store/BoardSlice';
import { fetchUserProfile, selectUserProfile } from '../../store/ProfileSlice';
import { AuthContext } from '../login/OAuth';
import swal from 'sweetalert';
import { jwtDecode } from 'jwt-decode';
import './writeShortForm.css';
import { Form } from 'react-bootstrap';
import BoardDetailTop from '../board/BoardDetailTop';
import Spinner from 'react-bootstrap/Spinner';

function WriteShortForm() {
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [file, setFile] = useState(null);
    const editorRef = useRef();
    const videoRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token, memberEmail } = useContext(AuthContext);
    const userProfile = useSelector(selectUserProfile);
    const boards = useSelector((state) => state.board.boards);

    // 로그인 상태 확인
    useEffect(() => {
        if (!token) {
            swal({
                title: '로그인 후 이용해 주세요',
                icon: 'warning',
                button: '확인',
                className: 'custom-swal-warning'
            }).then(() => {
                navigate(-1); // 이전 페이지로 이동
            });
        }
    }, [token, navigate]);

    let decodedToken;
    if (token) {
        decodedToken = jwtDecode(token);
    }

    useEffect(() => {
        if (token && !userProfile) {
            dispatch(fetchUserProfile({ serverUrl: 'http://localhost:8080', decodedToken }));
        }
    }, [dispatch, decodedToken, userProfile, token]);

    if (!decodedToken || !userProfile) {
        return (
            <div className="permissionMessage">
                <div>로딩중...
                    <div>
                        <Spinner animation="border" variant="dark" />
                    </div>
                </div>
            </div>
        );
    }

    const onSubmitHandler = async () => {
        const content = editorRef.current.getInstance().getMarkdown();
        if (title.trim() === '') {
            return swal('제목을 입력해주세요', '', 'warning');
        }
        if (content.trim() === '') {
            return swal('내용을 입력해주세요', '', 'warning');
        }
        if (!file) {
            return swal('파일을 등록해주세요', '', 'warning');
        }

        let uploadedFileUrl = '';
        if (file) {
            console.log('업로드된 파일:', file);
            uploadedFileUrl = 'http://example.com/uploads/' + file.name;
        }

        const findMaxId = () => {
            let maxId = 0;
            boards.forEach((board) => {
                if (board.id > maxId) {
                    maxId = board.id;
                }
            });
            return maxId;
        };

        const newId = findMaxId() + 1;

        const authorId = decodedToken?.email;
        const authorName = userProfile.name;
        const nickname = userProfile.profile.nickname;

        const newBoard = {
            author_id: authorId,
            nickname,
            category: 2,
            title,
            content,
            writeday: new Date().toISOString().split('T')[0],
            views: 0,
            like: 0,
            repl_cnt: 0,
            photoes: 1,
            media: uploadedFileUrl,
            file: file
        };

        console.log('제출될 게시물 정보:', newBoard);

        swal({
            title: '게시물을 제출하시겠습니까?',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then((willSubmit) => {
            if (willSubmit) {
                dispatch(addBoard(newBoard));

                swal('게시물이 성공적으로 등록되었습니다!', {
                    icon: 'success',
                }).then(() => {
                    navigate('/board/shortform'); 
                    window.location.reload();
                });
            } else {
                swal('게시물 제출이 취소되었습니다.');
            }
        });
    };

    const onExitHandler = () => {
        navigate('/board/shortform'); 
    };

    const onChangeTitleHandler = (e) => {
        setTitle(e.target.value);
    };

    const onFileChangeHandler = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        const fileUrl = URL.createObjectURL(selectedFile);
        setVideoUrl(fileUrl);
        console.log(fileUrl);

        if (videoRef.current) {
            videoRef.current.load();
        }
    };

    return (
        <>
            <BoardDetailTop category={2} />
            <div className="shortform-inputContainer">
                <div className="shortform-topContainer">
                    <div className="textareaHeader">
                        <div className="textareaBox">
                            <input
                                className="textareaBox"
                                placeholder="타이틀을 입력해주세요"
                                value={title}
                                onChange={onChangeTitleHandler}
                            />
                        </div>
                    </div>
                </div>
                <div className="shortform-write-container">
                    <div className="shortform-write-editor">
                        <ToastEditor ref={editorRef} />
                    </div>
                    <div className="shortform-write-upload">
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>동영상 파일:</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={onFileChangeHandler}
                                accept="video/mp4,video/webm,video/*"
                            />
                        </Form.Group>
                        <div className="shortform-videoPreviewContainer">
                            {videoUrl && (
                                <video ref={videoRef} controls>
                                    <source src={videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bottomContainer">
                    <div className="buttonArea1">
                        <button className="backButton" onClick={onExitHandler}>
                            <div className="arrowText"> ↩ 나가기</div>
                        </button>
                    </div>
                    <div className="buttonArea2">
                        <button className="submitButton" onClick={onSubmitHandler}>
                            제출하기
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default WriteShortForm;
