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

  const server_url = '/src/assets/products_data.json';
  const response = await fetch(server_url);
  if (!response.ok) {
    throw new Error('failed to fetch data');
  }

  const data = await response.json();

  return {
    caftans: data.slice(d_ind, f_ind),
    totalPages: data.length / PAGE_SIZE,
    length: PAGE_SIZE,
  };
}

const BASE_URL = 'http://localhost:8000'; // change to your FastAPI host

type Caftan = {
  id?: string;
  caftanName: string;
  caftanCategory: string;
  caftanDescription: string;
  caftanPublisherName: string;
  keyWords: string[];
  image_url?: string;
};

type Review = {
  id?: string;
  caftan_id: string;
  client_name: string;
  rating: number;
  comment: string;
};

type ChatMessage = {
  message: string;
};

async function fetchJSON<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// === Caftans ===
export const getCaftans = (params: Record<string, any> = {}) =>
  fetchJSON(`${BASE_URL}/api/caftans?${new URLSearchParams(params)}`);

export const getCaftanById = (id: string) =>
  fetchJSON(`${BASE_URL}/api/caftans/${id}`);

export const createCaftan = (caftan: Caftan) =>
  fetchJSON(`${BASE_URL}/api/caftans`, {
    method: 'POST',
    body: JSON.stringify(caftan),
  });

export const updateCaftan = (id: string, caftan: Caftan) =>
  fetchJSON(`${BASE_URL}/api/caftans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(caftan),
  });

export const deleteCaftan = (id: string) =>
  fetchJSON(`${BASE_URL}/api/caftans/${id}`, { method: 'DELETE' });

// === Upload Image ===
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/api/upload-image`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// === Reviews ===
export const createReview = (review: Review) =>
  fetchJSON(`${BASE_URL}/api/reviews`, {
    method: 'POST',
    body: JSON.stringify(review),
  });

export const getReviews = (params: Record<string, any> = {}) =>
  fetchJSON(`${BASE_URL}/api/reviews?${new URLSearchParams(params)}`);

export const getCaftanReviews = (caftan_id: string, page = 1, limit = 10) =>
  fetchJSON(
    `${BASE_URL}/api/caftans/${caftan_id}/reviews?page=${page}&limit=${limit}`
  );

export const deleteReview = (id: string) =>
  fetchJSON(`${BASE_URL}/api/reviews/${id}`, { method: 'DELETE' });

// === Chatbot ===
export const sendChatMessage = (message: ChatMessage) =>
  fetchJSON(`${BASE_URL}/api/chatbot`, {
    method: 'POST',
    body: JSON.stringify(message),
  });

// === Statistics ===
export const getStatistics = () => fetchJSON(`${BASE_URL}/api/statistics`);

// === Health Check ===
export const healthCheck = () => fetchJSON(`${BASE_URL}/health`);
