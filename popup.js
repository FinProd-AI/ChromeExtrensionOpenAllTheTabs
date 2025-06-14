// popup.js
// Dynamically set popup background to Chrome's theme
document.addEventListener('DOMContentLoaded', async () => {
    const devicesDiv = document.getElementById('devices');
    const tabsDiv = document.getElementById('tabs');
  
    // Fetch synced sessions (devices)
    const sessions = await chrome.sessions.getDevices();
    if (!sessions || sessions.length === 0) {
      devicesDiv.textContent = "No synced devices found.";
      return;
    }
  
    // List devices and their tabs
    sessions.forEach(device => {
      const deviceButton = document.createElement('button');
      deviceButton.textContent = device.deviceName;
      deviceButton.onclick = async () => {
        tabsDiv.innerHTML = '';
        if (!device.sessions || device.sessions.length === 0) {
          tabsDiv.textContent = "No tabs found on this device.";
          return;
        }

        // Add "Open all Tabs" button
        const openAllButton = document.createElement('button');
        openAllButton.textContent = "Open all Tabs";
        openAllButton.style.marginBottom = '10px';
        openAllButton.onclick = () => {
          device.sessions.forEach(session => {
            session.window.tabs.forEach(tab => {
              chrome.tabs.create({ url: tab.url });
            });
          });
        };
        tabsDiv.appendChild(openAllButton);

        // For each session (window), list tabs
        device.sessions.forEach(session => {
          session.window.tabs.forEach(tab => {
            const tabButton = document.createElement('button');
            tabButton.textContent = tab.title || tab.url;
            tabButton.onclick = () => {
              chrome.tabs.create({ url: tab.url });
            };
            tabsDiv.appendChild(tabButton);
          });
        });
      };
      devicesDiv.appendChild(deviceButton);
    });
  });
  