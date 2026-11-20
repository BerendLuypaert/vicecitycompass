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
  window.vccSetAnalyticsConsent = function (granted) {
    const state = granted ? 'granted' : 'denied';
    window.gtag('consent', 'update', { analytics_storage: state, ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    if (granted && !pageViewSent) {
      pageViewSent = true;
      window.gtag('event', 'page_view', { page_title: document.title, page_location: window.location.href, page_path: window.location.pathname });
    }
  };
  window.addEventListener('vcc:consent', function (event) {
    if (event.detail && typeof event.detail.analyticsGranted === 'boolean') window.vccSetAnalyticsConsent(event.detail.analyticsGranted);
  });
}());
