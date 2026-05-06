import fs from 'fs';
import { dogTraining, catTraining } from '../src/trainingData.js';

import ytSearch from 'yt-search';

async function searchYouTube(query) {
    try {
        const r = await ytSearch(query);
        const videos = r.videos;
        if (videos.length > 0) {
            return videos[0].videoId;
        }
        return null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function fix() {
    let content = fs.readFileSync('./src/trainingData.js', 'utf-8');
    const all = [...dogTraining, ...catTraining].flatMap(m => m.videos);
    
    for (let v of all) {
        const res = await fetch('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=' + v.id);
        if (!res.ok) {
            console.log(`Replacing broken video: ${v.title}`);
            const isCat = catTraining.some(m => m.videos.some(vid => vid.id === v.id));
            const baseTitle = v.title.replace(/Video \d+: /, '');
            const animal = isCat ? 'cat' : 'dog';
            const searchQuery = `${baseTitle} ${animal} training 2024 mccann`; // add mccann for dogs or just training 2024
            
            const newId = await searchYouTube(searchQuery);
            if (newId) {
                console.log(`Found new ID for ${v.title}: ${newId}`);
                content = content.replace(new RegExp(`id: '${v.id}'`, 'g'), `id: '${newId}'`);
            }
        }
    }
    
    fs.writeFileSync('./src/trainingData.js', content);
    console.log('Done!');
}
fix();
