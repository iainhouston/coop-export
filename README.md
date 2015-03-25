# coop-export
Download your Co-op Bank Statements

This is a fork of the program that [Marc Palmer](http://uncoop.me) wrote to download your Co-op Bank Statements from their personal banking website.

To use this program you'll need to:  

 1.  Copy a *bookmarklet* (the contents of [js/bokkmarklet.js](js/bokkmarklet.js)) into your browser's bookmarks
 2.  Log into your Co-operative Personal Banking account. Transaction Details can be exported from either *Recent Transactions* or *Previous Statements* pages.
 3.  Then click the bookmark which will add a couple of lines of Javascript into you statement page.
 4.  Click a button in a dialog window to choose between CSV and OFX-formatted downlload.
 5.  Choose the path on your computer where you'd like your transaction data downloaded.
 
# Privacy 
If your privacy alarm bells are ringing - as they should be! - consider that the Co-op page knows nothing of `coop-export.js` until you click the bookmark. At the time you are reading a list of bank transactions you have long ago completely finished the submission of your credentials: they are not accessible to any JavaScript code on pages with transaction details. The `coop-export` Javascript executes only when you invoke it. There is a trust issue in that the actual downloading is done by an Adobe Flash program whose code we don't see. The JavaScript code here in this repo is available for your inspection: it is concerned with navigating the two kinds of web page; extracting the export data and invoking the download program.   

So, there is a risk to your privacy you'll have to assess for yourself. For myself, I trust the [original author's intentions](http://www.anyware.co.uk/uncoop/#how) and I have no reason to believe that my meagre financial transaction history has ever been transmitted anywhere I wouldn't want it to be.

# Why
I forked `coop-export.js` in March 2015 when I was looking for such a program and found that, in it's available version, `coop-export.js` hadn't been updated in line with the Co-operative's then-new website. The CSS and HTML within which Transaction details are wrapped up in a slightly different way. 

# Why you should make the Javascript available on your own web server  
To be executable, the JavaScript has to be served from a web server an cannot, for security reasons, be invoked from a file on your computer; your browser will not allow it. The Flash program has also, as far as I know, to be fetched from a remote URL. So these programs have to live somewhere. I have hard-coded my own server URL into `coop-exprt.js` - there is much other poor programming to see; worry ye not :-) - but you should serve your own as I cannot guarantee that it will remain on my server for ever.