function detectOSUsingPlatform() {
  const platform = navigator.platform.toLowerCase();
  if (platform.includes("mac")) {
    return "macOS";
  } else if (platform.includes("win")) {
    return "Windows";
  }
  return "Unknown";
}

function robustOSDetection() {
  try {
    // Prefer userAgentData if available
    if ("userAgentData" in navigator && navigator.userAgentData) {
      const platform = (navigator.userAgentData as { platform: string })
        ?.platform;
      if (platform === "macOS" || platform === "Windows") return platform;
    }
    // Fallback to navigator.platform
    return detectOSUsingPlatform();
  } catch (e) {
    console.error("OS detection failed:", e);
    return "Unknown"; // Handle errors (e.g., blocked by privacy settings)
  }
}

export function isMacOS() {
  const platform = robustOSDetection();
  return platform === "macOS";
}
