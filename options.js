function saveOptions(e) {
  browser.storage.sync.set({
    quotes: document.querySelector('input[name=quotes]').checked,
    prog: document.querySelector('input[name=prog]:checked').value,
    verbose: document.querySelector('input[name=verbose]').checked,
    rua: document.querySelector('input[name=rua]').checked,
    sqlmapUser: document.querySelector('input[name=sqlmapUser]').value,
    snackbar: document.querySelector('input[name=snackbar]').checked,
    
  });
    if (typeof(e) !== "undefined") {
        e.preventDefault();
    }

}

function restoreOptions() {
  var gettingItem = browser.storage.sync.get(
    ['quotes', 'prog','verbose','rua','resume','sqlmapUser','snackbar']);
  gettingItem.then((res) => {
    
    if (Object.keys(res).length > 0 && res.constructor === Object) {
        document.querySelector('input[name=quotes]').checked = res.quotes ? res.quotes : false;
        document.querySelector('input[name=prog][value=' + res.prog + ']').checked = true;
        document.querySelector('input[name=verbose]').checked = res.verbose ? res.verbose : false;
        document.querySelector('input[name=rua]').checked = res.rua ? res.rua : false;
        document.querySelector('input[name=sqlmapUser]').value = res.sqlmapUser ? res.sqlmapUser : '';
        document.querySelector('input[name=snackbar]').checked = res.snackbar ? res.snackbar : false;
    }
    // if no saved info save the defaults to initialize
    else {
        saveOptions();
    }
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
