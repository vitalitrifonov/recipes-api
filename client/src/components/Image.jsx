import { Image } from '@imagekit/react';

// Kohandatud pildikomponent, mis lisab parameetreid ja mugavusi
const IKImage = ({ src, className, w, h, alt }) => {
  return (
    <Image
      // ImageKit'i URL lõpp, defineeritud .env failis (turvaline ja mugav)
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      // Pildi lähtefaili nimi või tee (nt 'example.jpg')
      src={src}
      // Pildi klassid, et lisada stiile
      className={className}
      // HTML attribuut – laeb pildi edasi lükatult
      loading="lazy"
      // LQIP (Low-Quality Image Placeholder) – näitab enne madalakvaliteedilist
      lqip={{ active: true, quality: 20 }}
      // Pildi alternatiivtekst SEO ja ligipääsetavuse jaoks
      alt={alt}
      // Soovituslikud mõõtmed
      width={w}
      height={h}
      // ImageKit'i enda transformatsioonid (optimeeritud laadimine)
      transformation={[
        {
          width: w,
          height: h,
        },
      ]}
    />
  );
};

export default IKImage;