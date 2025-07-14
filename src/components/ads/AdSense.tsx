import React, { useEffect } from 'react';

const AdSense = () => {
  useEffect(() => {
    const pushAd = () => {
      try {
        const adsbygoogle = (window as any).adsbygoogle;
        adsbygoogle.push({});
      } catch (e) {
        console.error(e);
      }
    };

    let interval = setInterval(() => {
      if ((window as any).adsbygoogle) {
        pushAd();
        clearInterval(interval);
      }
    }, 300);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <ins
      className='adsbygoogle'
      style={{ display: 'block' }}
      data-ad-client='ca-pub-5327530419834984' // Replace with your ad client ID
      data-ad-slot='XXXXXXXXXX' // Replace with your ad slot ID
      data-ad-format='auto'
      data-full-width-responsive='true'
    ></ins>
  );
};

export default AdSense;