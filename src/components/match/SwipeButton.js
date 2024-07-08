import React from "react";
import "./swipeButton.css";
import ReplayIcon from '@mui/icons-material/Replay';
import CloseIcon from '@mui/icons-material/Close';
import StarRateIcon from '@mui/icons-material/StarRate';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';


function SwipeButton(){
  return (
    <div className="swipeButton">
      <IconButton>
        <ReplayIcon fontSize='large' className="replay_button"/>
      </IconButton>
      <IconButton>
        <CloseIcon fontSize='large' className="close_button"/>
      </IconButton>
      <IconButton>
        <StarRateIcon fontSize='large' className="star_button"/>
      </IconButton>
      <IconButton>
        <FavoriteIcon fontSize='large' className="favourite_button"/>
      </IconButton>
    </div>
  )
}

export default SwipeButton;