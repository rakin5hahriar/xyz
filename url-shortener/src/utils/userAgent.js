// Simple user agent parser for device detection
export function parseUserAgent(userAgent) {
  if (!userAgent) {
    return {
      device: 'Unknown',
      browser: 'Unknown',
      os: 'Unknown'
    };
  }

  const ua = userAgent.toLowerCase();

  // Device detection
  let device = 'Desktop';
  if (/mobile|android|iphone|ipod|blackberry|windows phone/.test(ua)) {
    device = 'Mobile';
  } else if (/tablet|ipad/.test(ua)) {
    device = 'Tablet';
  }

  // Browser detection
  let browser = 'Unknown';
  if (/edg\//.test(ua)) {
    browser = 'Edge';
  } else if (/chrome\//.test(ua) && !/edg\//.test(ua)) {
    browser = 'Chrome';
  } else if (/firefox\//.test(ua)) {
    browser = 'Firefox';
  } else if (/safari\//.test(ua) && !/chrome\//.test(ua)) {
    browser = 'Safari';
  } else if (/opera\/|opr\//.test(ua)) {
    browser = 'Opera';
  } else if (/trident\/|msie/.test(ua)) {
    browser = 'Internet Explorer';
  }

  // OS detection
  let os = 'Unknown';
  if (/windows nt 10/.test(ua)) {
    os = 'Windows 10/11';
  } else if (/windows nt 6\.3/.test(ua)) {
    os = 'Windows 8.1';
  } else if (/windows nt 6\.2/.test(ua)) {
    os = 'Windows 8';
  } else if (/windows nt 6\.1/.test(ua)) {
    os = 'Windows 7';
  } else if (/windows/.test(ua)) {
    os = 'Windows';
  } else if (/mac os x/.test(ua)) {
    os = 'macOS';
  } else if (/android/.test(ua)) {
    os = 'Android';
  } else if (/iphone os|ios/.test(ua)) {
    os = 'iOS';
  } else if (/linux/.test(ua)) {
    os = 'Linux';
  } else if (/ubuntu/.test(ua)) {
    os = 'Ubuntu';
  }

  return { device, browser, os };
}
