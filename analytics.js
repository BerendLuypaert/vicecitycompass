(function () {
  'use strict';
  if (window.__viceCityCompassAnalyticsLoaded) return;
  window.__viceCityCompassAnalyticsLoaded = true;
  const measurementId = 'G-KHGZ1KKZBD';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });
  const loader = document.createElement('script');
  loader.async = true;
  loader.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(loader);
  let pageViewSent = false;

  function applyAnalyticsConsent(granted) {
    const state = granted ? 'granted' : 'denied';
    window.gtag('consent', 'update', { analytics_storage: state, ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    if (granted && !pageViewSent) {
      pageViewSent = true;
      window.gtag('event', 'page_view', { page_title: document.title, page_location: window.location.href, page_path: window.location.pathname });
    }
  }

  function syncFromGoogleConsent() {
    if (!window.googlefc || typeof window.googlefc.getGoogleConsentModeValues !== 'function') return;
    const values = window.googlefc.getGoogleConsentModeValues();
    const analyticsStatus = values && values.analyticsStoragePurposeConsentStatus;
    // Google enum: GRANTED=1, DENIED=2, NOT_APPLICABLE=3, NOT_CONFIGURED=4.
    // NOT_CONFIGURED remains blocked so analytics cannot bypass an unconfigured CMP.
    applyAnalyticsConsent(analyticsStatus === 1 || analyticsStatus === 3);
  }

  // Google Privacy & Messaging's supported asynchronous integration.
  window.googlefc = window.googlefc || {};
  window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
  window.googlefc.callbackQueue.push({ CONSENT_MODE_DATA_READY: syncFromGoogleConsent });
  window.googlefc.callbackQueue.push({
    CONSENT_API_READY: function () {
      if (typeof window.__tcfapi === 'function') {
        window.__tcfapi('addEventListener', 2.2, function () { setTimeout(syncFromGoogleConsent, 0); });
      }
    }
  });

  // Backwards-compatible hook; GA4 now follows Google's published signal above.
  window.vccSetAnalyticsConsent = applyAnalyticsConsent;
}());
