// worker.js
self.onmessage = function(e) {
    if (e.data.action === 'toggleVisibility') {
      const showImage = e.data.showImage;
      postMessage({
        action: 'setVisibility',
        showImage: showImage
      });
    }
  };