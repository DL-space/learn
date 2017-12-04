var TEXT_ID, TEXT_TTIP, CBOX_POSTBACK, TEXT_AKEY;

function initUI() {
  TEXT_ID = document.forms[0].idField;
  TEXT_TTIP = document.forms[0].toolTip;
  TEXT_AKEY = document.forms[0].aKey;
  CBOX_POSTBACK = document.forms[0].postBack;
  TEXT_ID.focus();
  TEXT_ID.select();
}

function objectTag() {
  var TAG = '<asp:CheckBoxList';
  
  TAG += ' id="' + TEXT_ID.value + '"';
      
  if (TEXT_AKEY.value != "")
    TAG += ' AccessKey="' + TEXT_AKEY.value + '"';

  if (TEXT_TTIP.value != "")
    TAG += ' ToolTip="' + TEXT_TTIP.value + '"';

  if (CBOX_POSTBACK.checked)
    TAG += ' AutoPostBack="true"';

  TAG += ' runat="server">' + ts.getSelection(true) + '</asp:CheckBoxList>';
  
  return TAG;
}