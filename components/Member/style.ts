import { css, keyframes } from '@emotion/react';

const fillAnimation = keyframes`
  from {
    background-size: 0 100%;
  }
  to {
    background-size: 100% 100%;
  }
`;

const unfillAnimation = keyframes`
  from {
    background-size: 100% 100%;
  }
  to {
    background-size: 0 100%;
  }
`;

export const memberContainerCss = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',

  '& > p': {
    display: 'inline-block',
    background: 'linear-gradient(0deg, rgba(122, 138, 220, 0.3) 50%, transparent 50%) left / 0 no-repeat',
    transition: 'background-size 0.5s ease',
  },

  '&:hover': {
    '& > p': {
      animation: `${fillAnimation} 0.5s forwards`,
    },
  },
  '&:not(:hover)': {
    '& > p': {
      animation: `${unfillAnimation} 0.5s forwards`,
    },
  },
});

export const profileImageCss = css({
  width: '150px',
  height: '150px',
  borderRadius: '8px',
});
