const PAGE_SIZE = 10 as const;
export type CaftanType = {
	image_url: string;
	compition_name: string;
	isWinner: boolean;
	title: string;
	description: string;
	designer_name: string;
};
export type CaftanResponse = {
	totalPages: number;
	length: number;
	caftans: CaftanType[];
};
export async function getCaftans(page: number): Promise<CaftanResponse> {
	const d_ind = page * PAGE_SIZE;
	const f_ind = d_ind + PAGE_SIZE;

	const server_url = "/src/assets/products_data.json";
	const response = await fetch(server_url);
	if (!response.ok) {
		throw new Error("failed to fetch data");
	}

	const data = await response.json();

	return {
		caftans: data.slice(d_ind, f_ind),
		totalPages: data.length / PAGE_SIZE,
		length: PAGE_SIZE,
	};
}
