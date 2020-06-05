/* Written by oxagast.  Edited some things from mycliget to get this to work. */

/*
 * V: 0.0.9 - 3/25/2019
*/

/*
 * clipboard function originated with mozilla webextension examples here:
 * https://github.com/mdn/webextensions-examples
 */
 
 
var quotesOption = false;
var programOption = 'curl';
var fileOption = 'auto';
var verboseOption = false;
var headers = '';
var sqlmapheaders = '';
var snackbarOption = false;
var trigger;


//Right click context adds for links + audio/video
browser.contextMenus.create({
    id: "copy-link-to-clipboard",
    title: "Copy SQLMap command to clipboard",
    contexts: ["link"]
});
browser.contextMenus.create({
    id: "copy-media-to-clipboard",
    title: "Copy SQLMap command to clipboard",
    contexts: ['video', 'audio']
});

//basic promisified xmlhttpreq, will be stopped at building the request
let ajaxGet = (obj) => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.timeout = 5000;
        xhr.open(obj.method || "GET", obj.url);
        if (obj.headers) {
            Object.keys(obj.headers).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        xhr.send(obj.body || '');
        resolve(true);
    });
};

// callback for onBeforeSendHeaders listener.
// Returns a promise and adds cancel request to the xmlhttpreq
// trigger now looped into main promise.all
let getHeaders = (e) => {
    headers = '';
    sqlmapheaders = '';
    for (let header of e.requestHeaders) {
        sqlmapheaders += " --header '" + header.name + ": " + header.value + "'";
    }
    //console.log('headers: ' + headers.toString());
    

    var asyncCancel = new Promise((resolve, reject) => {
        resolve({cancel: true});
    });
    trigger(true);
    return asyncCancel;
};

// main command builder function
function assembleCmd(url, referUrl) {
    let sqlmapText = "sqlmap.py"; // sqlmap command holder
     if (verboseOption) {sqlmapText += " -v 4"; }
    // ######################################################################
    // use remote suggested filename, how safe is this?  also only available in moderately up to date 
    // ## replacement for -O -J, same security issues though, make optional 
    // ## this version will accept filename or location header
    // curl -s -D - "$url" -o /dev/null | grep -i "filename\|Location" | (IFS= read -r spo; sec=$(echo ${spo//*\//filename=}); echo ${sec#*filename=});
    // ######################################################################
    
    
    sqlmapText += sqlmapheaders;
    try {
        if (sqlmapUserOption.replace(/\s/g,'')) { sqlmapText += " " + sqlmapUserOption; }    
    }
    catch (e) {
        //ignore empty user option text inputs
    }
    sqlmapText += " -u '" + url + "'";
    
    
    
    if (quotesOption) {
        sqlmapText = wgetText.replace(/'/g,'"');
    }
    const sqlmapCode = "copyToClipboard(" + JSON.stringify(sqlmapText) + ", " + snackbarOption + ");";
    
    switch (programOption) {
        case "sqlmap":
            return (sqlmapCode);
            break;
    }
    //return (programOption === "curl") ? curlCode : wgetCode;
};

function copyCommand(code, tab)  {
browser.tabs.executeScript({
    code: "typeof copyToClipboard === 'function';",
    }).then((results) => {
            // The content script's last expression will be true if the function
            // has been defined. If this is not the case, then we need to run
            // clipboard-helper.js to define function copyToClipboard.
            if (!results || results[0] !== true) {
                return browser.tabs.executeScript(tab.id, {
                    file: "clipboard-helper.js",
                });
            }
    }).then(() => {
            return browser.tabs.executeScript(tab.id, {
                code,
            });
    }).catch((error) => {
            // This could happen if the extension is not allowed to run code in
            // the page, for example if the tab is a privileged page.
            console.error("Failed : " + error);
    });
};

browser.contextMenus.onClicked.addListener((info, tab) => {
    
    let url = (info.menuItemId === 'copy-media-to-clipboard') ? info.srcUrl : info.linkUrl
    let referUrl = info.pageUrl;
    let cleanedUrl = '';
    
    let gettingHeaders = new Promise(function(resolve, reject) {trigger = resolve;});
    
    // basic port num strip for certain urls
    // TODO more robust sanitize of url for match pattern
    if (RegExp('//').test(url)) {
        let temp = url.split('/');
        temp[2] = temp[2].replace(/:[0-9]+/, '');
        cleanedUrl = temp.join('/');
    }
    
    // add onbeforesendheaders listener for clicked url
    browser.webRequest.onBeforeSendHeaders.addListener(
        getHeaders, {urls: [cleanedUrl]}, ["blocking","requestHeaders"]);
    
    // workaround for xmlhttpget firing before addlistener is complete    
    let gettingHtml = new Promise (function(resolve,reject) {
        setTimeout(function(){ 
                resolve(ajaxGet({url: url}));
                }, 1);
    });
    
    // check the saved options each click in case they changed
    let gettingOptions = browser.storage.sync.get(
        ['quotes','prog','file','filename','ratelimit','verbose','resume','wgetUser','curlUser', 'sqlmapUser', 'snackbar'])
        .then((res) => {
            quotesOption = res.quotes;
            programOption = res.prog;
            fileOption = res.file;
            filenameOption = res.filename;
            verboseOption = res.verbose;
            sqlmapUserOption = res.sqlmapUser;
            snackbarOption = res.snackbar;
        });
    let promiseCancel = new Promise(function(resolve,reject) {
        setTimeout(function() {
                reject(false);
        },2000);
    });

    // 2s timeout if somehow the request was not caught on the 
    // header generation.
    let cancelled = Promise.race([promiseCancel, gettingHeaders]);
    
    // loop all requesite async functions into promise.all
    Promise.all([gettingOptions,gettingHtml,cancelled]).then(() => { 
        let code = assembleCmd(url, referUrl);
        copyCommand(code,tab);
        
        browser.webRequest.onBeforeSendHeaders.removeListener(getHeaders);
    },
    () => {
        // reset listener on reject
        browser.webRequest.onBeforeSendHeaders.removeListener(getHeaders);
    });
    
    
});

