//---------------   GLOBAL VARIABLES   ---------------

var MSG_NEED_EMAIL = "Please enter an e-mail address.";

//---------------     API FUNCTIONS    ---------------

function initUI() {
  if (ts.hasSelection())
    document.forms[0].text.value = ts.getSelection(false, true);
  document.forms[0].text.focus();
  document.forms[0].text.select();
}

function onOK() {
  var value = document.forms[0].address.value;
  if (!value) {
    alert(MSG_NEED_EMAIL);
    document.forms[0].address.focus();
    return false;
  }
  else
    return true;
}

function objectTag() {
  var address = document.forms[0].address.value;
  var text = document.forms[0].text.value;
  if (!text) text = address;
  return '<a class="noeffect" href="mailto:' + address + '">' + text + '</a>';
}