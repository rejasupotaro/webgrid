var term;

console.log_org = console.log
console.log = function(text) {
  if (term) {
    term.type("" + text)
    term.newLine()
    term.type("> ")
  }
  return console.log_org.apply(this, arguments)
}

function termOpen() {
  if ((!term) || (term.closed)) {
    term = new Terminal(
      {
        cols: 140,
        rows: 10,
        termDiv: 'terminal',
        bgColor: '#000000',
        greeting: '%+r **** Welcome to WebGrid Project **** %-r%n%n * please give me your CPU resources a little%n * for processing Prime Test%n ',
        handler: termHandler,
        exitHandler: termExitHandler
      }
    );
    term.open();
    
    // dimm UI text
    var mainPane = (document.getElementById)?
      document.getElementById('mainPane') : document.all.mainPane;
    if (mainPane) mainPane.className = 'lh15 dimmed';
  }
}

function termHandler() {
  // default handler + exit
  this.newLine();
  if (this.lineBuffer.search(/^\s*exit\s*$/i) == 0) {
    this.close();
    return;
  }
  else if (this.lineBuffer != '') {
    this.type('You typed: '+this.lineBuffer);
    this.newLine();
  }
  this.prompt();
}

function termExitHandler() {
  // reset the UI
  var mainPane = (document.getElementById)?
    document.getElementById('mainPane') : document.all.mainPane;
  if (mainPane) mainPane.className = 'lh15';
}


// demo hooks

function testInsertAsTypedText() {
  if ((!term) || (term.closed)) {
    alert('Please open a terminal first!');
    return;
  }
  var t=prompt('Please enter a text to be typed:');
  if (t) TermGlobals.insertText(t);
}

var useMultiLineImport=false;

function testMultiLine(funcFlag) {
  if ((!term) || (term.closed)) {
    alert('Please open a terminal first!');
    return;
  }
  // set flag for handler
  // if true, we'll use importMultiLineText(), else importEachLine()
  useMultiLineImport=funcFlag;
  
  // set global keylock (else no key stroke will reach the form element)
  TermGlobals.keylock = true;
  
  // and show the multiline prompt
  TermGlobals.setVisible('promptDiv', true);
  document.forms.promptForm.content.focus();
  // input will by handled by promptHandler
}

function promptHandler(text) {
  // hide the dialog
  TermGlobals.setVisible('promptDiv', false);
  
  // reset keylock and import the text
  TermGlobals.keylock = false;
  if (text) {
    if (useMultiLineImport) {
      TermGlobals.importMultiLine(text);
    }
    else {
      TermGlobals.importEachLine(text);
    }
  }
}
