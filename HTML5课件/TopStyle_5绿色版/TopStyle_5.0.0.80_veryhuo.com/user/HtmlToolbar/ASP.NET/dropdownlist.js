var TEXT_ID, CBOX_POSTBACK, TEXT_AKEY;

function initUI() {
  TEXT_ID = document.forms[0].idField;
  TEXT_AKEY = document.forms[0].aKey;
  CBOX_POSTBACK = document.forms[0].postBack;
  TEXT_ID.focus();
  TEXT_ID.select();
}

function objectTag() {
  var TAG = '<asp:DropDownList';

  TAG += ' id="' + TEXT_ID.value + '"';
    
  if (TEXT_AKEY.value != "")
    TAG += ' AccessKey="' + TEXT_AKEY.value + '"';

  if (CBOX_POSTBACK.checked)
    TAG += ' AutoPostBack="true"';

  TAG += ' runat="server">' + ts.getSelection(true) + '</asp:DropDownList>';
  
  return TAG;
}