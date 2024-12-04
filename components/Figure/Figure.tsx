import { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { RenderWhenPrimitive } from '../utils/RenderWhenPrimitive';
import { figureCaptionContainerCss, figureCaptionCss, figureCss } from './styles';

export interface FigureProps extends HTMLAttributes<HTMLElement> {
  img: ReactNode;
  caption: ReactNode;
  width?: CSSProperties['width'];
}

export const Figure = (props: FigureProps) => {
  const { img, caption, width = '100%', ...restProps } = props;

  return (
    <figure css={figureCss} {...restProps}>
      <RenderWhenPrimitive value={img}>
        <img src={img as string} alt="" width={width} />
      </RenderWhenPrimitive>
      <RenderWhenPrimitive value={caption}>
        <figcaption css={figureCaptionContainerCss}>
          <span css={figureCaptionCss}>{caption}</span>
        </figcaption>
      </RenderWhenPrimitive>
    </figure>
  );
};
