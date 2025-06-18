const Parser = require('rss-parser');
const parser = new Parser();

const SOURCES = [
  {
    name: 'NDMA India',
    url: 'https://sachet.ndma.gov.in/cap_public_website/rss/rss_india.xml',
    icon: '🇮🇳'
  },
  {
    name: 'FEMA',
    url: 'https://www.fema.gov/rss/updates.xml',
    icon: '🛡️'
  },
  {
    name: 'Red Cross',
    url: 'https://www.redcross.org/content/redcross/en/about-us/news-and-events/news.rss.xml',
    icon: '🚑'
  }
];

async function fetchOfficialUpdates() {
  const allUpdates = [];
  for (const source of SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      const updates = feed.items.slice(0, 5).map(item => ({
        title: item.title,
        link: item.link,
        date: item.pubDate,
        summary: item.contentSnippet || item.content || '',
        source: source.name,
        icon: source.icon
      }));
      allUpdates.push(...updates);
    } catch (err) {
      console.error(`Error fetching ${source.name}:`, err.message);
    }
  }
  // Sort by date descending
  allUpdates.sort((a, b) => new Date(b.date) - new Date(a.date));
  return allUpdates;
}

// Example usage
fetchOfficialUpdates().then(updates => {
  updates.forEach(update => {
    console.log(`${update.icon} [${update.source}] ${update.title}`);
    console.log(`   ➤ ${update.link}`);
    console.log(`   📄 ${update.summary.substring(0, 100)}...\n`);
  });
});

module.exports = { fetchOfficialUpdates };
