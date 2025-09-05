import geoip from 'geoip-lite';

export function getClientIp(req) {
  let ip = req.ip || req.connection?.remoteAddress || '';
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) {
    ip = fwd.split(',')[0].trim();
  }
  ip = ip.replace('::ffff:', '') || '';
  
  // For local development, use a public IP for testing
  if (ip === '127.0.0.1' || ip === 'localhost' || ip === '::1' || !ip) {
    // Use a Bangladesh IP for testing (Grameenphone public IP)
    ip = '203.112.218.1';
  }
  
  return ip;
}

export function getLocationFromIp(ip) {
  try {
    const geo = ip ? geoip.lookup(ip) : null;
    return {
      country: geo?.country || 'Unknown',
      city: geo?.city || 'Unknown',
      region: geo?.region || 'Unknown',
      timezone: geo?.timezone || 'Unknown'
    };
  } catch {
    return {
      country: 'Unknown',
      city: 'Unknown', 
      region: 'Unknown',
      timezone: 'Unknown'
    };
  }
}

export function getCountryFromIp(ip) {
  const location = getLocationFromIp(ip);
  return location.country;
}
