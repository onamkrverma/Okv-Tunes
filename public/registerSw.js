const registerSw = async () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  // New update available
                  if (confirm("New content is available; please refresh.")) {
                    window.location.reload();
                  }
                } else {
                  // Content is cached for offline use
                  console.log("Content is cached for offline use.");
                }
              }
            };
          }
        };
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  }
};

export default registerSw;
