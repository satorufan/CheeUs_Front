import React from 'react';
import WriteBoard from '../board/WriteBoard';

const WriteEventBoard = () => {
  return (
    <WriteBoard
      category={3}
      categoryId={3}
      navigateTo='/board/eventboard'
    />
  );
};

export default WriteEventBoard;
