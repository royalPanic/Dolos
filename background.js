function createWindow(param) {
    chrome.app.window.create('window.html',{id:'webview'},function(appwindow) {
		appwindow.contentWindow.onload=function() {	
			var userText="";
			window.MutationObserver = window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;
			var target = appwindow.contentWindow.document.getElementById('browser'),
			observer = new MutationObserver(function(mutation) {
				appwindow.contentWindow.document.getElementById('webBar').value=appwindow.contentWindow.document.getElementById('browser').getAttribute("src");
			}),
			config={attributes:true};
			observer.observe(target, config);
			appwindow.contentWindow.document.getElementById('backButton').onclick=function(){
				appwindow.contentWindow.document.getElementById('browser').back();
			}
			appwindow.contentWindow.document.getElementById('forwardButton').onclick=function(){
				appwindow.contentWindow.document.getElementById('browser').forward();
			}
			appwindow.contentWindow.document.getElementById('webBar').onkeypress = function(e){
				e = e || window.event;
				if (e.keyCode == 13)
				{
					userText=appwindow.contentWindow.document.getElementById('webBar').value;
					var fullURL=userText;
					fullURL=fullURL.replace("https://","");
					fullURL=fullURL.replace("http://","");
					fullURL=fullURL.replace("www.","");
					fullURL="https://www."+fullURL;
					appwindow.contentWindow.document.getElementById('browser').setAttribute("src",fullURL);
					return false;
				}
			}
			appwindow.contentWindow.document.getElementById('webBar').onfocus=function(){
				if(appwindow.contentWindow.document.getElementById('webBar').value==appwindow.contentWindow.document.getElementById('browser').getAttribute("src"))
					appwindow.contentWindow.document.getElementById('webBar').select();
			}
			appwindow.contentWindow.document.getElementById('refreshButton').onclick=function() {
				appwindow.contentWindow.document.getElementById('browser').reload();
			}	
			appwindow.contentWindow.document.getElementById('browser').addEventListener('loadabort', function(e){ //loadabort event fires when a page failed to load, will redirect to google search query
				if(e.reason=="ERR_NAME_NOT_RESOLVED"||e.reason=="ERR_INVALID_URL")
				{
					var googleURL="https://www.google.com/#q=";
					var inputData=userText;
					inputData=inputData.split(" ");
					for(var i=0;i<inputData.length;i++)
					{
						googleURL+=inputData[i];
						googleURL+="+"
					}
					googleURL=googleURL.slice(0,googleURL.length-1);
					appwindow.contentWindow.document.getElementById('browser').setAttribute("src",googleURL);
				}
			});
			toggleFullscreen=function () {
				if (appwindow.isFullscreen())
					appwindow.restore();
				 else 
					appwindow.fullscreen();
			};
		};
	});
}

chrome.runtime.onMessageExternal.addListener(function (request, sender) {
    if (typeof request.launch === 'undefined') 
        return;

    if (sender.id === extId || sender.id === devId)
	{
        chrome.storage.local.set({ 'extension': true });
        hasExt = true;
    }

    if (0 === chrome.app.window.getAll().length)
        createWindow(request);
	else 
	{
        var appwindow = chrome.app.window.getAll()[0];
        appwindow.close();
        setTimeout(function () {
            createWindow(request);
        }, 1000);

    }
});

chrome.app.runtime.onLaunched.addListener(function () {
    createWindow({ 'launch': 'empty' });
});

var minimized = false;