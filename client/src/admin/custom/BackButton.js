import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-admin'; 
import { makeStyles } from '@mui/styles';
import UndoIcon from '@mui/icons-material/Undo';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    marginTop: '-16px', 
    marginLeft: '16px', 
    width: '94px',
    height: '32px',
    color: "#999",
    backgroundColor: 'lightgray',
    border: 'none',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    height: '36px',
    minWidth: '64px',
    padding: '6px 16px',
  },
}));

const BackButton = () => {
  const navigate = useNavigate();
  const classes = useStyles();

  return (
    <Button
      variant="outlined"
      onClick={() => navigate(-1)}
      label="BACK"
      startIcon={<UndoIcon/>}
      className={classes.button}
    />
  );
};

export default BackButton;
