export interface Author {
	name: string;
	affiliations: string;
	email: string;
	interests: [Interests];
	articles: [Article];
	thumbnail: string;
}

export interface Article {
	title: string;
	link: string;
	citation_id: string;
	authors: string;
	publication: string;
	year: string;

	cited_by: CitedBy;
}

export interface CitedBy {
	value: number;
	link: string;
	serpapi_link: string;
}

export interface ScholarOrganic {
	title: string;
	summary: string;
	link: string;
	authors?: [Authors];
}

export interface Authors {
	name: string;
	link: string;
	serpapi_scholar_link: string;
}

export interface Profile {
	name: string;
	link: string;
	author_id: string;
	affiliations: string;
	email: string;
	interests: [Interests];
}

export interface Interests {
	title: string;
	link: string;
	serpapi_scholar_link: string;
}
