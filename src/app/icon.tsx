import { ImageResponse } from 'next/og';
import { promises as fs } from 'fs';
import path from 'path';

export const size = { width: 256, height: 256 };
export const contentType = 'image/png';

export default async function Icon() {
  // Read the original JPG image
  const imagePath = path.join(process.cwd(), 'public/img/farhan.JPG');
  const imageData = await fs.readFile(imagePath);
  const base64Image = imageData.toString('base64');
  const imgSrc = `data:image/jpeg;base64,${base64Image}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          overflow: 'hidden',
          background: 'transparent',
        }}
      >
        <img 
          src={imgSrc} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            borderRadius: '50%'
          }} 
        />
      </div>
    ),
    { ...size }
  );
}
