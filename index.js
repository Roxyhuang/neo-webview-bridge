(() => {
  const document = window.document;
const userAgent = navigator.userAgent;
const isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1;
const isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
const isWeixin = userAgent.indexOf('micromessenger') !== -1;
let platForm;
if (isAndroid && !isiOS) {
  platForm = 'Android';
} else if (isiOS && !isAndroid) {
  platForm = 'iOS';
} else {
  platForm = 'Web';
}
if (isWeixin) {
  platForm = 'Web';
}
function NeoWebView() {
  this.platForm = platForm;
}

NeoWebView.prototype.init = (isShare = false, isExitWebview = false) => {
  document.isShare = isShare;
  document.isExitWebview = isExitWebview;
};
NeoWebView.prototype.registerFunction = (fnList = []) => {
  if (!fnList || fnList.constructor !== Array) {
    window.alert('You must have a param');
  }
  fnList.forEach((item) => {
    if (NeoWebView.prototype[item.name]) {
    if (!item.param) {
      item.param = null;
    }
    document[item.name] = () => {
      NeoWebView.prototype[item.name](item.param);
    };
  } else {
    NeoWebView.prototype[item.name] = item.callback;
    document[item.name] = item.callback;
  }
});
};

NeoWebView.prototype.doShare = (shareConfig = {}, callback) => {
  if (!shareConfig || shareConfig.constructor !== Object) {
    window.alert('This param need  a Map or This param is empty');
    return;
  }
  switch (platForm) {
    case 'Android':
      shareURL.postMessage(JSON.stringify(shareConfig));
      break;
    case 'iOS':
      window.webkit.messageHandlers.shareURL.postMessage(shareConfig);
      break;
    default:
      break;
  }
  if (callback && callback.constructor === Function) {
    callback();
  }
};
NeoWebView.prototype.doShareImg = (deepLink = '', callback) => {
  if (!deepLink || typeof deepLink !== 'string') {
    window.alert('This param need  a String or This param is empty ');
    return;
  }
  switch (platForm) {
    case 'Android':
      shareImage.postMessage(JSON.stringify(deepLink));
      break;
    case 'iOS':
      window.webkit.messageHandlers.shareImage.postMessage(deepLink);
      break;
    default:
      break;
  }
  if (callback && callback.constructor === Function) {
    callback();
  }
};

NeoWebView.prototype.doExitWebView = (callback) => {
  switch (platForm) {
    case 'Android':
      exitWebView.postMessage(JSON.stringify(null));
      break;
    case 'iOS':
      window.webkit.messageHandlers.exitWebView.postMessage(null);
      break;
    default:
      break;
  }
  if (callback && callback.constructor === Function) {
    callback();
  }
};
NeoWebView.prototype.setIsShare = (param) => {
  if (!param || typeof param !== 'boolean') {
    window.alert('This param need  a boolean or This param is empty');
    return;
  }
  document.isShare = param;
};
NeoWebView.prototype.setIsExitWebview = (param) => {
  if (!param || typeof param !== 'boolean') {
    window.alert('This param need  a boolean or This param is empty');
    return;
  }
  document.isExitWebview = param;
};
window.NeoWebView = new NeoWebView();
})();
