/**
 * Content Script for JobTracker Extension
 * Handles scraping job details from LinkedIn, Indeed, etc.
 */

function getJobDetails() {
  const url = window.location.href;
  
  if (url.includes('linkedin.com/jobs')) {
    return scrapeLinkedIn();
  } else if (url.includes('indeed.com')) {
    return scrapeIndeed();
  }
  
  return scrapeGeneric();
}

function scrapeLinkedIn() {
  // LinkedIn Jobs often use specific selectors for the active job in a list or the full job page
  const title = document.querySelector('.jobs-unified-top-card__job-title, .job-details-jobs-unified-top-card__content--two-pane h1')?.innerText?.trim();
  const company = document.querySelector('.jobs-unified-top-card__company-name, .job-details-jobs-unified-top-card__primary-description-container a')?.innerText?.trim();
  const location = document.querySelector('.jobs-unified-top-card__bullet, .job-details-jobs-unified-top-card__primary-description-container span:nth-child(2)')?.innerText?.trim();
  
  if (!title) return null;

  return {
    positionTitle: title,
    companyName: company || 'Unknown',
    location: location || '',
    jobLink: window.location.href,
    platform: 'LINKEDIN',
    status: 'APPLIED'
  };
}

function scrapeIndeed() {
  const title = document.querySelector('.jobsearch-JobInfoHeader-title')?.innerText?.trim();
  const company = document.querySelector('[data-company-name="true"]')?.innerText?.trim();
  const location = document.querySelector('.jobsearch-JobInfoHeader-subtitle div:nth-child(2)')?.innerText?.trim();

  if (!title) return null;

  return {
    positionTitle: title,
    companyName: company || 'Unknown',
    location: location || '',
    jobLink: window.location.href,
    platform: 'INDEED',
    status: 'APPLIED'
  };
}

function scrapeGeneric() {
  // Generic fallback using Open Graph or common meta tags
  const ogTitle = document.querySelector('meta[property="og:title"]')?.content;
  const ogSiteName = document.querySelector('meta[property="og:site_name"]')?.content;
  const title = ogTitle || document.title;
  
  return {
    positionTitle: title,
    companyName: ogSiteName || 'Unknown',
    jobLink: window.location.href,
    platform: 'OTHER',
    status: 'APPLIED'
  };
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'get_job_details') {
    const details = getJobDetails();
    sendResponse(details);
  }
  return true;
});

// Auto-detect "Submit" button clicks
document.addEventListener('click', (e) => {
  const target = e.target;
  const text = target.innerText?.toLowerCase() || '';
  const isSubmitButton = 
    text.includes('submit') || 
    text.includes('post application') || 
    text.includes('apply now') ||
    target.classList.contains('jobs-apply-button');

  if (isSubmitButton) {
    console.log('Job application submission detected');
    
    // Capture details immediately
    const details = getJobDetails();
    if (details) {
      // Notify the background script to show a notification or handle auto-sync
      chrome.runtime.sendMessage({ 
        action: 'notify_submission', 
        details 
      });
    }
  }
}, true);
