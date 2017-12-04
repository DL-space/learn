var TEXT_ID, TEXT_WIDTH, TEXT_HEIGHT, TEXT_TTIP, TEXT_CMDNAME, TEXT_CMDARG, TEXT_TEXT, TEXT_AKEY;

function initUI() {
  TEXT_ID = document.forms[0].idField;
  TEXT_TEXT = document.forms[0].textField;
  TEXT_TTIP = document.forms[0].toolTip;
  TEXT_CMDNAME = document.forms[0].commandName;
  TEXT_CMDARG = document.forms[0].commandArg;
  TEXT_WIDTH = document.forms[0].width;
  TEXT_HEIGHT = document.forms[0].height;
  TEXT_AKEY = document.forms[0].accessKey;
  TEXT_ID.focus();
  TEXT_ID.select();
}

function objectTag() {
  var TAG = '<asp:Button';
  
  if (TEXT_ID.value != "")
    TAG += ' id="' + TEXT_ID.value + '"';
  else
    TAG += ' id="|"';
    
  if (TEXT_TEXT.value != "") {
    if (TEXT_TEXT.value.indexOf('<') != -1)
      TAG += " Text='" + TEXT_TEXT.value + "'"
    else
      TAG += ' Text="' + TEXT_TEXT.value + '"';
  }

  if (TEXT_WIDTH.value != "")
    TAG += ' Width="' + TEXT_WIDTH.value + '"';

  if (TEXT_HEIGHT.value != "")
    TAG += ' Height="' + TEXT_HEIGHT.value + '"';

  if (TEXT_TTIP.value != "")
    TAG += ' ToolTip="' + TEXT_TTIP.value + '"';

  if (TEXT_CMDARG.value != "")
    TAG += ' CommandArgument="' + TEXT_CMDARG.value + '"';

  if (TEXT_CMDNAME.value != "")
    TAG += ' CommandName="' + TEXT_CMDNAME.value + '"';

  if (TEXT_AKEY.value != "")
    TAG += ' AccessKey="' + TEXT_AKEY.value + '"';

  TAG += ' runat="server" />';
  
  return TAG;
}