import validator from 'validator';
import Url from '../models/Url.js';
import Click from '../models/Click.js';
import { makeCode } from '../utils/short.js';
import { getClientIp, getLocationFromIp } from '../utils/ip.js';
import { parseUserAgent } from '../utils/userAgent.js';

export async function createUrl(req, res) {
  const { originalUrl, customCode } = req.body;
  if (!originalUrl || !validator.isURL(originalUrl, { require_protocol: true })) {
    return res.status(400).json({ message: 'Provide a valid URL including http(s)://' });
  }

  let shortCode = customCode || makeCode();
  if (customCode && !/^[\w-]{4,32}$/.test(customCode)) {
    return res.status(400).json({ message: 'Invalid custom code format' });
  }

  for (let i = 0; i < 5; i++) {
    const exists = await Url.findOne({ shortCode });
    if (!exists) break;
    shortCode = makeCode();
  }
  const url = await Url.create({ shortCode, originalUrl, owner: req.user.id });
  const shortUrl = `${process.env.BASE_URL.replace(/\/$/, '')}/${shortCode}`;
  res.status(201).json({ id: url._id, shortCode, shortUrl, originalUrl });
}

export async function listMyUrls(req, res) {
  const urls = await Url.find({ owner: req.user.id }).sort({ createdAt: -1 });
  res.json(urls);
}

export async function getUrlAnalytics(req, res) {
  const { id } = req.params;
  const url = await Url.findOne({ _id: id, owner: req.user.id });
  if (!url) return res.status(404).json({ message: 'URL not found' });

  const [summary] = await Click.aggregate([
    { $match: { url: url._id } },
    { $facet: {
        total: [{ $count: 'count' }],
        byCountry: [
          { $group: { _id: '$country', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ],
        byReferrer: [
          { $group: { _id: '$referer', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ],
        byDevice: [
          { $group: { _id: '$device', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        byBrowser: [
          { $group: { _id: '$browser', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        byOs: [
          { $group: { _id: '$os', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        uniqueVisitors: [
          { $group: { _id: '$ip' } },
          { $count: 'count' }
        ],
        last7Days: [
          { $match: { at: { $gte: new Date(Date.now() - 7*24*60*60*1000) } } },
          { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$at' } }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ],
        last24Hours: [
          { $match: { at: { $gte: new Date(Date.now() - 24*60*60*1000) } } },
          { $group: { _id: { $dateToString: { format: '%H:00', date: '$at' } }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ],
        recentClicks: [
          { $sort: { at: -1 } },
          { $limit: 50 },
          { $project: { ip: 1, country: 1, device: 1, browser: 1, os: 1, referer: 1, at: 1 } }
        ]
      }
    }
  ]);

  res.json({
    url: { id: url._id, shortCode: url.shortCode, originalUrl: url.originalUrl, clicksCount: url.clicksCount },
    total: summary?.total?.[0]?.count || 0,
    uniqueVisitors: summary?.uniqueVisitors?.[0]?.count || 0,
    byCountry: summary?.byCountry || [],
    byReferrer: summary?.byReferrer || [],
    byDevice: summary?.byDevice || [],
    byBrowser: summary?.byBrowser || [],
    byOs: summary?.byOs || [],
    last7Days: summary?.last7Days || [],
    last24Hours: summary?.last24Hours || [],
    recentClicks: summary?.recentClicks || []
  });
}

export async function redirectByCode(req, res) {
  const { code } = req.params;
  const url = await Url.findOne({ shortCode: code });
  if (!url) return res.status(404).send('Short URL not found');

  const ip = getClientIp(req);
  const location = getLocationFromIp(ip);
  const userAgent = req.headers['user-agent'] || '';
  const { device, browser, os } = parseUserAgent(userAgent);
  const referer = req.headers['referer'] || req.headers['referrer'] || '';
  
  await Click.create({ 
    url: url._id, 
    ip, 
    country: location.country,
    city: location.city,
    userAgent, 
    device,
    browser,
    os,
    referer, 
    at: new Date() 
  });
  await Url.updateOne({ _id: url._id }, { $inc: { clicksCount: 1 } });

  res.redirect(302, url.originalUrl);
}

export async function getUrlInfo(req, res) {
  const { code } = req.params;
  const url = await Url.findOne({ shortCode: code });
  if (!url) return res.status(404).json({ message: 'Short URL not found' });
  
  res.json({ originalUrl: url.originalUrl, shortCode: url.shortCode });
}
