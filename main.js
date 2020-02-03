var webview = document.getElementById('browser');
var bullet = document.getElementById('drag');
var insert_style = '.window-overlay::-webkit-scrollbar{height:33px;width:33px}.window-overlay::-webkit-scrollbar-thumb{min-height:50px;background:rgba(255,255,255,1);border-radius:17px;border:10px solid transparent;background-clip:padding-box}.window-overlay::-webkit-scrollbar-track-piece{background:rgba(0,0,0,.5);border:10px solid transparent;background-clip:padding-box}.window-overlay::-webkit-scrollbar-track-piece:vertical:start{border-radius:17px 17px 0 0}.window-overlay::-webkit-scrollbar-track-piece:vertical:end{border-radius:0 0 17px 17px}';
var NODE_TLS_REJECT_UNAUTHORIZED = '0'

window.addEventListener('focus', function(e) {
    webview.focus();
});

webview.addEventListener('permissionrequest', function(e) {
    if (e.permission === 'download')
        e.request.allow();
});

chrome.runtime.onMessage.addListener(function(request, sender) {
    if (sender.id == appID) {
        webview.src = request;
    }
});
