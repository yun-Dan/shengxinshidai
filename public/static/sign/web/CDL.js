/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* globals VBArray, PDFJS */

'use strict';

// Initializing PDFJS global object here, it case if we need to change/disable
// some PDF.js features, e.g. range requests
if (typeof PDFJS === 'undefined') {
  (typeof window !== 'undefined' ? window : this).PDFJS = {};
}

// Checking if the typed arrays are supported
// Support: iOS<6.0 (subarray), IE<10, Android<4.0
(function checkTypedArrayCompatibility() {
  if (typeof Uint8Array !== 'undefined') {
    // Support: iOS<6.0
    if (typeof Uint8Array.prototype.subarray === 'undefined') {
        Uint8Array.prototype.subarray = function subarray(start, end) {
          return new Uint8Array(this.slice(start, end));
        };
        Float32Array.prototype.subarray = function subarray(start, end) {
          return new Float32Array(this.slice(start, end));
        };
    }

    // Support: Android<4.1
    if (typeof Float64Array === 'undefined') {
      window.Float64Array = Float32Array;
    }
    return;
  }

  function subarray(start, end) {
    return new TypedArray(this.slice(start, end));
  }

  function setArrayOffset(array, offset) {
    if (arguments.length < 2) {
      offset = 0;
    }
    for (var i = 0, n = array.length; i < n; ++i, ++offset) {
      this[offset] = array[i] & 0xFF;
    }
  }

  function TypedArray(arg1) {
    var result, i, n;
    if (typeof arg1 === 'number') {
      result = [];
      for (i = 0; i < arg1; ++i) {
        result[i] = 0;
      }
    } else if ('slice' in arg1) {
      result = arg1.slice(0);
    } else {
      result = [];
      for (i = 0, n = arg1.length; i < n; ++i) {
        result[i] = arg1[i];
      }
    }

    result.subarray = subarray;
    result.buffer = result;
    result.byteLength = result.length;
    result.set = setArrayOffset;

    if (typeof arg1 === 'object' && arg1.buffer) {
      result.buffer = arg1.buffer;
    }
    return result;
  }

  window.Uint8Array = TypedArray;
  window.Int8Array = TypedArray;

  // we don't need support for set, byteLength for 32-bit array
  // so we can use the TypedArray as well
  window.Uint32Array = TypedArray;
  window.Int32Array = TypedArray;
  window.Uint16Array = TypedArray;
  window.Float32Array = TypedArray;
  window.Float64Array = TypedArray;
})();

// URL = URL || webkitURL
// Support: Safari<7, Android 4.2+
(function normalizeURLObject() {
  if (!window.URL) {
    window.URL = window.webkitURL;
  }
})();

// Object.defineProperty()?
// Support: Android<4.0, Safari<5.1
(function checkObjectDefinePropertyCompatibility() {
  if (typeof Object.defineProperty !== 'undefined') {
    var definePropertyPossible = true;
    try {
      // some browsers (e.g. safari) cannot use defineProperty() on DOM objects
      // and thus the native version is not sufficient
      Object.defineProperty(new Image(), 'id', { value: 'test' });
      // ... another test for android gb browser for non-DOM objects
      var Test = function Test() {};
      Test.prototype = { get id() { } };
      Object.defineProperty(new Test(), 'id',
        { value: '', configurable: true, enumerable: true, writable: false });
    } catch (e) {
      definePropertyPossible = false;
    }
    if (definePropertyPossible) {
      return;
    }
  }

  Object.defineProperty = function objectDefineProperty(obj, name, def) {
    delete obj[name];
    if ('get' in def) {
      obj.__defineGetter__(name, def['get']);
    }
    if ('set' in def) {
      obj.__defineSetter__(name, def['set']);
    }
    if ('value' in def) {
      obj.__defineSetter__(name, function objectDefinePropertySetter(value) {
        this.__defineGetter__(name, function objectDefinePropertyGetter() {
          return value;
        });
        return value;
      });
      obj[name] = def.value;
    }
  };
})();


// No XMLHttpRequest#response?
// Support: IE<11, Android <4.0
(function checkXMLHttpRequestResponseCompatibility() {
  var xhrPrototype = XMLHttpRequest.prototype;
  var xhr = new XMLHttpRequest();
  if (!('overrideMimeType' in xhr)) {
    // IE10 might have response, but not overrideMimeType
    // Support: IE10
    Object.defineProperty(xhrPrototype, 'overrideMimeType', {
      value: function xmlHttpRequestOverrideMimeType(mimeType) {}
    });
  }
  if ('responseType' in xhr) {
    return;
  }

  // The worker will be using XHR, so we can save time and disable worker.
  PDFJS.disableWorker = true;

  Object.defineProperty(xhrPrototype, 'responseType', {
    get: function xmlHttpRequestGetResponseType() {
      return this._responseType || 'text';
    },
    set: function xmlHttpRequestSetResponseType(value) {
      if (value === 'text' || value === 'arraybuffer') {
        this._responseType = value;
        if (value === 'arraybuffer' &&
            typeof this.overrideMimeType === 'function') {
          this.overrideMimeType('text/plain; charset=x-user-defined');
        }
      }
    }
  });

  // Support: IE9
  if (typeof VBArray !== 'undefined') {
    Object.defineProperty(xhrPrototype, 'response', {
      get: function xmlHttpRequestResponseGet() {
        if (this.responseType === 'arraybuffer') {
          return new Uint8Array(new VBArray(this.responseBody).toArray());
        } else {
          return this.responseText;
        }
      }
    });
    return;
  }

  Object.defineProperty(xhrPrototype, 'response', {
    get: function xmlHttpRequestResponseGet() {
      if (this.responseType !== 'arraybuffer') {
        return this.responseText;
      }
      var text = this.responseText;
      var i, n = text.length;
      var result = new Uint8Array(n);
      for (i = 0; i < n; ++i) {
        result[i] = text.charCodeAt(i) & 0xFF;
      }
      return result.buffer;
    }
  });
})();

// window.btoa (base64 encode function) ?
// Support: IE<10
(function checkWindowBtoaCompatibility() {
  if ('btoa' in window) {
    return;
  }

  var digits =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  window.btoa = function windowBtoa(chars) {
    var buffer = '';
    var i, n;
    for (i = 0, n = chars.length; i < n; i += 3) {
      var b1 = chars.charCodeAt(i) & 0xFF;
      var b2 = chars.charCodeAt(i + 1) & 0xFF;
      var b3 = chars.charCodeAt(i + 2) & 0xFF;
      var d1 = b1 >> 2, d2 = ((b1 & 3) << 4) | (b2 >> 4);
      var d3 = i + 1 < n ? ((b2 & 0xF) << 2) | (b3 >> 6) : 64;
      var d4 = i + 2 < n ? (b3 & 0x3F) : 64;
      buffer += (digits.charAt(d1) + digits.charAt(d2) +
                 digits.charAt(d3) + digits.charAt(d4));
    }
    return buffer;
  };
})();

// window.atob (base64 encode function)?
// Support: IE<10
(function checkWindowAtobCompatibility() {
  if ('atob' in window) {
    return;
  }

  // https://github.com/davidchambers/Base64.js
  var digits =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  window.atob = function (input) {
    input = input.replace(/=+$/, '');
    if (input.length % 4 === 1) {
      throw new Error('bad atob input');
    }
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      buffer = input.charAt(idx++);
      // character found in table?
      // initialize bit storage and add its ascii value
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = digits.indexOf(buffer);
    }
    return output;
  };
})();

// Function.prototype.bind?
// Support: Android<4.0, iOS<6.0
(function checkFunctionPrototypeBindCompatibility() {
  if (typeof Function.prototype.bind !== 'undefined') {
    return;
  }

  Function.prototype.bind = function functionPrototypeBind(obj) {
    var fn = this, headArgs = Array.prototype.slice.call(arguments, 1);
    var bound = function functionPrototypeBindBound() {
      var args = headArgs.concat(Array.prototype.slice.call(arguments));
      return fn.apply(obj, args);
    };
    return bound;
  };
})();

