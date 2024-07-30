import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, selectUserProfile, updateUserProfileThunk } from '../../store/ProfileSlice';
import './editProfile.css';
import Avatar from '@mui/joy/Avatar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../login/OAuth';
import Swal from 'sweetalert2';

const availableTags = [
    '소주', '맥주', '양주', '막걸리', '칵테일', '하이볼', '차분하게', '신나게', '시끄럽게', '가성비 술집', '예쁜 술집'
];

const EditProfile = ({ onClose = () => {} }) => {
    const sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        });
    };

    const {serverUrl} = useContext(AuthContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const profile = useSelector(selectUserProfile);

    const [nickname, setNickname] = useState('');
    const [intro, setIntro] = useState('');
    const [tags, setTags] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [photo, setPhoto] = useState('');
    const [openTagModal, setOpenTagModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [locationConsent, setLocationConsent] = useState(0);
    const [matchingConsent, setMatchingConsent] = useState(0);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    
    useEffect(() => {
        if (profile) {
            setNickname(profile.profile.nickname);
            setIntro(profile.profile.intro);
            setTags(typeof profile.profile.tags === 'string' 
                ? profile.profile.tags.split('/').map(tag => tag.trim()) 
                : []);
            setPhotos(profile.imageBlob || []);
            profile.imageBlob.map((image) => {
                setImageFiles([...imageFiles, image]);
            });
            setPhoto(profile.profile.photo);
            setPhoneNumber(profile.profile.tel || '');
            setLocationConsent(profile.profile.locationOk);
            setMatchingConsent(profile.profile.matchOk);
        }
    }, [profile]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setOpenConfirmModal(true); 
    };

    const handleConfirmSubmit = () => {
        if (photos.length == 0) {
            sweetalert("프로필 사진 한 장 이상 추가하여야 합니다", '','','확인');
          } else {

            var tagsString = "";
            if (tags) tags.map((tag, index)=>{
            tagsString += index == tags.length-1 ? tag : tag + "/";
            });

            const updateUserProfileInfo = {
                birth : profile.profile.birth,
                email : profile.profile.email,
                gender : profile.profile.gender,
                intro : intro,
                latitude : null,
                longitude : null,
                location : null,
                locationOk : locationConsent,
                matchOk : matchingConsent,
                name : profile.profile.name,
                nickname : profile.profile.nickname,
                photo : photos.length,
                tags : tags.length > 0 ? tagsString : null,
                tel : profile.profile.tel
            }
            const updateUserProfilePhotos = photos;

            const updateUserProfile = {
                profile : updateUserProfileInfo,
                imageBlob : updateUserProfilePhotos
            }

            dispatch(updateUserProfileThunk({serverUrl, updateUserProfile}));
            onClose();
            console.log("저장된 프로필:", updateUserProfile);
            navigate('/mypage');
            setOpenConfirmModal(false);
        }
    };

    const handleAvatarUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result);
                setPhotos(prevPhotos => [reader.result, ...prevPhotos.filter(p => p !== reader.result)]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadPhoto = (index) => (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedPhotos = [...photos];
                updatedPhotos[index] = reader.result;
                setPhotos(updatedPhotos);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = (index) => {
        const updatedPhotos = photos.filter((_, i) => i !== index);
        setPhotos(updatedPhotos);
    };

    const handleAddPhoto = (index) => {
        const fileInput = document.getElementById(`photo-input-${index}`);
        fileInput.click();
    };

    const handleOpenTagModal = () => {
        setOpenTagModal(true);
    };

    const handleCloseTagModal = () => {
        setOpenTagModal(false);
    };

    const handleTagToggle = (tag) => {
        setTags((prevTags) => 
            prevTags.includes(tag)
                ? prevTags.filter((t) => t !== tag)
                : [...prevTags, tag]
        );
    };

    if (!profile) {
        return <p>로딩 중...</p>;
    }

    return (
        <form className="edit-profile-container" onSubmit={handleSubmit}>
            <h2>프로필 수정</h2>
            <div className="edit-profile-content2">
                <div className="edit-profile-info-box">
                    <div className="edit-form-group img">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            style={{ display: 'none' }}
                            id="file-input"
                        />
                        <label htmlFor="file-input">
                            <Avatar
                                src={photos[0]}
                                size="medium"
                                sx={{ width: 40, height: 40 }}
                                className="edit-profile-img"
                            />
                        </label>
                        <div className="edit-profile-nickname">{nickname}</div>
                    </div>
                    <div className="edit-form-group">
                        <h6>자기소개</h6>
                        <textarea
                            className="edit-form-control"
                            value={intro}
                            onChange={(e) => setIntro(e.target.value)}
                            required
                        />
                    </div>
                    <div className="edit-form-group">
                        <button type='button' onClick={handleOpenTagModal} variant="outlined" className='edit-tags-btn'>
                            음주 선호 태그
                        </button>
                        <div className="edit-tag-container">
                            {tags.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onDelete={() => handleTagToggle(tag)}
                                    variant="outlined"
                                    className="edit-tag-chip"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="edit-form-group">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={!!locationConsent}
                                    onChange={(e) => setLocationConsent(e.target.checked ? 1 : 0)}
                                    color="primary"
                                />
                            }
                            label="위치 정보 동의"
                        />
                    </div>
                    <div className="edit-form-group">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={!!matchingConsent}
                                    onChange={(e) => setMatchingConsent(e.target.checked ? 1 : 0)}
                                    color="primary"
                                />
                            }
                            label="1:1 매칭 사용 동의"
                        />
                    </div>
                </div>
                <div className="edit-photo-box">
                    <h6>둘이 마셔요 프로필 사진</h6>
                    <div className="edit-photo-grid">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="edit-photo-container">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUploadPhoto(index)}
                                    style={{ display: 'none' }}
                                    id={`photo-input-${index}`}
                                />
                                <div className="edit-photos">
                                    {photos[index] ? (
                                        <>
                                            <img src={photos[index]} alt={`Photo ${index + 1}`} className="edit-photo-thumbnail" />
                                            <button
                                            type="button"
                                            className="add-remove-photo"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemovePhoto(index);
                                            }}
                                            >
                                            <RemoveCircleOutlineIcon />
                                            </button>
                                        </>
                                        ) : (
                                        <>
                                            {index === 0 || photos[index - 1] ? (
                                            <div className="add-photo-placeholder" onClick={() => handleAddPhoto(index)}>
                                                <AddCircleOutlineIcon />
                                            </div>
                                            ) : null}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="edit-button-container">
                <button type="submit" className="edit-submit-button">저장</button>
            </div>

            {/* 태그 모달 */}
            <Dialog open={openTagModal} onClose={handleCloseTagModal}>
                <DialogTitle>음주 선호 태그</DialogTitle>
                <DialogContent>
                    <div className="edit-tag-selection">
                        {availableTags.map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                onClick={() => handleTagToggle(tag)}
                                variant={tags.includes(tag) ? "filled" : "outlined"}
                                className="edit-tag-chip"
                            />
                        ))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTagModal} color="primary">
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Modal */}
            <Dialog open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
                <DialogTitle>확인</DialogTitle>
                <DialogContent>
                    <p>프로필을 저장하시겠습니까?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmModal(false)} color="primary">
                        취소
                    </Button>
                    <Button onClick={handleConfirmSubmit} color="primary">
                        저장
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );
};

export default EditProfile;
