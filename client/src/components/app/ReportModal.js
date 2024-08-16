import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../login/OAuth';
import { jwtDecode } from 'jwt-decode';

function ReportModal({ show, handleClose, reportedId }) {
    const [reason, setReason] = useState('');
    const [warningShown, setWarningShown] = useState(false); // 경고 메시지 표시 여부를 위한 상태
    const [errorMessage, setErrorMessage] = useState(''); // 신고 이유 입력 여부를 위한 상태
    const { token } = useContext(AuthContext);
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setLoggedInUserId(decodedToken.email);
            } catch (error) {
                console.error('토큰 디코딩 에러:', error);
            }
        }
    }, [token]);
    

    const handleSubmit = async () => {
        if (!warningShown) {
            setWarningShown(true); // 첫 번째 클릭 시 경고 메시지 표시
            return;
        }

        if (!reason) {
            setErrorMessage('신고 이유를 입력해 주세요.'); // 내용이 없을 경우 오류 메시지 설정
            return;
        }

        // 신고 정보를 서버로 전송하여 DB에 저장합니다.
        try {
            const reportData = {
                reporter_id: loggedInUserId,
                reported_id: reportedId,
                content: reason
            };

            // 콘솔에 신고 데이터 출력
            //console.log('신고 데이터:', reportData);
            const response = await axios.post('http://localhost:8080/report/insert', reportData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            //console.log('서버 응답:', response);
            // 신고가 완료된 후 모달을 닫습니다.
            handleClose();
        } catch (error) {
            //console.error('신고 정보를 저장하는 중 오류 발생:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>신고하기</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formReason">
                        <Form.Label>신고 이유</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="신고 이유를 입력하세요"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </Form.Group>
                    {warningShown && !reason && (
                        <span style={{ color: 'red', marginTop: '10px', display: 'block' }}>
                            {errorMessage || '허위신고 시 계정이 정지됩니다.'}
                        </span>
                    )}
                    {warningShown && reason && (
                        <span style={{ color: 'red', marginTop: '10px', display: 'block' }}>
                            허위신고 시 계정이 정지될 수 있습니다.
                        </span>
                    )}
                    <div className="d-flex justify-content-end mt-3">
                        <Button variant="dark" onClick={handleSubmit}>
                            제출하기
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default ReportModal;
