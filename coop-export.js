/*
 * A horrible scraping hack bookmarklet to generate 
 * downloadable statements from Co-op Bank's personal banking service.
 *
 * Made even more horrible by Iain Houston (http://iainhouston.com) 
 * March 2015 after Co-op page re-design
 *
 * Credits to: 
 *      Marc Palmer (marc@anyware.co.uk)
 *      Cody Lindley (http://codylindley.com/Javascript/257/thickbox-one-box-to-rule-them-all)
 *      Remy Sharp:  Microformts Bookmarklet
 *
 * License: Creative Commons License - ShareAlike http://creativecommons.org/licenses/by-sa/3.0/
 * 
 *
 * Non-object oriented Javascript ahoy. Bite me hipsters.
 */

function exporter_clean(n) {
    return $.trim(n);
}

function exporter_csv_line(date, desc, credit, debit) {
    return date+','+desc+','+credit+','+debit+'\n';
}

function exporter_generate_csv(lines) {
    var output = 'Date,Description,Credit,Debit\n';
    $.each(lines, function(i, item) {
        var cred = item.amount.indexOf('-') >= 0 ? '' : item.amount;
        var deb = item.amount.indexOf('-') >= 0 ? item.amount : '';
        output += exporter_csv_line(item.date, item.description, cred, deb);
    });
    return output;
}

function exporter_download_filename() {
    return $('#exporter-window .exporter-filename').text();
}

function exporter_download_filename_csv() {
    return exporter_download_filename() + '.csv';
}

function exporter_download_filename_ofx() {
    return exporter_download_filename() + '.ofx';
}

function exporter_csv_data() {
    return $('#exporter-window textarea.csv').text();
}

function exporter_ofx_data() {
    return $('#exporter-window textarea.ofx').text();
}

function exporter_init_dialog() {
    var container = $('<div id="exporter-container"></div>');
    $('body').append( container );
    exporterContainer = $('#exporter-container');
    exporterContainer.html(exporter_dialog_create());
}

function exporter_dialog_create() {
    return '<div id="exporter-window" style="padding:30px;">'+
        '<h1>Save your Co-op Statement</h1>'+
        '<div class="exporter-preview exporter-statement-preview">'+
        '<p>Account: <span class="exporter-account"></span></p>'+
        '<p>Statement number: <span class="exporter-statement-number"></span><br/>'+
        'Date: <span class="exporter-statement-date"></span><br/>'+
        'Closing balance: <span class="exporter-statement-balance"></span></p>'+
        '</div>'+
        '<div class="exporter-preview exporter-recent-preview">'+
        '<p>Account: <span class="exporter-account"></span></p>'+
        '<p>Recent items to: <span class="exporter-statement-date"></span><br/>'+
            'Final balance: <span class="exporter-statement-balance"></span></p>'+
        '</div>'+
        '<div class="exporter-message">'+
        '</div>'+
        '<div class="exporter-data">'+
        '<textarea class="csv"></textarea>'+
        '<textarea class="ofx"></textarea>'+
        '</div>'+
        '<span class="exporter-filename"></span>'+
        '<div class="exporter-actions">'+
        '<button class="exporter-close">Close</button>'+
        '<div class="exporter-download-csv"></div>'+
        '<div class="exporter-download-ofx"></div>'+
        '</div>'+
        '<div class="exporter-footnote">'+
        '<br/>This feature is <strong>not supported in any way by The Co-operative Bank</strong> and no warranties or guarantees are '+
        'made that it will continue to work. <strong>Do not call the bank about problems with this feature.</strong>'+
        '</div>';
}

