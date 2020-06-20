function saveOptions(e) {
  browser.storage.sync.set({
    quotes: document.querySelector('input[name=quotes]').checked,
    prog: document.querySelector('input[name=prog]:checked').value,
    verbose: document.querySelector('input[name=verbose]').checked,
    rua: document.querySelector('input[name=rua]').checked,
    dumpall: document.querySelector('input[name=dumpall]').checked,
    osshell: document.querySelector('input[name=osshell]').checked,
    sqlmapUser: document.querySelector('input[name=sqlmapUser]').value,
    keepalive: document.querySelector('input[name=keepalive]').checked,
    nullconn: document.querySelector('input[name=nullconn]').checked,
    textonly: document.querySelector('input[name=textonly]').checked,
    titleonly: document.querySelector('input[name=titleonly]').checked,
    batchp: document.querySelector('input[name=batchp]').checked,
    hex: document.querySelector('input[name=hex]').checked,
    mobile: document.querySelector('input[name=mobile]').checked,
    chunked: document.querySelector('input[name=chunked]').checked,
    dropcook: document.querySelector('input[name=dropcook]').checked,
    threads: document.querySelector('input[name=threads]').value,
    unstableconn: document.querySelector('input[name=unstableconn]').checked,
    nocast: document.querySelector('input[name=nocast]').checked,
    noescape: document.querySelector('input[name=noescape]').checked,
    techb: document.querySelector('input[name=techb]').checked,
    teche: document.querySelector('input[name=teche]').checked,
    techu: document.querySelector('input[name=techu]').checked,
    techs: document.querySelector('input[name=techs]').checked,
    techt: document.querySelector('input[name=techt]').checked,
    techq: document.querySelector('input[name=techq]').checked,
    dbs: document.querySelector('input[name=dbs]').checked,
    ctables: document.querySelector('input[name=ctables]').checked,
    ccolumns: document.querySelector('input[name=ccolumns]').checked,
    cfiles: document.querySelector('input[name=cfiles]').checked,
    snackbar: document.querySelector('input[name=snackbar]').checked, 

  });
    if (typeof(e) !== "undefined") {
        e.preventDefault();
    }

}

function restoreOptions() {
  var gettingItem = browser.storage.sync.get(
    ['quotes', 'prog', 'verbose', 'rua', 'dumpall', 'osshell', 'sqlmapUser', 'keepalive', 'nullconn', 'textonly', 'titleonly', 'batchp', 'hex', 'mobile', 'chunked', 'dropcook', 'threads', 'unstableconn', 'nocast', 'noescape', 'techb', 'teche', 'techu', 'techs', 'techt', 'techq', 'dbs', 'ctables', 'ccolumns', 'cfiles', 'snackbar']);
  gettingItem.then((res) => {
    
    if (Object.keys(res).length > 0 && res.constructor === Object) {
        document.querySelector('input[name=quotes]').checked = res.quotes ? res.quotes : false;
        document.querySelector('input[name=prog][value=' + res.prog + ']').checked = true;
        document.querySelector('input[name=verbose]').checked = res.verbose ? res.verbose : false;
        document.querySelector('input[name=rua]').checked = res.rua ? res.rua : true;
        document.querySelector('input[name=dumpall]').checked = res.dumpall ? res.dumpall : true;
        document.querySelector('input[name=osshell]').checked = res.osshell ? res.osshell : false;
        document.querySelector('input[name=sqlmapUser]').value = res.sqlmapUser ? res.sqlmapUser : '';
        document.querySelector('input[name=keepalive]').checked = res.keepalive ? res.keepalive : false;
        document.querySelector('input[name=nullconn]').checked = res.nullconn ? res.nullconn : false;
        document.querySelector('input[name=textonly]').checked = res.textonly ? res.textonly : false;
        document.querySelector('input[name=titleonly]').checked = res.titleonly ? res.titleonly : false;
        document.querySelector('input[name=batchp]').checked = res.batchp ? res.batchp : false;
        document.querySelector('input[name=hex]').checked = res.hex ? res.hex : false;
        document.querySelector('input[name=mobile]').checked = res.mobile ? res.mobile : false;
        document.querySelector('input[name=chunked]').checked = res.chunked ? res.chunked : false;
        document.querySelector('input[name=dropcook]').checked = res.dropcook ? res.dropcook : false;
        document.querySelector('input[name=threads]').value = res.threads ? res.threads : '2';
        document.querySelector('input[name=unstableconn]').checked = res.unstableconn ? res.unstableconn : false;
        document.querySelector('input[name=nocast]').checked = res.nocast ? res.nocast : false;
        document.querySelector('input[name=noescape]').checked = res.noescape ? res.noescape : false;
        document.querySelector('input[name=techb]').checked = res.techb ? res.techb : true;
        document.querySelector('input[name=teche]').checked = res.teche ? res.teche : true;
        document.querySelector('input[name=techu]').checked = res.techu ? res.techu : true;
        document.querySelector('input[name=techs]').checked = res.techs ? res.techs : true;
        document.querySelector('input[name=techt]').checked = res.techt ? res.techt : true;
        document.querySelector('input[name=techq]').checked = res.techq ? res.techq : true;
        document.querySelector('input[name=dbs]').checked = res.dbs ? res.dbs : true;
        document.querySelector('input[name=ctables]').checked = res.ctables ? res.ctables : false;
        document.querySelector('input[name=ccolumns]').checked = res.ccolumns ? res.ccolumns : false;
        document.querySelector('input[name=cfiles]').checked = res.cfiles ? res.cfiles : false;
        document.querySelector('input[name=snackbar]').checked = res.snackbar ? res.snackbar : false;
    }
    // if no saved info save the defaults to initialize
    else {
        saveOptions();
    }
  });
}
document.getElementById("prog").style.visibility = "hidden"; 
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
