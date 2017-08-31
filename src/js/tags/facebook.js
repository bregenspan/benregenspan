/* global FB */

export default function loadFacebookSDK () {
  window.fbAsyncInit = function () {
    try {
      FB.init({
        async: true,
        xfbml: true,
        version: 'v2.8'
      });

      // Trigger some crazy styling after the user hits Like
      FB.Event.subscribe('edge.create', function () {
        document.body.classList.add('sickening');
      });
    } catch (e) {
      console.log('Error loading Facebook SDK', e);
    }
  };

  (function (d, s, id) {
    let js;
    let fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}
