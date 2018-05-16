export interface Enclosure {
	url: string;
	length: string;
	type: string;
}

export interface Itunes {
	author: string;
	subtitle: string;
	summary: string;
	explicit: string;
	duration: string;
}

export interface Item {
	title: string;
	link: string;
	pubDate: string;
	enclosure: Enclosure;
	content: string;
	contentSnippet: string;
	guid: string;
	isoDate: string;
	itunes: Itunes;
}

export interface Owner {
	name: string;
	email: string;
}

export interface Itunes {
	image: string;
	owner: Owner;
	author: string;
	explicit: string;
}

export interface EggheadFeed {
	items: Item[];
	title: string;
	description: string;
	pubDate: string;
	link: string;
	itunes: Itunes;
}