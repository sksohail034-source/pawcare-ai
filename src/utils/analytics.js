import ReactGA from "react-ga4";

// Initialize GA4 with a Measurement ID
// Aap Google Analytics dashboard se Measurement ID (G-XXXXXXXXXX) leke yahan daal sakte hain.
export const initGA = (id) => {
  if (id) {
    ReactGA.initialize(id);
    console.log("[Analytics] ✅ Initialized with ID:", id);
  } else {
    console.log("[Analytics] ⚠️ No ID provided, running in debug mode");
  }
};

// Track Page Views
export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

// Track Custom Events (e.g., 'Pet Added', 'Scan Used')
export const trackEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};

// Track User ID (optional, to see repeat users)
export const setUserId = (userId) => {
  if (userId) {
    ReactGA.set({ userId });
  }
};
