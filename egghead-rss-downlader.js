const fs = require('fs');
const https = require('https');
const path = require('path');
const Parser = require('rss-parser');
const parser = new Parser();

(async () => {
	try {

		let feed;
		let contentList;
		const courseInformationFile = '000 - course-information.txt';

		if (!process.argv[ 2 ]) {
			throw new Error('Please provide a RSS URL as first argument!');
		}

		// fetch feed
		feed = await parser.parseURL(process.argv[ 2 ]);
		feed.sanitizedTitle = sanitizeFileName(feed.title);

		// create course folder
		if (!fs.existsSync(feed.sanitizedTitle)) {
			fs.mkdirSync(feed.sanitizedTitle);
		}

		console.log('Download started...');

		if (fs.existsSync(path.join(feed.sanitizedTitle, courseInformationFile))) {
			fs.unlinkSync(path.join(feed.sanitizedTitle, courseInformationFile));
		}

		contentList = fs.createWriteStream(path.join(feed.sanitizedTitle, courseInformationFile), {
			flags: 'a',
		});
		contentList.write(`Course title: \t\t${feed.title}
Description: \t\t${feed.description.replace(/\r\n\r\n/g, '\n')}
Link: \t\t\t${feed.link}
Published: \t\t${feed.pubDate}
Author: \t\t${feed.itunes.author} (${feed.itunes.owner.email})
_________________________________________________
\n\n`);

		feed.items.forEach((item, index) => {
			contentList.write(`Lesson ${index + 1}: \t\t${item.title}
Published: \t\t${item.pubDate}
Descripton: \t${item.content.replace(/\n\n/g, '\n')}
\n\n`);
			console.log(`Lesson ${index + 1} started...`);
			const file = fs.createWriteStream(path.join(feed.sanitizedTitle, `${('000' + (index + 1)).slice(-3)} - ${sanitizeFileName(item.title)}.mp4`));
			https.get(item.enclosure.url, response => {
				response.pipe(file);
			})
		});

		contentList.end();

	} catch (error) {
		console.log(error);
	}

})();

function sanitizeFileName(val) {
	return val.replace(/[\\/:"*?<>|]+/, '_');
}
