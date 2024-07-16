import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, selectUserProfile } from '../../store/profileSlice';
import './editProfile.css';
import Avatar from '@mui/joy/Avatar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const EditProfile = ({ onClose = () => {} }) => {
    const dispatch = useDispatch();
    const profile = useSelector(selectUserProfile);

    const [nickname, setNickname] = useState('');
    const [intro, setIntro] = useState('');
    const [tags, setTags] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [profilePhoto, setProfilePhoto] = useState('');

    useEffect(() => {
        if (profile) {
            setNickname(profile.nickname);
            setIntro(profile.intro);
            setTags(profile.tags ? profile.tags.split(',').map(tag => tag.trim()) : []);
            setPhotos(profile.photos || []);
            setProfilePhoto(profile.photos && profile.photos.length > 0 ? profile.photos[0] : '');
        }
    }, [profile]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedProfile = {
            ...profile,
            nickname,
            intro,
            tags: tags.join(','),
            photos,
        };
        dispatch(updateUserProfile(updatedProfile));
        onClose();
        console.log("저장된 프로필:", updatedProfile);
    };

    const handleAvatarUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhoto(reader.result);
                setPhotos(prevPhotos => [reader.result, ...prevPhotos.filter(photo => photo !== reader.result)]);
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

    if (!profile) {
        return <p>로딩 중...</p>;
    }

    return (
        <form className="edit-profile-container" onSubmit={handleSubmit}>
    <div className="profile-container">
        <div className="profile-info-box">
            <h2>프로필 수정</h2>
            <div className="form-group img">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                    id="file-input"
                />
                <label htmlFor="file-input">
                    <Avatar
                        src={profilePhoto}
                        size="medium"
                        sx={{ width: 40, height: 40 }}
                        className="edit-profile-img"
                    />
                </label>
                <div className="edit-profile-nickname">{nickname}</div>
            </div>
            <div className="form-group">
                <label>자기소개</label>
                <textarea
                    className="form-control"
                    value={intro}
                    onChange={(e) => setIntro(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>태그 (쉼표로 구분)</label>
                <input
                    type="text"
                    className="form-control"
                    value={tags.join(', ')}
                    onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
                />
            </div>
        </div>
        <div className="edit-photo-box">
            <h2>사진</h2>
            <div className="edit-photo-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="photo-container">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadPhoto(index)}
                            style={{ display: 'none' }}
                            id={`photo-input-${index}`}
                        />
                        <div className="photo-box" onClick={() => handleAddPhoto(index)}>
                            {photos[index] ? (
                                <>
                                    <img src={photos[index]} alt={`Photo ${index + 1}`} className="photo-thumbnail" />
                                    <button
                                        className="remove-photo"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemovePhoto(index);
                                        }}
                                    >
                                        <RemoveCircleOutlineIcon />
                                    </button>
                                </>
                            ) : (
                                <div className="edit-photo-placeholder">
                                    <AddCircleOutlineIcon />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
    <div className="edit-button-container">
        <button type="submit" className="edit-button">저장</button>
    </div>
</form>
    );
};

export default EditProfile;
