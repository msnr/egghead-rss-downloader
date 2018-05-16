const fs = require('fs');
const https = require('https');
const path = require('path');
const Parser = require('rss-parser');
const parser = new Parser();

class EggheadRssDownloader {

	constructor(url) {
		this.url = url;
		this.feed = null;
		this.contentList = null;
		this.courseInformationFile = '000 - course-information.txt';
	}

	async startDownload() {
		try {
			this.feed = await parser.parseURL(this.url);

			this.feed.title = EggheadRssDownloader.sanitizeFileName(this.feed.title);
			if (!fs.existsSync(this.feed.title))
				fs.mkdirSync(this.feed.title);

			this.writeCourseDetailsToStream();

			this.feed.items.forEach((item, index) => {
				this.writeLessonDetailsToStream(item, index);
				this.downloadFile(item, index);
			});

			this.contentList.end();
		} catch (error) {
			console.log(error);
		}
	}

	static sanitizeFileName(val) {
		return val.replace(/[\\/:"*?<>|]+/, '_');
	}

	writeCourseDetailsToStream() {
		if (fs.existsSync(path.join(this.feed.title, this.courseInformationFile)))
			fs.unlinkSync(path.join(this.feed.title, this.courseInformationFile));

		this.contentList = fs.createWriteStream(
			path.join(this.feed.title, this.courseInformationFile), {
				flags: 'a',
			})
		this.contentList.write(`Course title: \t\t${this.feed.title}
Description: \t\t${this.feed.description.replace(/\r\n\r\n/g, '\n')}
Link: \t\t\t${this.feed.link}
Published: \t\t${this.feed.pubDate}
Author: \t\t${this.feed.itunes.author} (${this.feed.itunes.owner.email})
_________________________________________________
\n\n`);
	}

	writeLessonDetailsToStream(item, index) {
		this.contentList.write(`Lesson ${index + 1}: \t\t${item.title}
Published: \t\t${item.pubDate}
Descripton: \t${item.content.replace(/\n\n/g, '\n')}
\n\n`);
	}

	downloadFile(item, index) {
		let file = fs.createWriteStream(
			path.join(this.feed.title, `${('000' + (index + 1)).slice(-3)} - ${EggheadRssDownloader.sanitizeFileName(item.title)}.mp4`)
		);
		https.get(item.enclosure.url, response => {
			response.pipe(file);
		})
	}

}

if (!process.argv[ 2 ]) {
	throw new Error('Please provide a RSS URL as first argument!');
}

(() => {
	new EggheadRssDownloader(process.argv[ 2 ]).startDownload();
})();