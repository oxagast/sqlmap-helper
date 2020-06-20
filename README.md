## sqlmap helper

This is an extension for firefox to help generate sqlmap commands for web exploitation.

Probably best to install from Firefox addon repository, but if you want to install from GitHub you'll need to zip this directory, then change the extension to .xpi and load as an addon in the extensions page.  Once installed, go to Addons->SQLMap helper->preferences and set your sqlmap options, then right click on a link and select "Copy SQLMap command the clipboard" to use.

Doesn't support all sqlmap options yet, but most important ones should be supported.

You'll of course need sqlmap for this to be useful, you can grab it from here: https://github.com/sqlmapproject/sqlmap.
