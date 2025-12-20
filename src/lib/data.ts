import axios from "axios";
import "server-only";

const url = process.env.API_URL || "http://localhost:8080/api/v1";
export async function getAuctions() {
  try {
    const res = await axios.get(`${url}/auctions?limit=8`);
    const data = await res.data;
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch auctions:", error);
    return [];
  }
}

export async function getAuctionByID(id: string) {
  try {
    const res = await axios.get(`${url}/auctions/${id}`);
    const data = await res.data;
    return data.data || null;
  } catch (error) {
    console.error("Failed to fetch auction:", error);
    return null;
  }
}
