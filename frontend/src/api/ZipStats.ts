const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export type ZipStatsResponse = {
  postal_code: string;
  average_price: number;
  average_square_feet: number;
};

export const fetchZipStats = async(
  postalCode: string
): Promise<ZipStatsResponse> => {
  const res = await fetch(`${API_BASE_URL}/listings/stats/${postalCode}`);
  if (!res.ok) {
    throw new Error("No average data available for this ZIP code.");
  }
  return res.json();
};