function exporter_styles() {
    $('#exporter-overlay').css({
        'position': 'absolute',
        'zIndex': '9998',
        'width': '100%',
        'height': '100%',
        'top': '0',
        'left': '0',
        'minHeight': '100%',
        'backgroundColor': '#000',
        'filter': 'alpha(opacity=60)'
    }).css('opacity', 0.6);
    exporter_size_overlay();
    
    $('#exporter-container').css({
        'padding': '0 10px',
        'position': 'absolute',
        'background': '#fff',
        'fontSize':'16px',
        'borderRadius': '5px',
        'zIndex': '9999',
        'color': '#000',
        'border': '2px solid #202020',
        'textAlign': 'left'
    });
    
    var btn = {
        'font-family':'"Helvetica Neue", Helvetica, Arial, sans-serif',
        'font-weight':'normal',
        '-webkit-appearance':'button',
        'margin':'0',
        'display':'inline-block',
        'padding':'4px 12px',
        'font-size':'14px',
        'line-height':'20px',
        'color':'#333333',
        'text-align':'center',
        'text-shadow':'0 1px 1px rgba(255, 255, 255, 0.75)',
        'vertical-align':'middle',
        'background-color':'#f5f5f5',
        'background-image':'-moz-linear-gradient(top, #ffffff, #e6e6e6)',
        'background-image':'-webkit-gradient(linear, 0 0, 0 100%, from(#ffffff), to(#e6e6e6))',
        'background-image':'-webkit-linear-gradient(top, #ffffff, #e6e6e6)',
        'background-image':'-o-linear-gradient(top, #ffffff, #e6e6e6)',
        'background-image':'linear-gradient(to bottom, #ffffff, #e6e6e6)',
        'background-repeat':'repeat-x',
        'border':'1px solid #bbbbbb',
        'border-color':'#e6e6e6 #e6e6e6 #bfbfbf',
        'border-color':'rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25)',
        'border-bottom-color':'#a2a2a2',
        '-webkit-border-radius':'4px',
        '-moz-border-radius':'4px',
        'border-radius':'4px',
        'filter':'progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#ffffffff\', endColorstr=\'#ffe6e6e6\', GradientType=0)',
        'filter':'progid:DXImageTransform.Microsoft.gradient(enabled=false)',
        '-webkit-box-shadow':'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05)',
        '-moz-box-shadow':'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05)',
        'box-shadow':'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05)'
    };

    $('#exporter-window div').css({'margin':'0', 'padding':'0'});
    var font = '"Helvetica Neue", Helvetica, Arial, sans-serif';
    $('#exporter-window').css({'margin':'20px', 'padding':'0', 'fontFamily':font});
    $('#exporter-window p').css({ 'fontFamily': font, 'padding': '0', 'margin':'0' });
    $('#exporter-window h1').css({ 'fontFamily': font, 'fontSize': '1.4em', 'marginBottom': '10px' });
    $('#exporter-window div.exporter-message').css({ 'marginTop': '20px', 'marginBottom': '20px' }); 
    $('#exporter-window div.exporter-message p').css({ 'fontSize': '0.9em' }); 
    $('#exporter-window div.exporter-preview p').css({ 'fontSize': '0.9em' });
    $('#exporter-window div.exporter-actions').css({ 'fontSize': '2em' });
    $('#exporter-window div.exporter-footnote').css({ 'fontSize': '0.75em', 'marginTop':'20px', 'color':'#606060' });
    $('#exporter-window .exporter-close').css($.extend({}, btn, { 'float': 'right' }));
    $('#exporter-window .exporter-download-csv').css({ 'float': 'left', 'marginRight':'10px' });
}

// Credit to Cody Lindley 
function exporter_size_overlay() {
    if (window.innerHeight&&window.scrollMaxY) {    
        yScroll = window.innerHeight + window.scrollMaxY;
    } else if (document.body.scrollHeight > document.body.offsetHeight) {
        yScroll = document.body.scrollHeight;
    } else {
        yScroll = document.body.offsetHeight;
    }
    $('#exporter-overlay').css('height',yScroll +'px');
}

function exporter_clean_account(s) {
    var ls = s.toLowerCase();
    var result = '';
    var lastWasEscaped = false;
    var i;
    for (i = 0; i < s.length; i++) {
        var c = ls.charAt(i);
        if ("abcdefghijklmnopqrstuvwxyz0123456789".indexOf(c) >= 0) {
            var origC = s.charAt(i);
            result = result + origC;
            lastWasEscaped = false;
        } else {
            if (!lastWasEscaped) {
                result += '_';
                lastWasEscaped = true;
            }
        }
    }
    return result;
}

function exporter_ofx_date(coopDate) {
    var parts = coopDate.split('/');
    if (parts[0].length < 2) {
        parts[0] = '0'+parts[0];
    }
    if (parts[1].length < 2) {
        parts[1] = '0'+parts[1];
    }
    return parts[2]+parts[1]+parts[0];
}

