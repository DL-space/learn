//---------------   GLOBAL VARIABLES   ---------------

var MSG_NEED_SMS = "Please enter a SMS number.";

//---------------     API FUNCTIONS    ---------------

function initUI() {
  if (ts.hasSelection())
    document.forms[0].text.value = ts.getSelection(false, true);
  document.forms[0].text.focus();
  document.forms[0].text.select();
}

function onOK() {
  var value = document.forms[0].sms.value;
  if (!value) {
    alert(MSG_NEED_SMS);
    document.forms[0].sms.focus();
    return false;
  }
  else
    return true;
}

function objectTag() {
  var sms = document.forms[0].sms.value;
  var text = document.forms[0].text.value;
  if (!text) text = sms;
  return '<a class="noeffect" href="sms:' + sms + '">' + text + '</a>';
}