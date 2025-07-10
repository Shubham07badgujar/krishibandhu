import { useEffect, useState } from 'react';

const OriginDebugger = () => {
  const [origin, setOrigin] = useState('');
  const [fullUrl, setFullUrl] = useState('');
  const [envInfo, setEnvInfo] = useState({});
  
  useEffect(() => {
    setOrigin(window.location.origin);
    setFullUrl(window.location.href);
    console.log('Current application origin:', window.location.origin);
    console.log('Current full URL:', window.location.href);
    
    const env = {
      VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
      MODE: import.meta.env.MODE,
      DEV: import.meta.env.DEV,
      PROD: import.meta.env.PROD
    };
    
    setEnvInfo(env);
    console.log('App environment variables:', env);
  }, []);
  
  return (
    <div className="fixed bottom-4 left-4 bg-yellow-100 p-3 rounded-lg shadow text-sm z-50 max-w-xs overflow-hidden">
      <div className="font-bold mb-1">Debug Info:</div>
      <div><strong>Origin:</strong> {origin}</div>
      <div><strong>URL:</strong> {fullUrl.substring(0, 30)}...</div>
      <div><strong>Mode:</strong> {envInfo.MODE}</div>
      <div><strong>API:</strong> {envInfo.VITE_BACKEND_URL?.substring(0, 25)}...</div>
    </div>
  );
};

export default OriginDebugger;
