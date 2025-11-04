import axios from "axios";

const BASE_URL = "https://backend-03-lyra.onrender.com/api/analytics";

// Fetch all events
export const fetchAnalyticsEvents = async () => {
  const res = await axios.get(BASE_URL + "/all"); // You may need to implement /all in your backend (or just GET /api/analytics if it returns all)
  return res.data;
};

export const fetchScansByPainting = async () => {
  const res = await axios.get("http://localhost:3001/api/analytics/scans-by-painting");
  return res.data;
};

// Fetch most scanned
export const fetchSummary = async () => {
  const res = await axios.get(BASE_URL + "/summary");
  return res.data.mostScannedPaintings;
};