// HTMLElement dataset property
// Support: IE<11, Safari<5.1, Android<4.0
(function checkDatasetProperty() {
  var div = document.createElement('div');
  if ('dataset' in div) {
    return; // dataset property exists
  }

  Object.defineProperty(HTMLElement.prototype, 'dataset', {
    get: function() {
      if (this._dataset) {
        return this._dataset;
      }

      var dataset = {};
      for (var j = 0, jj = this.attributes.length; j < jj; j++) {
        var attribute = this.attributes[j];
        if (attribute.name.substring(0, 5) !== 'data-') {
          continue;
        }
        var key = attribute.name.substring(5).replace(/\-([a-z])/g,
          function(all, ch) {
            return ch.toUpperCase();
          });
        dataset[key] = attribute.value;
      }

      Object.defineProperty(this, '_dataset', {
        value: dataset,
        writable: false,
        enumerable: false
      });
      return dataset;
    },
    enumerable: true
  });
})();

// HTMLElement classList property
// Support: IE<10, Android<4.0, iOS<5.0
(function checkClassListProperty() {
  var div = document.createElement('div');
  if ('classList' in div) {
    return; // classList property exists
  }

  function changeList(element, itemName, add, remove) {
    var s = element.className || '';
    var list = s.split(/\s+/g);
    if (list[0] === '') {
      list.shift();
    }
    var index = list.indexOf(itemName);
    if (index < 0 && add) {
      list.push(itemName);
    }
    if (index >= 0 && remove) {
      list.splice(index, 1);
    }
    element.className = list.join(' ');
    return (index >= 0);
  }

  var classListPrototype = {
    add: function(name) {
      changeList(this.element, name, true, false);
    },
    contains: function(name) {
      return changeList(this.element, name, false, false);
    },
    remove: function(name) {
      changeList(this.element, name, false, true);
    },
    toggle: function(name) {
      changeList(this.element, name, true, true);
    }
  };

  Object.defineProperty(HTMLElement.prototype, 'classList', {
    get: function() {
      if (this._classList) {
        return this._classList;
      }

      var classList = Object.create(classListPrototype, {
        element: {
          value: this,
          writable: false,
          enumerable: true
        }
      });
      Object.defineProperty(this, '_classList', {
        value: classList,
        writable: false,
        enumerable: false
      });
      return classList;
    },
    enumerable: true
  });
})();

// Check console compatibility
// In older IE versions the console object is not available
// unless console is open.
// Support: IE<10
(function checkConsoleCompatibility() {
  if (!('console' in window)) {
    window.console = {
      log: function() {},
      error: function() {},
      warn: function() {}
    };
  } else if (!('bind' in console.log)) {
    // native functions in IE9 might not have bind
    console.log = (function(fn) {
      return function(msg) { return fn(msg); };
    })(console.log);
    console.error = (function(fn) {
      return function(msg) { return fn(msg); };
    })(console.error);
    console.warn = (function(fn) {
      return function(msg) { return fn(msg); };
    })(console.warn);
  }
})();

// Check onclick compatibility in Opera
// Support: Opera<15
(function checkOnClickCompatibility() {
  // workaround for reported Opera bug DSK-354448:
  // onclick fires on disabled buttons with opaque content
  function ignoreIfTargetDisabled(event) {
    if (isDisabled(event.target)) {
      event.stopPropagation();
    }
  }
  function isDisabled(node) {
    return node.disabled || (node.parentNode && isDisabled(node.parentNode));
  }
  if (navigator.userAgent.indexOf('Opera') !== -1) {
    // use browser detection since we cannot feature-check this bug
    document.addEventListener('click', ignoreIfTargetDisabled, true);
  }
})();

// Checks if possible to use URL.createObjectURL()
// Support: IE
(function checkOnBlobSupport() {
  // sometimes IE loosing the data created with createObjectURL(), see #3977
  if (navigator.userAgent.indexOf('Trident') >= 0) {
    PDFJS.disableCreateObjectURL = true;
  }
})();

// Checks if navigator.language is supported
(function checkNavigatorLanguage() {
  if ('language' in navigator) {
    return;
  }
  PDFJS.locale = navigator.userLanguage || 'en-US';
})();

(function checkRangeRequests() {
  // Safari has issues with cached range requests see:
  // https://github.com/mozilla/pdf.js/issues/3260
  // Last tested with version 6.0.4.
  // Support: Safari 6.0+
  var isSafari = Object.prototype.toString.call(
                  window.HTMLElement).indexOf('Constructor') > 0;

  // Older versions of Android (pre 3.0) has issues with range requests, see:
  // https://github.com/mozilla/pdf.js/issues/3381.
  // Make sure that we only match webkit-based Android browsers,
  // since Firefox/Fennec works as expected.
  // Support: Android<3.0
  var regex = /Android\s[0-2][^\d]/;
  var isOldAndroid = regex.test(navigator.userAgent);

  // Range requests are broken in Chrome 39 and 40, https://crbug.com/442318
  var isChromeWithRangeBug = /Chrome\/(39|40)\./.test(navigator.userAgent);

  if (isSafari || isOldAndroid || isChromeWithRangeBug) {
    PDFJS.disableRange = true;
    PDFJS.disableStream = true;
  }
})();

// Check if the browser supports manipulation of the history.
// Support: IE<10, Android<4.2
(function checkHistoryManipulation() {
  // Android 2.x has so buggy pushState support that it was removed in
  // Android 3.0 and restored as late as in Android 4.2.
  // Support: Android 2.x
  if (!history.pushState || navigator.userAgent.indexOf('Android 2.') >= 0) {
    PDFJS.disableHistory = true;
  }
})();

