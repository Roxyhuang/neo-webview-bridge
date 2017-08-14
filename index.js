(() => {
  const document = window.document;
  const userAgent = navigator.userAgent;
  const isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1;
  const isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  const isWeixin = userAgent.indexOf('micromessenger') !== -1;
  let platForm;
  if (isWeixin) {
    platForm = 'Web';
  } else if (isAndroid) {
    platForm = 'Android';
  } else if (isiOS) {
    platForm = 'iOS';
  } else {
    platForm = 'Web';
  }

  class NeoWebView {

    constructor(platForm) {
      this.platForm = platForm;

    }

    init(isShare = false, isExitWebview = false, shareType = 0) {
      document.isShare = isShare;
      document.isExitWebview = isExitWebview;
      document.shareType = shareType;  // 0: none 1: share url 2: share img
    }

    registerFunction(fnList = []) {
      if (!fnList || fnList.constructor !== Array) {
        window.alert('You must have a param');
      }
      fnList.forEach((item) => {
        if (this[item.name]) {
          item.param = item.param || null;
          document[item.name] = () => {
            this[item.name](item.param);
          };
        } else {
          this[item.name] = item.callback;
          document[item.name] = item.callback;
        }
      });
    }
    registerFunctionForNativeWithCallback(fnList) {
      fnList.forEach((item) => {
        document[item.name] = (nativeParam) => {
          item.callback(nativeParam, item.param);
        };
      });
    }
    doShare(params = {}, callback) {
      if (!params) {
        window.alert('This param need  a Map or This param is empty');
        return;
      }
      switch (document.shareType) {
        case 0:
          break;
        case 1:
          this.doShareURL(params, callback);
          break;
        case 2:
          this.doRedirect(params, callback);
          break;
        case 3:
          this.doActionSheet(params, callback);
          break;
        default:
          break;
      }
    }
    doActionSheet(shareConfig = {}, callback) {
      if (!shareConfig || shareConfig.constructor !== Object) {
        window.alert('This param need  a Map or This param is empty');
        return;
      }
      switch (this.platForm) {
        case 'Android':
          actionSheet.postMessage(JSON.stringify(shareConfig));
          break;
        case 'iOS':
          window.webkit.messageHandlers.actionSheet.postMessage(shareConfig);
          break;
        default:
          break;
      }
      if (callback && callback.constructor === Function) {
        callback();
      }
    }
    selectActionSheet(index, callback) {
      callback(index);
    }
    doShareURL(shareConfig = {}, callback) {
      if (!shareConfig || shareConfig.constructor !== Object) {
        window.alert('This param need  a Map or This param is empty');
        return;
      }
      switch (this.platForm) {
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
    }

    doRedirect(deepLink = '', callback) {
      if (!deepLink || typeof deepLink !== 'string') {
        window.alert('This param need  a String or This param is empty ');
        return;
      }
      switch (this.platForm) {
        case 'Android':
          redirect.postMessage(JSON.stringify(deepLink));
          break;
        case 'iOS':
          window.webkit.messageHandlers.redirect.postMessage(deepLink);
          break;
        default:
          break;
      }
      if (callback && callback.constructor === Function) {
        callback();
      }
    }

    doExitWebView(callback) {
      switch (this.platForm) {
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
    }

    setIsShare(param) {
      if (!param || typeof param !== 'boolean') {
        window.alert('This param need  a boolean or This param is empty');
        return;
      }
      document.isShare = param;
    }

    setIsExitWebview(param) {
      if (!param || typeof param !== 'boolean') {
        window.alert('This param need  a boolean or This param is empty');
        return;
      }
      document.isExitWebview = param;
    }

  }

  window.NeoWebView = new NeoWebView(platForm);
})();