function exporter_generate_ofx(data) {
    var ofx = '';
    ofx += '<?xml version="1.0" encoding="UTF-8"?>\n'+
        '<?OFX VERSION="203" OFXHEADER="200" SECURITY="NONE" OLDFILEUID="NONE" NEWFILEUID="NONE"?>\n'+
        '<OFX>\n'+
        '<SIGNONMSGSRSV1>\n'+
        '   <SONRS>\n'+
        '       <STATUS>\n'+
        '           <CODE>0</CODE>\n'+
        '           <SEVERITY>INFO</SEVERITY>\n'+
        '       </STATUS>\n';
    var nowDate = new Date();
    var nowMonth = nowDate.getMonth();
    var generatedDate = exporter_ofx_date(
        nowDate.getDate()+'/'+
        (nowMonth+1)+'/'+
        nowDate.getFullYear());
    ofx += '<DTSERVER>'+generatedDate+'</DTSERVER>\n';
    ofx += '       <LANGUAGE>ENG</LANGUAGE>\n'+
        '   </SONRS>\n'+
        '   <BANKMSGSETV1>\n'+
        '       <STMTTRNRS>\n'+
        '           <STMTRS>\n'+
        '               <CURDEF>GBP</CURDEF>\n'+
        '               <BANKACCTFROM>\n';
    ofx += '<BANKID>'+data.sortCode+'</BANKID>\n';
    ofx += '<ACCTID>'+data.accountNumber+'</ACCTID>\n';
    ofx += '<ACCTTYPE>'+data.accountType+'</ACCTTYPE>\n';
    ofx += '</BANKACCTFROM>\n'+
        '<BANKTRANLIST>\n';
    var startDate = exporter_ofx_date(data.startDate); 
    var endDate = exporter_ofx_date(data.endDate);
    ofx += '<DTSTART>'+startDate+'</DTSTART>\n';
    ofx += '<DTEND>'+endDate+'</DTEND>\n';
    var i;
    for (i = 0; i < data.lines.length; i++) {
        var line = data.lines[i];
        ofx += '<STMTTRN>\n';
        ofx += '<TRNTYPE>'+(line.amount < 0 ? 'DEBIT' : 'CREDIT')+'</TRNTYPE>\n';
        var lineDate = exporter_ofx_date(line.date);
        ofx += '<DTPOSTED>'+lineDate+'</DTPOSTED>\n';
        ofx += '<TRNAMT>'+line.amount+'</TRNAMT>\n';
        // Create a base-64 encoded ASCII string from line-unique characteristics
        // Used to detect duplicate downloads
        var fitId = window.btoa((line.date+line.description+line.amount+data.statementNumber));  
        // var fitId = window.btoa((line.date+line.description+line.amount+Date.now)); // @todo 
        ofx += '<FITID>'+fitId+'</FITID>\n';
        ofx += '<NAME>'+line.description+'</NAME>\n';
        ofx += '</STMTTRN>\n';
    }
    ofx += '</BANKTRANLIST>\n';

    ofx += '<LEDGERBAL>\n';
    ofx += '<BALAMT>'+data.statementBalance+'</BALAMT>\n';
    var balanceDate = exporter_ofx_date(data.statementDate);
    ofx += '<DTASOF>'+balanceDate+'</DTASOF>';
    ofx += '</LEDGERBAL>\n'+
        '</STMTRS>\n'+
        '</STMTTRNRS>\n'+
        '</BANKMSGSETV1>\n'+
        '</SIGNONMSGSRSV1>\n'+
        '</OFX>\n';
    return ofx;
}