// Support: IE<11, Chrome<21, Android<4.4, Safari<6
(function checkSetPresenceInImageData() {
  // IE < 11 will use window.CanvasPixelArray which lacks set function.
  if (window.CanvasPixelArray) {
    if (typeof window.CanvasPixelArray.prototype.set !== 'function') {
      window.CanvasPixelArray.prototype.set = function(arr) {
        for (var i = 0, ii = this.length; i < ii; i++) {
          this[i] = arr[i];
        }
      };
    }
  } else {
    // Old Chrome and Android use an inaccessible CanvasPixelArray prototype.
    // Because we cannot feature detect it, we rely on user agent parsing.
    var polyfill = false, versionMatch;
    if (navigator.userAgent.indexOf('Chrom') >= 0) {
      versionMatch = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
      // Chrome < 21 lacks the set function.
      polyfill = versionMatch && parseInt(versionMatch[2]) < 21;
    } else if (navigator.userAgent.indexOf('Android') >= 0) {
      // Android < 4.4 lacks the set function.
      // Android >= 4.4 will contain Chrome in the user agent,
      // thus pass the Chrome check above and not reach this block.
      polyfill = /Android\s[0-4][^\d]/g.test(navigator.userAgent);
    } else if (navigator.userAgent.indexOf('Safari') >= 0) {
      versionMatch = navigator.userAgent.
        match(/Version\/([0-9]+)\.([0-9]+)\.([0-9]+) Safari\//);
      // Safari < 6 lacks the set function.
      polyfill = versionMatch && parseInt(versionMatch[1]) < 6;
    }

    if (polyfill) {
      var contextPrototype = window.CanvasRenderingContext2D.prototype;
      var createImageData = contextPrototype.createImageData;
      contextPrototype.createImageData = function(w, h) {
        var imageData = createImageData.call(this, w, h);
        imageData.data.set = function(arr) {
          for (var i = 0, ii = this.length; i < ii; i++) {
            this[i] = arr[i];
          }
        };
        return imageData;
      };
      // this closure will be kept referenced, so clear its vars
      contextPrototype = null;
    }
  }
})();

// Support: IE<10, Android<4.0, iOS
(function checkRequestAnimationFrame() {
  function fakeRequestAnimationFrame(callback) {
    window.setTimeout(callback, 20);
  }

  var isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
  if (isIOS) {
    // requestAnimationFrame on iOS is broken, replacing with fake one.
    window.requestAnimationFrame = fakeRequestAnimationFrame;
    return;
  }
  if ('requestAnimationFrame' in window) {
    return;
  }
  window.requestAnimationFrame =
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    fakeRequestAnimationFrame;
})();

(function checkCanvasSizeLimitation() {
  var isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
  var isAndroid = /Android/g.test(navigator.userAgent);
  if (isIOS || isAndroid) {
    // 5MP
    PDFJS.maxCanvasPixels = 5242880;
  }
})();

// Disable fullscreen support for certain problematic configurations.
// Support: IE11+ (when embedded).
(function checkFullscreenSupport() {
  var isEmbeddedIE = (navigator.userAgent.indexOf('Trident') >= 0 &&
                      window.parent !== window);
  if (isEmbeddedIE) {
    PDFJS.disableFullscreen = true;
  }
})();

// Provides document.currentScript support
// Support: IE, Chrome<29.
(function checkCurrentScript() {
  if ('currentScript' in document) {
    return;
  }
  Object.defineProperty(document, 'currentScript', {
    get: function () {
      var scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    },
    enumerable: true,
    configurable: true
  });
})();
;/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var FontInspector = (function FontInspectorClosure() {
  var fonts;
  var active = false;
  var fontAttribute = 'data-font-name';
  function removeSelection() {
    var divs = document.querySelectorAll('div[' + fontAttribute + ']');
    for (var i = 0, ii = divs.length; i < ii; ++i) {
      var div = divs[i];
      div.className = '';
    }
  }
  function resetSelection() {
    var divs = document.querySelectorAll('div[' + fontAttribute + ']');
    for (var i = 0, ii = divs.length; i < ii; ++i) {
      var div = divs[i];
      div.className = 'debuggerHideText';
    }
  }
  function selectFont(fontName, show) {
    var divs = document.querySelectorAll('div[' + fontAttribute + '=' +
                                         fontName + ']');
    for (var i = 0, ii = divs.length; i < ii; ++i) {
      var div = divs[i];
      div.className = show ? 'debuggerShowText' : 'debuggerHideText';
    }
  }
  function textLayerClick(e) {
    if (!e.target.dataset.fontName ||
        e.target.tagName.toUpperCase() !== 'DIV') {
      return;
    }
    var fontName = e.target.dataset.fontName;
    var selects = document.getElementsByTagName('input');
    for (var i = 0; i < selects.length; ++i) {
      var select = selects[i];
      if (select.dataset.fontName !== fontName) {
        continue;
      }
      select.checked = !select.checked;
      selectFont(fontName, select.checked);
      select.scrollIntoView();
    }
  }
  return {
    // Properties/functions needed by PDFBug.
    id: 'FontInspector',
    name: 'Font Inspector',
    panel: null,
    manager: null,
    init: function init(pdfjsLib) {
      var panel = this.panel;
      panel.setAttribute('style', 'padding: 5px;');
      var tmp = document.createElement('button');
      tmp.addEventListener('click', resetSelection);
      tmp.textContent = 'Refresh';
      panel.appendChild(tmp);

      fonts = document.createElement('div');
      panel.appendChild(fonts);
    },
    cleanup: function cleanup() {
      fonts.textContent = '';
    },
    enabled: false,
    get active() {
      return active;
    },
    set active(value) {
      active = value;
      if (active) {
        document.body.addEventListener('click', textLayerClick, true);
        resetSelection();
      } else {
        document.body.removeEventListener('click', textLayerClick, true);
        removeSelection();
      }
    },
    // FontInspector specific functions.
    fontAdded: function fontAdded(fontObj, url) {
      function properties(obj, list) {
        var moreInfo = document.createElement('table');
        for (var i = 0; i < list.length; i++) {
          var tr = document.createElement('tr');
          var td1 = document.createElement('td');
          td1.textContent = list[i];
          tr.appendChild(td1);
          var td2 = document.createElement('td');
          td2.textContent = obj[list[i]].toString();
          tr.appendChild(td2);
          moreInfo.appendChild(tr);
        }
        return moreInfo;
      }
      var moreInfo = properties(fontObj, ['name', 'type']);
      var fontName = fontObj.loadedName;
      var font = document.createElement('div');
      var name = document.createElement('span');
      name.textContent = fontName;
      var download = document.createElement('a');
      if (url) {
        url = /url\(['"]?([^\)"']+)/.exec(url);
        download.href = url[1];
      } else if (fontObj.data) {
        url = URL.createObjectURL(new Blob([fontObj.data], {
          type: fontObj.mimeType
        }));
        download.href = url;
      }
      download.textContent = 'Download';
      var logIt = document.createElement('a');
      logIt.href = '';
      logIt.textContent = 'Log';
      logIt.addEventListener('click', function(event) {
        event.preventDefault();
        console.log(fontObj);
      });
      var select = document.createElement('input');
      select.setAttribute('type', 'checkbox');
      select.dataset.fontName = fontName;
      select.addEventListener('click', (function(select, fontName) {
        return (function() {
           selectFont(fontName, select.checked);
        });
      })(select, fontName));
      font.appendChild(select);
      font.appendChild(name);
      font.appendChild(document.createTextNode(' '));
      font.appendChild(download);
      font.appendChild(document.createTextNode(' '));
      font.appendChild(logIt);
      font.appendChild(moreInfo);
      fonts.appendChild(font);
      // Somewhat of a hack, should probably add a hook for when the text layer
      // is done rendering.
      setTimeout(function() {
        if (this.active) {
          resetSelection();
        }
      }.bind(this), 2000);
    }
  };
})();

// Manages all the page steppers.
var StepperManager = (function StepperManagerClosure() {
  var steppers = [];
  var stepperDiv = null;
  var stepperControls = null;
  var stepperChooser = null;
  var breakPoints = Object.create(null);
  return {
    // Properties/functions needed by PDFBug.
    id: 'Stepper',
    name: 'Stepper',
    panel: null,
    manager: null,
    init: function init() {
      var self = this;
      this.panel.setAttribute('style', 'padding: 5px;');
      stepperControls = document.createElement('div');
      stepperChooser = document.createElement('select');
      stepperChooser.addEventListener('change', function(event) {
        self.selectStepper(this.value);
      });
      stepperControls.appendChild(stepperChooser);
      stepperDiv = document.createElement('div');
      this.panel.appendChild(stepperControls);
      this.panel.appendChild(stepperDiv);
      if (sessionStorage.getItem('pdfjsBreakPoints')) {
        breakPoints = JSON.parse(sessionStorage.getItem('pdfjsBreakPoints'));
      }
    },
    cleanup: function cleanup() {
      stepperChooser.textContent = '';
      stepperDiv.textContent = '';
      steppers = [];
    },
    enabled: false,
    active: false,
    // Stepper specific functions.
    create: function create(pageIndex) {
      var debug = document.createElement('div');
      debug.id = 'stepper' + pageIndex;
      debug.setAttribute('hidden', true);
      debug.className = 'stepper';
      stepperDiv.appendChild(debug);
      var b = document.createElement('option');
      b.textContent = 'Page ' + (pageIndex + 1);
      b.value = pageIndex;
      stepperChooser.appendChild(b);
      var initBreakPoints = breakPoints[pageIndex] || [];
      var stepper = new Stepper(debug, pageIndex, initBreakPoints);
      steppers.push(stepper);
      if (steppers.length === 1) {
        this.selectStepper(pageIndex, false);
      }
      return stepper;
    },
    selectStepper: function selectStepper(pageIndex, selectPanel) {
      var i;
      pageIndex = pageIndex | 0;
      if (selectPanel) {
        this.manager.selectPanel(this);
      }
      for (i = 0; i < steppers.length; ++i) {
        var stepper = steppers[i];
        if (stepper.pageIndex === pageIndex) {
          stepper.panel.removeAttribute('hidden');
        } else {
          stepper.panel.setAttribute('hidden', true);
        }
      }
      var options = stepperChooser.options;
      for (i = 0; i < options.length; ++i) {
        var option = options[i];
        option.selected = (option.value | 0) === pageIndex;
      }
    },
    saveBreakPoints: function saveBreakPoints(pageIndex, bps) {
      breakPoints[pageIndex] = bps;
      sessionStorage.setItem('pdfjsBreakPoints', JSON.stringify(breakPoints));
    }
  };
})();

// The stepper for each page's IRQueue.
var Stepper = (function StepperClosure() {
  // Shorter way to create element and optionally set textContent.
  function c(tag, textContent) {
    var d = document.createElement(tag);
    if (textContent) {
      d.textContent = textContent;
    }
    return d;
  }

  var opMap = null;

  function simplifyArgs(args) {
    if (typeof args === 'string') {
      var MAX_STRING_LENGTH = 75;
      return args.length <= MAX_STRING_LENGTH ? args :
        args.substr(0, MAX_STRING_LENGTH) + '...';
    }
    if (typeof args !== 'object' || args === null) {
      return args;
    }
    if ('length' in args) { // array
      var simpleArgs = [], i, ii;
      var MAX_ITEMS = 10;
      for (i = 0, ii = Math.min(MAX_ITEMS, args.length); i < ii; i++) {
        simpleArgs.push(simplifyArgs(args[i]));
      }
      if (i < args.length) {
        simpleArgs.push('...');
      }
      return simpleArgs;
    }
    var simpleObj = {};
    for (var key in args) {
      simpleObj[key] = simplifyArgs(args[key]);
    }
    return simpleObj;
  }

  function Stepper(panel, pageIndex, initialBreakPoints) {
    this.panel = panel;
    this.breakPoint = 0;
    this.nextBreakPoint = null;
    this.pageIndex = pageIndex;
    this.breakPoints = initialBreakPoints;
    this.currentIdx = -1;
    this.operatorListIdx = 0;
  }
  Stepper.prototype = {
    init: function init(pdfjsLib) {
      var panel = this.panel;
      var content = c('div', 'c=continue, s=step');
      var table = c('table');
      content.appendChild(table);
      table.cellSpacing = 0;
      var headerRow = c('tr');
      table.appendChild(headerRow);
      headerRow.appendChild(c('th', 'Break'));
      headerRow.appendChild(c('th', 'Idx'));
      headerRow.appendChild(c('th', 'fn'));
      headerRow.appendChild(c('th', 'args'));
      panel.appendChild(content);
      this.table = table;
      if (!opMap) {
        opMap = Object.create(null);
        for (var key in pdfjsLib.OPS) {
          opMap[pdfjsLib.OPS[key]] = key;
        }
      }
    },
    updateOperatorList: function updateOperatorList(operatorList) {
      var self = this;

      function cboxOnClick() {
        var x = +this.dataset.idx;
        if (this.checked) {
          self.breakPoints.push(x);
        } else {
          self.breakPoints.splice(self.breakPoints.indexOf(x), 1);
        }
        StepperManager.saveBreakPoints(self.pageIndex, self.breakPoints);
      }

      var MAX_OPERATORS_COUNT = 15000;
      if (this.operatorListIdx > MAX_OPERATORS_COUNT) {
        return;
      }

      var chunk = document.createDocumentFragment();
      var operatorsToDisplay = Math.min(MAX_OPERATORS_COUNT,
                                        operatorList.fnArray.length);
      for (var i = this.operatorListIdx; i < operatorsToDisplay; i++) {
        var line = c('tr');
        line.className = 'line';
        line.dataset.idx = i;
        chunk.appendChild(line);
        var checked = this.breakPoints.indexOf(i) !== -1;
        var args = operatorList.argsArray[i] || [];

        var breakCell = c('td');
        var cbox = c('input');
        cbox.type = 'checkbox';
        cbox.className = 'points';
        cbox.checked = checked;
        cbox.dataset.idx = i;
        cbox.onclick = cboxOnClick;

        breakCell.appendChild(cbox);
        line.appendChild(breakCell);
        line.appendChild(c('td', i.toString()));
        var fn = opMap[operatorList.fnArray[i]];
        var decArgs = args;
        if (fn === 'showText') {
          var glyphs = args[0];
          var newArgs = [];
          var str = [];
          for (var j = 0; j < glyphs.length; j++) {
            var glyph = glyphs[j];
            if (typeof glyph === 'object' && glyph !== null) {
              str.push(glyph.fontChar);
            } else {
              if (str.length > 0) {
                newArgs.push(str.join(''));
                str = [];
              }
              newArgs.push(glyph); // null or number
            }
          }
          if (str.length > 0) {
            newArgs.push(str.join(''));
          }
          decArgs = [newArgs];
        }
        line.appendChild(c('td', fn));
        line.appendChild(c('td', JSON.stringify(simplifyArgs(decArgs))));
      }
      if (operatorsToDisplay < operatorList.fnArray.length) {
        line = c('tr');
        var lastCell = c('td', '...');
        lastCell.colspan = 4;
        chunk.appendChild(lastCell);
      }
      this.operatorListIdx = operatorList.fnArray.length;
      this.table.appendChild(chunk);
    },
    getNextBreakPoint: function getNextBreakPoint() {
      this.breakPoints.sort(function(a, b) { return a - b; });
      for (var i = 0; i < this.breakPoints.length; i++) {
        if (this.breakPoints[i] > this.currentIdx) {
          return this.breakPoints[i];
        }
      }
      return null;
    },
    breakIt: function breakIt(idx, callback) {
      StepperManager.selectStepper(this.pageIndex, true);
      var self = this;
      var dom = document;
      self.currentIdx = idx;
      var listener = function(e) {
        switch (e.keyCode) {
          case 83: // step
            dom.removeEventListener('keydown', listener, false);
            self.nextBreakPoint = self.currentIdx + 1;
            self.goTo(-1);
            callback();
            break;
          case 67: // continue
            dom.removeEventListener('keydown', listener, false);
            var breakPoint = self.getNextBreakPoint();
            self.nextBreakPoint = breakPoint;
            self.goTo(-1);
            callback();
            break;
        }
      };
      dom.addEventListener('keydown', listener, false);
      self.goTo(idx);
    },
    goTo: function goTo(idx) {
      var allRows = this.panel.getElementsByClassName('line');
      for (var x = 0, xx = allRows.length; x < xx; ++x) {
        var row = allRows[x];
        if ((row.dataset.idx | 0) === idx) {
          row.style.backgroundColor = 'rgb(251,250,207)';
          row.scrollIntoView();
        } else {
          row.style.backgroundColor = null;
        }
      }
    }
  };
  return Stepper;
})();

var Stats = (function Stats() {
  var stats = [];
  function clear(node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }
  function getStatIndex(pageNumber) {
    for (var i = 0, ii = stats.length; i < ii; ++i) {
      if (stats[i].pageNumber === pageNumber) {
        return i;
      }
    }
    return false;
  }
  return {
    // Properties/functions needed by PDFBug.
    id: 'Stats',
    name: 'Stats',
    panel: null,
    manager: null,
    init: function init(pdfjsLib) {
      this.panel.setAttribute('style', 'padding: 5px;');
      pdfjsLib.PDFJS.enableStats = true;
    },
    enabled: false,
    active: false,
    // Stats specific functions.
    add: function(pageNumber, stat) {
      if (!stat) {
        return;
      }
      var statsIndex = getStatIndex(pageNumber);
      if (statsIndex !== false) {
        var b = stats[statsIndex];
        this.panel.removeChild(b.div);
        stats.splice(statsIndex, 1);
      }
      var wrapper = document.createElement('div');
      wrapper.className = 'stats';
      var title = document.createElement('div');
      title.className = 'title';
      title.textContent = 'Page: ' + pageNumber;
      var statsDiv = document.createElement('div');
      statsDiv.textContent = stat.toString();
      wrapper.appendChild(title);
      wrapper.appendChild(statsDiv);
      stats.push({ pageNumber: pageNumber, div: wrapper });
      stats.sort(function(a, b) { return a.pageNumber - b.pageNumber; });
      clear(this.panel);
      for (var i = 0, ii = stats.length; i < ii; ++i) {
        this.panel.appendChild(stats[i].div);
      }
    },
    cleanup: function () {
      stats = [];
      clear(this.panel);
    }
  };
})();

// Manages all the debugging tools.
var PDFBug = (function PDFBugClosure() {
  var panelWidth = 300;
  var buttons = [];
  var activePanel = null;

  return {
    tools: [
      FontInspector,
      StepperManager,
      Stats
    ],
    enable: function(ids) {
      var all = false, tools = this.tools;
      if (ids.length === 1 && ids[0] === 'all') {
        all = true;
      }
      for (var i = 0; i < tools.length; ++i) {
        var tool = tools[i];
        if (all || ids.indexOf(tool.id) !== -1) {
          tool.enabled = true;
        }
      }
      if (!all) {
        // Sort the tools by the order they are enabled.
        tools.sort(function(a, b) {
          var indexA = ids.indexOf(a.id);
          indexA = indexA < 0 ? tools.length : indexA;
          var indexB = ids.indexOf(b.id);
          indexB = indexB < 0 ? tools.length : indexB;
          return indexA - indexB;
        });
      }
    },
    init: function init(pdfjsLib) {
      /*
       * Basic Layout:
       * PDFBug
       *  Controls
       *  Panels
       *    Panel
       *    Panel
       *    ...
       */
      var ui = document.createElement('div');
      ui.id = 'PDFBug';

      var controls = document.createElement('div');
      controls.setAttribute('class', 'controls');
      ui.appendChild(controls);

      var panels = document.createElement('div');
      panels.setAttribute('class', 'panels');
      ui.appendChild(panels);

      var container = document.getElementById('viewerContainer');
      container.appendChild(ui);
      container.style.right = panelWidth + 'px';

      // Initialize all the debugging tools.
      var tools = this.tools;
      var self = this;
      for (var i = 0; i < tools.length; ++i) {
        var tool = tools[i];
        var panel = document.createElement('div');
        var panelButton = document.createElement('button');
        panelButton.textContent = tool.name;
        panelButton.addEventListener('click', (function(selected) {
          return function(event) {
            event.preventDefault();
            self.selectPanel(selected);
          };
        })(i));
        controls.appendChild(panelButton);
        panels.appendChild(panel);
        tool.panel = panel;
        tool.manager = this;
        if (tool.enabled) {
          tool.init(pdfjsLib);
        } else {
          panel.textContent = tool.name + ' is disabled. To enable add ' +
                              ' "' + tool.id + '" to the pdfBug parameter ' +
                              'and refresh (seperate multiple by commas).';
        }
        buttons.push(panelButton);
      }
      this.selectPanel(0);
    },
    cleanup: function cleanup() {
      for (var i = 0, ii = this.tools.length; i < ii; i++) {
        if (this.tools[i].enabled) {
          this.tools[i].cleanup();
        }
      }
    },
    selectPanel: function selectPanel(index) {
      if (typeof index !== 'number') {
        index = this.tools.indexOf(index);
      }
      if (index === activePanel) {
        return;
      }
      activePanel = index;
      var tools = this.tools;
      for (var j = 0; j < tools.length; ++j) {
        if (j === index) {
          buttons[j].setAttribute('class', 'active');
          tools[j].active = true;
          tools[j].panel.removeAttribute('hidden');
        } else {
          buttons[j].setAttribute('class', '');
          tools[j].active = false;
          tools[j].panel.setAttribute('hidden', 'true');
        }
      }
    }
  };
})();
;/**
 * Copyright (c) 2011-2013 Fabien Cazenave, Mozilla.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
/*
  Additional modifications for PDF.js project:
    - Disables language initialization on page loading;
    - Removes consoleWarn and consoleLog and use console.log/warn directly.
    - Removes window._ assignment.
    - Remove compatibility code for OldIE.
*/

/*jshint browser: true, devel: true, es5: true, globalstrict: true */
'use strict';

document.webL10n = (function(window, document, undefined) {
  var gL10nData = {};
  var gTextData = '';
  var gTextProp = 'textContent';
  var gLanguage = '';
  var gMacros = {};
  var gReadyState = 'loading';


  /**
   * Synchronously loading l10n resources significantly minimizes flickering
   * from displaying the app with non-localized strings and then updating the
   * strings. Although this will block all script execution on this page, we
   * expect that the l10n resources are available locally on flash-storage.
   *
   * As synchronous XHR is generally considered as a bad idea, we're still
   * loading l10n resources asynchronously -- but we keep this in a setting,
   * just in case... and applications using this library should hide their
   * content until the `localized' event happens.
   */

  var gAsyncResourceLoading = true; // read-only


  /**
   * DOM helpers for the so-called "HTML API".
   *
   * These functions are written for modern browsers. For old versions of IE,
   * they're overridden in the 'startup' section at the end of this file.
   */

  function getL10nResourceLinks() {
    return document.querySelectorAll('link[type="application/l10n"]');
  }

  function getL10nDictionary() {
    var script = document.querySelector('script[type="application/l10n"]');
    // TODO: support multiple and external JSON dictionaries
    return script ? JSON.parse(script.innerHTML) : null;
  }

  function getTranslatableChildren(element) {
    return element ? element.querySelectorAll('*[data-l10n-id]') : [];
  }

  function getL10nAttributes(element) {
    if (!element)
      return {};

    var l10nId = element.getAttribute('data-l10n-id');
    var l10nArgs = element.getAttribute('data-l10n-args');
    var args = {};
    if (l10nArgs) {
      try {
        args = JSON.parse(l10nArgs);
      } catch (e) {
        console.warn('could not parse arguments for #' + l10nId);
      }
    }
    return { id: l10nId, args: args };
  }

  function fireL10nReadyEvent(lang) {
    var evtObject = document.createEvent('Event');
    evtObject.initEvent('localized', true, false);
    evtObject.language = lang;
    document.dispatchEvent(evtObject);
  }

  function xhrLoadText(url, onSuccess, onFailure) {
    onSuccess = onSuccess || function _onSuccess(data) {};
    onFailure = onFailure || function _onFailure() {
      console.warn(url + ' not found.');
    };

	//if url is local file, use FileAPi function.
	if(url.substring(0,4) == "file") {
		var reader,content;
		var filename = url.substring(8);
		var pro =	window.location.protocol;
		
		try
		{
			var htmlpath = window.location.href.substring(8);
			var filedir = htmlpath.substring(0, htmlpath.lastIndexOf('/'));
			filedir += '/locale/zh-CN/viewer.properties';
			var decodedir = decodeURI(filedir);
			//var sigFileLen = pdfsealObj.GetLocalFile(decodedir, 1);
			var array = new Array(0);
			var sigFileLen = pdfsealObj.GetLocalFileArray(decodedir, 1, array);
			if(sigFileLen)
			{
				var sigfileBuf = pdfsealObj.GetFileBuffer();
				onSuccess(sigfileBuf);
			}
		
			/*var fso = new ActiveXObject("Scripting.FileSystemObject");
			var f = fso.OpenTextFile(filename) ;
			content = f.ReadAll();
			f.Close();
	
			onSuccess(content);*/
		} catch (err) {
			onFailure();;
		}
		
	} else {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, gAsyncResourceLoading);
		if (xhr.overrideMimeType) {
		  xhr.overrideMimeType('text/plain; charset=utf-8');
		}
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
			if (xhr.status == 200 || xhr.status === 0) {
			  onSuccess(xhr.responseText);
			} else {
			  onFailure();
			}
		  }
		};
		xhr.onerror = onFailure;
		xhr.ontimeout = onFailure;

		// in Firefox OS with the app:// protocol, trying to XHR a non-existing
		// URL will raise an exception here -- hence this ugly try...catch.
		try {
		  xhr.send(null);
		} catch (e) {
		  onFailure();
		}
	}
  }


  /**
   * l10n resource parser:
   *  - reads (async XHR) the l10n resource matching `lang';
   *  - imports linked resources (synchronously) when specified;
   *  - parses the text data (fills `gL10nData' and `gTextData');
   *  - triggers success/failure callbacks when done.
   *
   * @param {string} href
   *    URL of the l10n resource to parse.
   *
   * @param {string} lang
   *    locale (language) to parse. Must be a lowercase string.
   *
   * @param {Function} successCallback
   *    triggered when the l10n resource has been successully parsed.
   *
   * @param {Function} failureCallback
   *    triggered when the an error has occured.
   *
   * @return {void}
   *    uses the following global variables: gL10nData, gTextData, gTextProp.
   */

  function parseResource(href, lang, successCallback, failureCallback) {
    var baseURL = href.replace(/[^\/]*$/, '') || './';

    // handle escaped characters (backslashes) in a string
    function evalString(text) {
      if (text.lastIndexOf('\\') < 0)
        return text;
      return text.replace(/\\\\/g, '\\')
                 .replace(/\\n/g, '\n')
                 .replace(/\\r/g, '\r')
                 .replace(/\\t/g, '\t')
                 .replace(/\\b/g, '\b')
                 .replace(/\\f/g, '\f')
                 .replace(/\\{/g, '{')
                 .replace(/\\}/g, '}')
                 .replace(/\\"/g, '"')
                 .replace(/\\'/g, "'");
    }

    // parse *.properties text data into an l10n dictionary
    // If gAsyncResourceLoading is false, then the callback will be called
    // synchronously. Otherwise it is called asynchronously.
    function parseProperties(text, parsedPropertiesCallback) {
      var dictionary = {};

      // token expressions
      var reBlank = /^\s*|\s*$/;
      var reComment = /^\s*#|^\s*$/;
      var reSection = /^\s*\[(.*)\]\s*$/;
      var reImport = /^\s*@import\s+url\((.*)\)\s*$/i;
      var reSplit = /^([^=\s]*)\s*=\s*(.+)$/; // TODO: escape EOLs with '\'

      // parse the *.properties file into an associative array
      function parseRawLines(rawText, extendedSyntax, parsedRawLinesCallback) {
        var entries = rawText.replace(reBlank, '').split(/[\r\n]+/);
        var currentLang = '*';
        var genericLang = lang.split('-', 1)[0];
        var skipLang = false;
        var match = '';

        function nextEntry() {
          // Use infinite loop instead of recursion to avoid reaching the
          // maximum recursion limit for content with many lines.
          while (true) {
            if (!entries.length) {
              parsedRawLinesCallback();
              return;
            }
            var line = entries.shift();

            // comment or blank line?
            if (reComment.test(line))
              continue;

            // the extended syntax supports [lang] sections and @import rules
            if (extendedSyntax) {
              match = reSection.exec(line);
              if (match) { // section start?
                // RFC 4646, section 4.4, "All comparisons MUST be performed
                // in a case-insensitive manner."

                currentLang = match[1].toLowerCase();
                skipLang = (currentLang !== '*') &&
                    (currentLang !== lang) && (currentLang !== genericLang);
                continue;
              } else if (skipLang) {
                continue;
              }
              match = reImport.exec(line);
              if (match) { // @import rule?
                loadImport(baseURL + match[1], nextEntry);
                return;
              }
            }

            // key-value pair
            var tmp = line.match(reSplit);
            if (tmp && tmp.length == 3) {
              dictionary[tmp[1]] = evalString(tmp[2]);
            }
          }
        }
        nextEntry();
      }

      // import another *.properties file
      function loadImport(url, callback) {
        xhrLoadText(url, function(content) {
          parseRawLines(content, false, callback); // don't allow recursive imports
        }, null);
      }

      // fill the dictionary
      parseRawLines(text, true, function() {
        parsedPropertiesCallback(dictionary);
      });
    }

    // load and parse l10n data (warning: global variables are used here)
    xhrLoadText(href, function(response) {
      gTextData += response; // mostly for debug

      // parse *.properties text data into an l10n dictionary
      parseProperties(response, function(data) {

        // find attribute descriptions, if any
        for (var key in data) {
          var id, prop, index = key.lastIndexOf('.');
          if (index > 0) { // an attribute has been specified
            id = key.substring(0, index);
            prop = key.substr(index + 1);
          } else { // no attribute: assuming text content by default
            id = key;
            prop = gTextProp;
          }
          if (!gL10nData[id]) {
            gL10nData[id] = {};
          }
          gL10nData[id][prop] = data[key];
        }

        // trigger callback
        if (successCallback) {
          successCallback();
        }
      });
    }, failureCallback);
  }

  // load and parse all resources for the specified locale
  function loadLocale(lang, callback) {
    // RFC 4646, section 2.1 states that language tags have to be treated as
    // case-insensitive. Convert to lowercase for case-insensitive comparisons.
    if (lang) {
      lang = lang.toLowerCase();
    }

    callback = callback || function _callback() {};

    clear();
    gLanguage = lang;

    // check all <link type="application/l10n" href="..." /> nodes
    // and load the resource files
    var langLinks = getL10nResourceLinks();
    var langCount = langLinks.length;
    if (langCount === 0) {
      // we might have a pre-compiled dictionary instead
      var dict = getL10nDictionary();
      if (dict && dict.locales && dict.default_locale) {
        console.log('using the embedded JSON directory, early way out');
        gL10nData = dict.locales[lang];
        if (!gL10nData) {
          var defaultLocale = dict.default_locale.toLowerCase();
          for (var anyCaseLang in dict.locales) {
            anyCaseLang = anyCaseLang.toLowerCase();
            if (anyCaseLang === lang) {
              gL10nData = dict.locales[lang];
              break;
            } else if (anyCaseLang === defaultLocale) {
              gL10nData = dict.locales[defaultLocale];
            }
          }
        }
        callback();
      } else {
        console.log('no resource to load, early way out');
      }
      // early way out
      fireL10nReadyEvent(lang);
      gReadyState = 'complete';
      return;
    }

    // start the callback when all resources are loaded
    var onResourceLoaded = null;
    var gResourceCount = 0;
    onResourceLoaded = function() {
      gResourceCount++;
      if (gResourceCount >= langCount) {
        callback();
        fireL10nReadyEvent(lang);
        gReadyState = 'complete';
      }
    };

    // load all resource files
    function L10nResourceLink(link) {
      var href = link.href;
      // Note: If |gAsyncResourceLoading| is false, then the following callbacks
      // are synchronously called.
      this.load = function(lang, callback) {
        parseResource(href, lang, callback, function() {
          console.warn(href + ' not found.');
          // lang not found, used default resource instead
          console.warn('"' + lang + '" resource not found');
          gLanguage = '';
          // Resource not loaded, but we still need to call the callback.
          callback();
        });
      };
    }

    for (var i = 0; i < langCount; i++) {
      var resource = new L10nResourceLink(langLinks[i]);
      resource.load(lang, onResourceLoaded);
    }
  }

  // clear all l10n data
  function clear() {
    gL10nData = {};
    gTextData = '';
    gLanguage = '';
    // TODO: clear all non predefined macros.
    // There's no such macro /yet/ but we're planning to have some...
  }


  /**
   * Get rules for plural forms (shared with JetPack), see:
   * http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
   * https://github.com/mozilla/addon-sdk/blob/master/python-lib/plural-rules-generator.p
   *
   * @param {string} lang
   *    locale (language) used.
   *
   * @return {Function}
   *    returns a function that gives the plural form name for a given integer:
   *       var fun = getPluralRules('en');
   *       fun(1)    -> 'one'
   *       fun(0)    -> 'other'
   *       fun(1000) -> 'other'.
   */

  function getPluralRules(lang) {
    var locales2rules = {
      'af': 3,
      'ak': 4,
      'am': 4,
      'ar': 1,
      'asa': 3,
      'az': 0,
      'be': 11,
      'bem': 3,
      'bez': 3,
      'bg': 3,
      'bh': 4,
      'bm': 0,
      'bn': 3,
      'bo': 0,
      'br': 20,
      'brx': 3,
      'bs': 11,
      'ca': 3,
      'cgg': 3,
      'chr': 3,
      'cs': 12,
      'cy': 17,
      'da': 3,
      'de': 3,
      'dv': 3,
      'dz': 0,
      'ee': 3,
      'el': 3,
      'en': 3,
      'eo': 3,
      'es': 3,
      'et': 3,
      'eu': 3,
      'fa': 0,
      'ff': 5,
      'fi': 3,
      'fil': 4,
      'fo': 3,
      'fr': 5,
      'fur': 3,
      'fy': 3,
      'ga': 8,
      'gd': 24,
      'gl': 3,
      'gsw': 3,
      'gu': 3,
      'guw': 4,
      'gv': 23,
      'ha': 3,
      'haw': 3,
      'he': 2,
      'hi': 4,
      'hr': 11,
      'hu': 0,
      'id': 0,
      'ig': 0,
      'ii': 0,
      'is': 3,
      'it': 3,
      'iu': 7,
      'ja': 0,
      'jmc': 3,
      'jv': 0,
      'ka': 0,
      'kab': 5,
      'kaj': 3,
      'kcg': 3,
      'kde': 0,
      'kea': 0,
      'kk': 3,
      'kl': 3,
      'km': 0,
      'kn': 0,
      'ko': 0,
      'ksb': 3,
      'ksh': 21,
      'ku': 3,
      'kw': 7,
      'lag': 18,
      'lb': 3,
      'lg': 3,
      'ln': 4,
      'lo': 0,
      'lt': 10,
      'lv': 6,
      'mas': 3,
      'mg': 4,
      'mk': 16,
      'ml': 3,
      'mn': 3,
      'mo': 9,
      'mr': 3,
      'ms': 0,
      'mt': 15,
      'my': 0,
      'nah': 3,
      'naq': 7,
      'nb': 3,
      'nd': 3,
      'ne': 3,
      'nl': 3,
      'nn': 3,
      'no': 3,
      'nr': 3,
      'nso': 4,
      'ny': 3,
      'nyn': 3,
      'om': 3,
      'or': 3,
      'pa': 3,
      'pap': 3,
      'pl': 13,
      'ps': 3,
      'pt': 3,
      'rm': 3,
      'ro': 9,
      'rof': 3,
      'ru': 11,
      'rwk': 3,
      'sah': 0,
      'saq': 3,
      'se': 7,
      'seh': 3,
      'ses': 0,
      'sg': 0,
      'sh': 11,
      'shi': 19,
      'sk': 12,
      'sl': 14,
      'sma': 7,
      'smi': 7,
      'smj': 7,
      'smn': 7,
      'sms': 7,
      'sn': 3,
      'so': 3,
      'sq': 3,
      'sr': 11,
      'ss': 3,
      'ssy': 3,
      'st': 3,
      'sv': 3,
      'sw': 3,
      'syr': 3,
      'ta': 3,
      'te': 3,
      'teo': 3,
      'th': 0,
      'ti': 4,
      'tig': 3,
      'tk': 3,
      'tl': 4,
      'tn': 3,
      'to': 0,
      'tr': 0,
      'ts': 3,
      'tzm': 22,
      'uk': 11,
      'ur': 3,
      've': 3,
      'vi': 0,
      'vun': 3,
      'wa': 4,
      'wae': 3,
      'wo': 0,
      'xh': 3,
      'xog': 3,
      'yo': 0,
      'zh': 0,
      'zu': 3
    };

    // utility functions for plural rules methods
    function isIn(n, list) {
      return list.indexOf(n) !== -1;
    }
    function isBetween(n, start, end) {
      return start <= n && n <= end;
    }

    // list of all plural rules methods:
    // map an integer to the plural form name to use
    var pluralRules = {
      '0': function(n) {
        return 'other';
      },
      '1': function(n) {
        if ((isBetween((n % 100), 3, 10)))
          return 'few';
        if (n === 0)
          return 'zero';
        if ((isBetween((n % 100), 11, 99)))
          return 'many';
        if (n == 2)
          return 'two';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '2': function(n) {
        if (n !== 0 && (n % 10) === 0)
          return 'many';
        if (n == 2)
          return 'two';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '3': function(n) {
        if (n == 1)
          return 'one';
        return 'other';
      },
      '4': function(n) {
        if ((isBetween(n, 0, 1)))
          return 'one';
        return 'other';
      },
      '5': function(n) {
        if ((isBetween(n, 0, 2)) && n != 2)
          return 'one';
        return 'other';
      },
      '6': function(n) {
        if (n === 0)
          return 'zero';
        if ((n % 10) == 1 && (n % 100) != 11)
          return 'one';
        return 'other';
      },
      '7': function(n) {
        if (n == 2)
          return 'two';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '8': function(n) {
        if ((isBetween(n, 3, 6)))
          return 'few';
        if ((isBetween(n, 7, 10)))
          return 'many';
        if (n == 2)
          return 'two';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '9': function(n) {
        if (n === 0 || n != 1 && (isBetween((n % 100), 1, 19)))
          return 'few';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '10': function(n) {
        if ((isBetween((n % 10), 2, 9)) && !(isBetween((n % 100), 11, 19)))
          return 'few';
        if ((n % 10) == 1 && !(isBetween((n % 100), 11, 19)))
          return 'one';
        return 'other';
      },
      '11': function(n) {
        if ((isBetween((n % 10), 2, 4)) && !(isBetween((n % 100), 12, 14)))
          return 'few';
        if ((n % 10) === 0 ||
            (isBetween((n % 10), 5, 9)) ||
            (isBetween((n % 100), 11, 14)))
          return 'many';
        if ((n % 10) == 1 && (n % 100) != 11)
          return 'one';
        return 'other';
      },
      '12': function(n) {
        if ((isBetween(n, 2, 4)))
          return 'few';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '13': function(n) {
        if ((isBetween((n % 10), 2, 4)) && !(isBetween((n % 100), 12, 14)))
          return 'few';
        if (n != 1 && (isBetween((n % 10), 0, 1)) ||
            (isBetween((n % 10), 5, 9)) ||
            (isBetween((n % 100), 12, 14)))
          return 'many';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '14': function(n) {
        if ((isBetween((n % 100), 3, 4)))
          return 'few';
        if ((n % 100) == 2)
          return 'two';
        if ((n % 100) == 1)
          return 'one';
        return 'other';
      },
      '15': function(n) {
        if (n === 0 || (isBetween((n % 100), 2, 10)))
          return 'few';
        if ((isBetween((n % 100), 11, 19)))
          return 'many';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '16': function(n) {
        if ((n % 10) == 1 && n != 11)
          return 'one';
        return 'other';
      },
      '17': function(n) {
        if (n == 3)
          return 'few';
        if (n === 0)
          return 'zero';
        if (n == 6)
          return 'many';
        if (n == 2)
          return 'two';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '18': function(n) {
        if (n === 0)
          return 'zero';
        if ((isBetween(n, 0, 2)) && n !== 0 && n != 2)
          return 'one';
        return 'other';
      },
      '19': function(n) {
        if ((isBetween(n, 2, 10)))
          return 'few';
        if ((isBetween(n, 0, 1)))
          return 'one';
        return 'other';
      },
      '20': function(n) {
        if ((isBetween((n % 10), 3, 4) || ((n % 10) == 9)) && !(
            isBetween((n % 100), 10, 19) ||
            isBetween((n % 100), 70, 79) ||
            isBetween((n % 100), 90, 99)
            ))
          return 'few';
        if ((n % 1000000) === 0 && n !== 0)
          return 'many';
        if ((n % 10) == 2 && !isIn((n % 100), [12, 72, 92]))
          return 'two';
        if ((n % 10) == 1 && !isIn((n % 100), [11, 71, 91]))
          return 'one';
        return 'other';
      },
      '21': function(n) {
        if (n === 0)
          return 'zero';
        if (n == 1)
          return 'one';
        return 'other';
      },
      '22': function(n) {
        if ((isBetween(n, 0, 1)) || (isBetween(n, 11, 99)))
          return 'one';
        return 'other';
      },
      '23': function(n) {
        if ((isBetween((n % 10), 1, 2)) || (n % 20) === 0)
          return 'one';
        return 'other';
      },
      '24': function(n) {
        if ((isBetween(n, 3, 10) || isBetween(n, 13, 19)))
          return 'few';
        if (isIn(n, [2, 12]))
          return 'two';
        if (isIn(n, [1, 11]))
          return 'one';
        return 'other';
      }
    };

    // return a function that gives the plural form name for a given integer
    var index = locales2rules[lang.replace(/-.*$/, '')];
    if (!(index in pluralRules)) {
      console.warn('plural form unknown for [' + lang + ']');
      return function() { return 'other'; };
    }
    return pluralRules[index];
  }

  // pre-defined 'plural' macro
  gMacros.plural = function(str, param, key, prop) {
    var n = parseFloat(param);
    if (isNaN(n))
      return str;

    // TODO: support other properties (l20n still doesn't...)
    if (prop != gTextProp)
      return str;

    // initialize _pluralRules
    if (!gMacros._pluralRules) {
      gMacros._pluralRules = getPluralRules(gLanguage);
    }
    var index = '[' + gMacros._pluralRules(n) + ']';

    // try to find a [zero|one|two] key if it's defined
    if (n === 0 && (key + '[zero]') in gL10nData) {
      str = gL10nData[key + '[zero]'][prop];
    } else if (n == 1 && (key + '[one]') in gL10nData) {
      str = gL10nData[key + '[one]'][prop];
    } else if (n == 2 && (key + '[two]') in gL10nData) {
      str = gL10nData[key + '[two]'][prop];
    } else if ((key + index) in gL10nData) {
      str = gL10nData[key + index][prop];
    } else if ((key + '[other]') in gL10nData) {
      str = gL10nData[key + '[other]'][prop];
    }

    return str;
  };


  /**
   * l10n dictionary functions
   */

  // fetch an l10n object, warn if not found, apply `args' if possible
  function getL10nData(key, args, fallback) {
    var data = gL10nData[key];
    if (!data) {
      console.warn('#' + key + ' is undefined.');
      if (!fallback) {
        return null;
      }
      data = fallback;
    }

    /** This is where l10n expressions should be processed.
      * The plan is to support C-style expressions from the l20n project;
      * until then, only two kinds of simple expressions are supported:
      *   {[ index ]} and {{ arguments }}.
      */
    var rv = {};
    for (var prop in data) {
      var str = data[prop];
      str = substIndexes(str, args, key, prop);
      str = substArguments(str, args, key);
      rv[prop] = str;
    }
    return rv;
  }

  // replace {[macros]} with their values
  function substIndexes(str, args, key, prop) {
    var reIndex = /\{\[\s*([a-zA-Z]+)\(([a-zA-Z]+)\)\s*\]\}/;
    var reMatch = reIndex.exec(str);
    if (!reMatch || !reMatch.length)
      return str;

    // an index/macro has been found
    // Note: at the moment, only one parameter is supported
    var macroName = reMatch[1];
    var paramName = reMatch[2];
    var param;
    if (args && paramName in args) {
      param = args[paramName];
    } else if (paramName in gL10nData) {
      param = gL10nData[paramName];
    }

    // there's no macro parser yet: it has to be defined in gMacros
    if (macroName in gMacros) {
      var macro = gMacros[macroName];
      str = macro(str, param, key, prop);
    }
    return str;
  }

  // replace {{arguments}} with their values
  function substArguments(str, args, key) {
    var reArgs = /\{\{\s*(.+?)\s*\}\}/g;
    return str.replace(reArgs, function(matched_text, arg) {
      if (args && arg in args) {
        return args[arg];
      }
      if (arg in gL10nData) {
        return gL10nData[arg];
      }
      console.log('argument {{' + arg + '}} for #' + key + ' is undefined.');
      return matched_text;
    });
  }

  // translate an HTML element
  function translateElement(element) {
    var l10n = getL10nAttributes(element);
    if (!l10n.id)
      return;

    // get the related l10n object
    var data = getL10nData(l10n.id, l10n.args);
    if (!data) {
      console.warn('#' + l10n.id + ' is undefined.');
      return;
    }

    // translate element (TODO: security checks?)
    if (data[gTextProp]) { // XXX
      if (getChildElementCount(element) === 0) {
        element[gTextProp] = data[gTextProp];
      } else {
        // this element has element children: replace the content of the first
        // (non-empty) child textNode and clear other child textNodes
        var children = element.childNodes;
        var found = false;
        for (var i = 0, l = children.length; i < l; i++) {
          if (children[i].nodeType === 3 && /\S/.test(children[i].nodeValue)) {
            if (found) {
              children[i].nodeValue = '';
            } else {
              children[i].nodeValue = data[gTextProp];
              found = true;
            }
          }
        }
        // if no (non-empty) textNode is found, insert a textNode before the
        // first element child.
        if (!found) {
          var textNode = document.createTextNode(data[gTextProp]);
          element.insertBefore(textNode, element.firstChild);
        }
      }
      delete data[gTextProp];
    }

    for (var k in data) {
      element[k] = data[k];
    }
  }

  // webkit browsers don't currently support 'children' on SVG elements...
  function getChildElementCount(element) {
    if (element.children) {
      return element.children.length;
    }
    if (typeof element.childElementCount !== 'undefined') {
      return element.childElementCount;
    }
    var count = 0;
    for (var i = 0; i < element.childNodes.length; i++) {
      count += element.nodeType === 1 ? 1 : 0;
    }
    return count;
  }

  // translate an HTML subtree
  function translateFragment(element) {
    element = element || document.documentElement;

    // check all translatable children (= w/ a `data-l10n-id' attribute)
    var children = getTranslatableChildren(element);
    var elementCount = children.length;
    for (var i = 0; i < elementCount; i++) {
      translateElement(children[i]);
    }

    // translate element itself if necessary
    translateElement(element);
  }

  return {
    // get a localized string
    get: function(key, args, fallbackString) {
      var index = key.lastIndexOf('.');
      var prop = gTextProp;
      if (index > 0) { // An attribute has been specified
        prop = key.substr(index + 1);
        key = key.substring(0, index);
      }
      var fallback;
      if (fallbackString) {
        fallback = {};
        fallback[prop] = fallbackString;
      }
      var data = getL10nData(key, args, fallback);
      if (data && prop in data) {
        return data[prop];
      }
      return '{{' + key + '}}';
    },

    // debug
    getData: function() { return gL10nData; },
    getText: function() { return gTextData; },

    // get|set the document language
    getLanguage: function() { return gLanguage; },
    setLanguage: function(lang, callback) {
      loadLocale(lang, function() {
        if (callback)
          callback();
        translateFragment();
      });
    },

    // get the direction (ltr|rtl) of the current language
    getDirection: function() {
      // http://www.w3.org/International/questions/qa-scripts
      // Arabic, Hebrew, Farsi, Pashto, Urdu
      var rtlList = ['ar', 'he', 'fa', 'ps', 'ur'];
      var shortCode = gLanguage.split('-', 1)[0];
      return (rtlList.indexOf(shortCode) >= 0) ? 'rtl' : 'ltr';
    },

    // translate an element or document fragment
    translate: translateFragment,

    // this can be used to prevent race conditions
    getReadyState: function() { return gReadyState; },
    ready: function(callback) {
      if (!callback) {
        return;
      } else if (gReadyState == 'complete' || gReadyState == 'interactive') {
        window.setTimeout(function() {
          callback();
        });
      } else if (document.addEventListener) {
        document.addEventListener('localized', function once() {
          document.removeEventListener('localized', once);
          callback();
        });
      }
    }
  };
}) (window, document);
