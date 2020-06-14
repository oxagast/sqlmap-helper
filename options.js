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
          snackbar: document.querySelector('input[name=snackbar]').checked, 

  });
    if (typeof(e) !== "undefined") {
        e.preventDefault();
    }

}

function restoreOptions() {
  var gettingItem = browser.storage.sync.get(
    ['quotes', 'prog', 'verbose', 'rua', 'dumpall', 'osshell', 'sqlmapUser', 'keepalive', 'snackbar']);
  gettingItem.then((res) => {
    
    if (Object.keys(res).length > 0 && res.constructor === Object) {
        document.querySelector('input[name=quotes]').checked = res.quotes ? res.quotes : false;
        document.querySelector('input[name=prog][value=' + res.prog + ']').checked = true;
        document.querySelector('input[name=verbose]').checked = res.verbose ? res.verbose : false;
        document.querySelector('input[name=rua]').checked = res.rua ? res.rua : true;
        document.querySelector('input[name=dumpall]').checked = res.dumpall ? res.dumpall : true;
        document.querySelector('input[name=osshell]').checked = res.osshell ? res.osshell : false;
        document.querySelector('input[name=sqlmapUser]').value = res.sqlmapUser ? res.sqlmapUser : '';
        document.querySelector('input[name=keepalive]').value = res.keepalive ? res.keepalive : false;
        document.querySelector('input[name=nullconn]').value = res.nullconn ? res.nullconn : false;
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