function exporter_display(data) {
    var w = $('#exporter-window');
    $('.exporter-data', w).hide();
    $('.exporter-filename', w).hide();
    $('.exporter-statement-preview').hide();
    $('.exporter-recent-preview').hide();

    if (data.lines) {
        $('.exporter-data textarea.csv', w).text(exporter_generate_csv(data.lines));
        $('.exporter-data textarea.ofx', w).text(exporter_generate_ofx(data));

        $('.exporter-download', w).show();
        $('.exporter-account', w).text(data.account);
        $('.exporter-statement-number', w).text(data.statementNumber);
        $('.exporter-statement-date', w).text(data.statementDate);
        $('.exporter-statement-balance', w).text(data.statementBalance);

        var isStatement = data.statementNumber.length > 0;

        var fn = (isStatement ? 'Statement_' : 'Recent_transactions_') + 
            exporter_clean_account(data.accountName) + '_' +
            data.accountNumber + '_' +
            data.statementDate.replace(/\//g, '-');
        $('.exporter-filename', w).text(fn);
        
        $('.exporter-message', w).text(
            'Click a Download button to save the file.'
        );
        if (!isStatement) {
            $('.exporter-recent-preview').show();
        } else {
            $('.exporter-statement-preview').show();
        }
    } else {
        $('.exporter-download', w).hide();
        $('.exporter-message', w).text(
            'Sorry but there was a problem reading the statement from the page.'
        );
    }

    $('.exporter-close', w).on('click', function(event) {
        exporter_close();
        event.preventDefault();
        return false;
    });
}

function exporter_hasNodeWithText(sel, text) {
    var nodes = $(sel).filter( function(index) { return $(this).text().trim() == text });
    return nodes.size() > 0;
}

function exporter_clean_balance(text) {
    var balanceText;
    balanceText = text.replace('\u00A3', '');
    // Co-op now employs training + or -
    balanceText = $.trim(balanceText.replace('+', ''));
    if (balanceText.indexOf('-') != -1) {
        // we require leading '-'
        balanceText = '-' + $.trim(balanceText.replace('-', ''));
    }
    return balanceText;
}

function exporter_close() {
    $('#exporter-container').remove();
    $('#exporter-overlay').remove();
}

function exporter_get_page_scroll_top() {
    var yScrolltop;
    if (self.pageYOffset) {
        yScrolltop = self.pageYOffset;
    } else if (document.documentElement&&document.documentElement.scrollTop) {
        yScrolltop = document.documentElement.scrollTop;
    } else if (document.body) {
        yScrolltop = document.body.scrollTop;
    }
    arrayPageScroll = new Array('',yScrolltop);
    return arrayPageScroll;
}

function exporter_get_page_size() {
    var de = document.documentElement;
    var w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
    var h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;

    arrayPageSize = new Array(w,h);
    return arrayPageSize;
}   

function exporter_set_position() {
    var pagesize = exporter_get_page_size();   
    var arrayPageScroll = exporter_get_page_scroll_top();

    $('#exporter-container').css({width:'400px',left: ((pagesize[0] - 300)/2)+'px', top: (arrayPageScroll[1] + 25)+'px'});
    exporter_size_overlay();
}

function exporter_init() {
    $('body').append('<div id="exporter-overlay"></div>');
    $('#exporter-overlay').click(exporter_close);
    exporter_init_dialog();
    exporter_styles();
    exporter_set_position();
}

function exporter_main() {
    var pageElem = $('td#recentItemsPageCount');
    var isStatementsPage = exporter_hasNodeWithText('h2', 'Statement list');
    var isStatementPage = exporter_hasNodeWithText('td.transactionDataLabel', 'Sort code') && pageElem.size() > 0;
    var isRecentItemsPage = exporter_hasNodeWithText('td.recentTransactionsAccountData td.transactionDataLabel', 'Account number') && pageElem.size() == 0;

    if (!isStatementPage && !isRecentItemsPage) {
        if (isStatementsPage) {
            window.alert("You appear to be on the Statements list page. Click on the statement number you wish to view, then press this Save Co-op Statement bookmark again.");
        } else {
            window.alert("Sorry, this is not a Co-op banking Recent Items or Statements page. Please navigate to "+
                "your online banking and select the account or statement you wish to download and try again.");
        }
        return false;
    }

    // 
    // Now just deal with the two different kinds of pages: the recent items page; a previous statement page
    //
    var accountElem = $('h2');
    var accountDescription = $.trim(accountElem.text());
    // var accountType = accountName.indexOf('SAV') >= 0 ? 'SAVINGS' : 'CHECKING';
    var accountType = accountDescription.indexOf('SAV') >= 0 ? 'SAVINGS' : 'CHECKING'; // TODO: ??

    var output = new Array();
    var finalBalance;
    var finalDate;
    var firstDate;
    var accountNumber;
    var sortCode;
    var accountName;
    var statementNo;
    var statementDate;

    accountName = exporter_clean_account($('div.accDetails > strong').text());
    if (isStatementPage) {
        accountNumber = $('td.transactionDataLabel:contains("Account number")').next().text();
        sortCode = $('td.transactionDataLabel:contains("Sort code")').next().text().replace(/-/g, '');
        var piMatches = /^(.+)Page\s+(\d+).+$/g.exec($.trim(pageElem.text()));
        statementNo = exporter_clean(piMatches[2]);
        statementDate = $('td.transactionDataLabel:contains("Statement date")').next().text();
    } else{  
        // isRecentItemsPage      
        var accountNode = $('td.transactionDataLabel:contains("Account number")').next().text();
        var acMatches = /^(\d+)\s+(\d\d-\d\d-\d\d)$/g.exec(accountNode);
        accountNumber = acMatches[1]; 
        sortCode = acMatches[2].replace(/-/g, '');
        // :contains(Balance) ambiguous on this page
        var balanceNode = $('td.recentTransactionsAccountData table tr:nth-child(2) td:contains(Balance)').next();
        finalBalance = exporter_clean_balance(balanceNode.text());
        // StatementNo   is determined below after parsing transactions
        // StatementDate is determined below after parsing transactions
    };

    // Statement pages have more than one summaryTable
    // We're only concerned with the table containing Transaction details
    var statementTable = $('th:contains("Transaction")').parents('table');
    var trs = $('tr', statementTable.get(0));

    // Ignore the table heading rows and
    // Statements have a Brought Forward row also
    var rowsToIgnore = isStatementPage ? 2 : 1; 
    if (trs.size() > rowsToIgnore) {

        // for each row collect:
        var dateText;
        var desc;
        var moneyInText;
        var moneyOutText;
        var balanceText;

        trs.each(function(i) { 

            if (i >= rowsToIgnore) { // ignore the header row(s)

                // The last row in Recent items is not a Transaction row
                var isNotLastRow = $(this).children('td').size() > 1;
                if (isNotLastRow) {

                    // step to each cell within a row
                    var tds= $('td', $(this)); 

                    tds.each(function(j){
                        var thisText = $(this).text();
                        switch(j) { // j indexes the tds within each tr
                        case 0:
                            dateText = $.trim(thisText); // this DOM element
                            finalDate = dateText;       // last tr implicitly
                            if (i == rowsToIgnore) {    // first tr explicitly
                                firstDate = dateText;
                            }
                            break;
                        case 1:
                            desc = thisText;
                            break;
                        case 2:
                            moneyInText = exporter_clean(thisText.replace('\u00A3', ''));
                            break;
                        case 3:
                            moneyOutText = exporter_clean(thisText.replace('\u00A3', ''));
                            break;
                        case 4: // Statement only
                            balanceText = exporter_clean_balance(thisText);
                            finalBalance = balanceText;
                            break;
                        } // switch               

                    }); // tds.each

                    output[i-rowsToIgnore] = {
                        'date':dateText,
                        'description':desc,
                        'amount':moneyInText.length > 0 ? moneyInText : '-'+moneyOutText
                    }; // output[i]

                }; // if (isNotLastRow)

            }; // ignore the header row(s)

        }); // trs.each

    } // if (trs.size() > 1)

    var startDate;
    var endDate;

    if (isStatementPage) {
        // Statements ordered most recent last
        startDate = firstDate;
        endDate = finalDate;
    } else {
        // Recent Items ordered most recent first
        startDate = finalDate;
        endDate = firstDate;
        statementDate = endDate;
        //  We use the statementNo to attempt to identify duplicate OFX downloads
        statementNo = exporter_ofx_date(startDate); 
    }

    if (!startDate || !endDate || output.length == 0) {
        window.alert("There is no information on this statement, so there is nothing to save.");
        return false;
    }

    exporter_display({
        account:accountDescription,
        accountName:accountName,
        accountType: accountType,
        accountNumber: accountNumber,
        sortCode: sortCode,
        lines:output, 
        startDate:startDate,
        endDate:endDate,
        statementNumber:$.trim(statementNo), 
        statementDate:$.trim(statementDate),
        statementBalance:$.trim(finalBalance)
    });
    return true;
} // exporter_main() 

var exporter_site = "https://jazz2.eu/coop-export/";

function exporter_load(url, callback) {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.src = exporter_site+url;

    // Attach handlers for all btrsers
    var done = false;
    script.onload = script.onreadystatechange = function()
    {
        if( !done && ( !this.readyState 
                    || this.readyState == "loaded" 
                    || this.readyState == "complete") )
        {
            done = true;

            // Continue your code
            callback();

            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;
            head.removeChild( script );
        }
    };

    head.appendChild(script);
}

// Download other dependencies and then start
exporter_load('js/downloadify.js', function () {
    exporter_load('js/swfobject.js', function() {
        $(function() {
            if ($('#exporter-container').size() <= 0) {
                exporter_init();
            }

            if (!exporter_main()) {
                exporter_close();
                return;
            }

            $(".exporter-download-csv").downloadify( { 
                'downloadImage': exporter_site+'img/download-csv.png',
                'width': 100,
                'height': 30,
                'filename': exporter_download_filename_csv,
                'data': exporter_csv_data,
                'swf':exporter_site+'media/downloadify.swf',
                'onError': function() {
                    window.alert('Sorry, but someting went wrong with the file save, there was no data');
                },
                'onCancel': function() {
                },
                'onComplete': function() {
                    exporter_close();
                }
            } );

            $(".exporter-download-ofx").downloadify( { 
                'downloadImage': exporter_site+'img/download-ofx.png',
                'width': 100,
                'height': 30,
                'filename': exporter_download_filename_ofx,
                'data': exporter_ofx_data,
                'swf':exporter_site+'media/downloadify.swf',
                'onError': function() {
                    window.alert('Sorry, but someting went wrong with the file save, there was no data');
                },
                'onCancel': function() {
                },
                'onComplete': function() {
                    exporter_close();
                }
            } );

        });
    });
});
