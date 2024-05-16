import { getJson } from "serpapi";
import "dotenv/config";
import { Author, Profile, ScholarOrganic } from "../types/Types";

export const scholarController = {
	getOrganicResults: async (query: string): Promise<[ScholarOrganic]> => {
		const response = (
			await getJson({
				engine: "google_scholar",
				api_key: process.env.SERP_API_KEY as string,
				q: query,
			})
		)["organic_results"];
		console.log(JSON.stringify(response));
		console.log(response["0"].resources);

		return response?.map((result: any) => {
			return {
				title: result.title,
				summary: result.publication_info.summary,
				authors: result.publication_info.authors,
				link: result.link,
			};
		});
	},
	getProfiles: async (query: string): Promise<[Profile]> => {
		const response = (
			await getJson({
				engine: "google_scholar_profiles",
				api_key: process.env.SERP_API_KEY as string,
				mauthors: query,
			})
		)["profiles"];

		return (
			response?.map((result: any) => {
				return {
					name: result.name,
					link: result.link,
					author_id: result.author_id,
					affiliations: result.affiliations,
					email: result.email,
					interests: result.interests,
					thumbnail: result.thumbnail,
				};
			}) ?? []
		);
	},

	getAuthor: async (id: string): Promise<Author | undefined> => {
		const response = await getJson({
			engine: "google_scholar_author",
			api_key: process.env.SERP_API_KEY as string,
			author_id: id,
			hl: "en",
			sort: "pubdate",
			num: 100,
		});

		if (response.author) {
			return {
				name: response.author.name,
				affiliations: response.author.affiliations,
				email: response.author.email,
				interests: response.author.interests,
				articles: response.articles,
				thumbnail: response.author.thumbnail,
			};
		}

		return undefined;
	},
};
