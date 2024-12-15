import Image from 'next/image'
import { useState } from 'react'

const MDXImage = ({ src, alt, ...props }) => {
  const [error, setError] = useState(false)
  
  // 기본 이미지 경로 설정
  const defaultImageSrc = '/default-image.png'
  
  return (
    <Image
      src={error ? defaultImageSrc : src}
      alt={alt || 'Image'}
      onError={() => setError(true)}
      {...props}
    />
  )
}

export default MDXImage
