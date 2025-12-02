// const fs = require('fs');
import fs from 'fs';
const countries = ['United States','India','United Kingdom','Canada','Germany','France','Brazil','Australia'];
const os = ['Android','iOS','Web'];
const sizes = ['Leaderboard (728x90)', '300x250', '320x50', 'Interstitial', 'Native'];
const metric = (min,max) => Math.floor(Math.random()*(max-min+1))+min;

const rows = [];
for (let i=0;i<1000;i++){
  rows.push({
    id: i+1,
    appBundle: Math.random() > 0.15 ? `com.example.app${Math.floor(Math.random()*10000)}` : "-N/A-",
    siteId: Math.floor(Math.random()*900000)+100000,
    deviceOS: os[Math.floor(Math.random()*os.length)],
    visitorCountry: countries[Math.floor(Math.random()*countries.length)],
    size: sizes[Math.floor(Math.random()*sizes.length)],
    dspTimeouts: metric(0, 200000),
    noBid: metric(0, 10000000),
    respInvalidated: metric(0, 2000),
    respRejected: metric(0, 1000),
    respBlocked: metric(0, 100000),
    respAuctionCandidate: metric(0, 500000),
    impressions: metric(0, 1000000),
    spend: Number((Math.random()*50000).toFixed(2))
  });
}

fs.writeFileSync('src/data/sampleData.json', JSON.stringify(rows, null, 2));
console.log('sampleData.json written (1000 rows)');
