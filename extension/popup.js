document.addEventListener('DOMContentLoaded', () => {
  const setupView = document.getElementById('setup-view');
  const captureView = document.getElementById('capture-view');
  const serverUrlInput = document.getElementById('server-url');
  const apiKeyInput = document.getElementById('api-key');
  const saveBtn = document.getElementById('save-settings');
  const syncBtn = document.getElementById('sync-now');
  const editBtn = document.getElementById('edit-settings');
  const statusMsg = document.getElementById('status-msg');
  const jobPreview = document.getElementById('job-preview');

  // Load saved settings
  chrome.storage.local.get(['serverUrl', 'apiKey'], (data) => {
    if (data.serverUrl) serverUrlInput.value = data.serverUrl;
    if (data.apiKey) {
      apiKeyInput.value = data.apiKey;
      showCaptureView();
    }
  });

  saveBtn.addEventListener('click', () => {
    const serverUrl = serverUrlInput.value.trim() || 'http://localhost:3000';
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
      showStatus('API Key is required', 'error');
      return;
    }

    chrome.storage.local.set({ serverUrl, apiKey }, () => {
      showStatus('Settings saved', 'success');
      setTimeout(showCaptureView, 1000);
    });
  });

  editBtn.addEventListener('click', () => {
    setupView.style.display = 'block';
    captureView.style.display = 'none';
  });

  syncBtn.addEventListener('click', async () => {
    syncBtn.disabled = true;
    syncBtn.textContent = 'Syncing...';

    // Get current tab data
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { action: 'get_job_details' }, async (response) => {
        if (!response) {
          showStatus('Could not capture job details. Are you on a job page?', 'error');
          syncBtn.disabled = false;
          syncBtn.textContent = 'Sync to JobTracker';
          return;
        }

        try {
          const { serverUrl, apiKey } = await chrome.storage.local.get(['serverUrl', 'apiKey']);
          const apiResponse = await fetch(`${serverUrl}/api/external/applications`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': apiKey
            },
            body: JSON.stringify(response)
          });

          const result = await apiResponse.json();
          if (apiResponse.ok) {
            showStatus('Job synced successfully!', 'success');
          } else {
            showStatus(result.error || 'Sync failed', 'error');
          }
        } catch (error) {
          showStatus('Server connection failed', 'error');
        } finally {
          syncBtn.disabled = false;
          syncBtn.textContent = 'Sync to JobTracker';
        }
      });
    });
  });

  function showCaptureView() {
    setupView.style.display = 'none';
    captureView.style.display = 'block';
    
    // Try to pre-capture details
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'get_job_details' }, (response) => {
        if (response) {
          jobPreview.style.display = 'block';
          document.getElementById('preview-title').textContent = response.positionTitle;
          document.getElementById('preview-company').textContent = response.companyName;
        }
      });
    });
  }

  function showStatus(msg, type) {
    statusMsg.textContent = msg;
    statusMsg.className = `status ${type}`;
    setTimeout(() => {
      statusMsg.style.display = 'none';
    }, 3000);
  }
});
