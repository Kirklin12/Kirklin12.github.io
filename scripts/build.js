const fs = require("fs");

// Load your M3U
const m3u = fs.readFileSync("data/master.m3u", "utf8");

// Load IPTV-org database (channels)
const db = JSON.parse(fs.readFileSync("database/data/channels.json", "utf8"));

// Simple normalization
function normalize(name) {
  return name
    .toLowerCase()
    .replace(/\[.*?\]/g, "")
    .replace(/hd|sd|fhd|uhd/g, "")
    .replace(/[^a-z0-9]/g, "");
}

// Build lookup map
const channelMap = {};
db.forEach(ch => {
  channelMap[normalize(ch.name)] = ch.id;
});

// Parse M3U
const lines = m3u.split("\n");
let output = "#EXTM3U\n";

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  if (line.startsWith("#EXTINF")) {
    let name = line.split(",")[1] || "";
    let nextUrl = lines[i + 1] || "";

    let id = channelMap[normalize(name)] || "";

    output += `#EXTINF:-1 tvg-id="${id}" tvg-name="${name}",${name}\n`;
    output += nextUrl + "\n";
  }
}

fs.writeFileSync("master-clean.m3u", output);
