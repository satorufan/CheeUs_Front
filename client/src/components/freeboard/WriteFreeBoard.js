import React from 'react';
import WriteBoard from '../board/WriteBoard';

const WriteFreeBoard = () => {
  return (
    <WriteBoard
      category={1}
      categoryId={1}
      navigateTo='/board/freeboard'
    />
  );
};

export default WriteFreeBoard;
