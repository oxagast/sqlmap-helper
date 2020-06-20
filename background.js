/* Written by oxagast.  Edited some things from mycliget to get this to work.
 * Some of this code from mycliget.
 * clipboard function originated with mozilla webextension examples here:
 * https://github.com/mdn/webextensions-examples
 */
 
 
var quotesOption = false;
var programOption = 'sqlmap';
var verboseOption = false;
var uaOption = 'sqlmapua';
var dumpallOption = false;
var osshellOption = false;
var headers = '';
var sqlmapheaders = '';
var keepaliveOption = false;
var snackbarOption = false;
var nullconnOption = false;
var textonlyOption = false;
var titleonlyOption = false;
var batchpOption = false;
var hexOption = false;
var chunkedOption = false;
var dropcookOption = false;
var threadsOption = "2";
var unstableconnOption = false;
var nocastOption = false;
var noescapeOption = false;
var techOption = '';
var techbOption = true;
var techeOption = true;
var techuOption = true;
var techsOption = true;
var techtOption = true;
var techqOption = true;
var dbsOption = true;
var ctablesOption = false;
var ccolumnsOption = false;
var cfilesOption = false;
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

let getHeaders = (e) => {
    headers = '';
    sqlmapheaders = '';
    for (let header of e.requestHeaders) {
        if(header.name.match(/Cookie/)) {
// grabs the cookie value
                sqlmapheaders += " --cookie '" + header.value + "'";
        }
    }
    

    var asyncCancel = new Promise((resolve, reject) => {
        resolve({cancel: true});
    });
    trigger(true);
    return asyncCancel;
};

// main command builder function
function assembleCmd(url, referUrl) {
    let sqlmapText = "sqlmap.py"; // sqlmap command holder
     if (verboseOption) {sqlmapText += " -v 4"; };
     if (uaOption === "rua") {sqlmapText += " --random-agent"; };
     if (dumpallOption) {sqlmapText += " --dump-all"; };
     if (osshellOption) {sqlmapText += " --os-shell"; };
     if (keepaliveOption) {sqlmapText += " --keep-alive"; };
     if (nullconnOption) {sqlmapText += " --null-connection"; };
     if (textonlyOption) {sqlmapText += " --text-only"; };
     if (titleonlyOption) {sqlmapText += " --titles"; };
     if (batchpOption) {sqlmapText += " --batch"; };
     if (hexOption) {sqlmapText += " --hex"; };
     if (uaOption === "mobile") {sqlmapText += " --mobile"; };
     if (chunkedOption) {sqlmapText += " --chunked"; };
     if (dropcookOption) {sqlmapText += " --drop-set-cookie"; };
     if (unstableconnOption) {sqlmapText += " --unstable"; };
     if (nocastOption) {sqlmapText += " --no-cast"; };
     if (noescapeOption) {sqlmapText += " --no-escape"; };
     if (dbsOption) {sqlmapText += " --dbs"; };
     if (ctablesOption) {sqlmapText += " --common-tables"; };
     if (ccolumnsOption) {sqlmapText += " --common-columns"; };
     if (cfilesOption) {sqlmapText += " --common-files"; };

     techOption = ''
     if (techbOption) {techOption += "B"; };
     if (techeOption) {techOption += "E"; };
     if (techuOption) {techOption += "U"; };
     if (techsOption) {techOption += "S"; };
     if (techtOption) {techOption += "T"; };
     if (techqOption) {techOption += "Q"; };
     sqlmapText += " --technique " + techOption;

     sqlmapText += " --threads " + threadsOption;
        
     sqlmapText += sqlmapheaders;
    try {
        if (sqlmapUserOption.replace(/\s/g,'')) { sqlmapText += " " + sqlmapUserOption; }    
    }
    catch (e) {
        //ignore empty user option text inputs
    }
    sqlmapText += " -u '" + url + "'";
    
    
    
    const sqlmapCode = "copyToClipboard(" + JSON.stringify(sqlmapText) + ", " + snackbarOption + ");";
    
    switch (programOption) {
        case "sqlmap":
            return (sqlmapCode);
            break;
    }
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
        ['quotes','prog','verbose','ua','dumpall','osshell','sqlmapUser', 'keepalive', 'nullconn', 'textonly', 'titleonly', 'batchp', 'hex', 'chunked', 'dropcook', 'threads', 'unstableconn', 'nocast', 'noescape', 'techb', 'teche', 'techu', 'techs', 'techt', 'techq', 'dbs', 'ctables', 'ccolumns', 'cfiles', 'snackbar'])
        .then((res) => {
            quotesOption = res.quotes;
            programOption = res.prog;
            verboseOption = res.verbose;
            uaOption = res.ua;
            dumpallOption = res.dumpall;
            osshellOption = res.osshell;
            sqlmapUserOption = res.sqlmapUser;
            keepaliveOption = res.keepalive;
            nullconnOption = res.nullconn;
            textonlyOption = res.textonly;
            titleonlyOption = res.titleonly;
            batchpOption = res.batchp;
            hexOption = res.hex;
            chunkedOption = res.chunked;
            dropcookOption = res.dropcook;
            threadsOption = res.threads;
            unstableconnOption = res.unstableconn;
            nocastOption = res.nocast;
            noescapeOption = res.noescape;
            techbOption = res.techb;
            techeOption = res.teche;
            techuOption = res.techu;
            techsOption = res.techs;
            techtOption = res.techt;
            techqOption = res.techq;
            dbsOption = res.dbs;
            ctablesOption = res.ctables;
            ccolumnsOption = res.ccolumns;
            cfilesOption = res.cfiles;
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

