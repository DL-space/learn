var TEXT_ID, TEXT_URL, TEXT_WIDTH, TEXT_HEIGHT, TEXT_TTIP, TEXT_CMDNAME, TEXT_CMDARG, TEXT_ALT, TEXT_AKEY;

function initUI() {
  TEXT_ID = document.forms[0].idField;
  TEXT_URL = document.forms[0].imgURL;
  TEXT_ALT = document.forms[0].altText;
  TEXT_TTIP = document.forms[0].toolTip;
  TEXT_CMDNAME = document.forms[0].commandName;
  TEXT_CMDARG = document.forms[0].commandArg;
  TEXT_WIDTH = document.forms[0].width;
  TEXT_HEIGHT = document.forms[0].height;
  TEXT_AKEY = document.forms[0].aKey;
  TEXT_ID.focus();
  TEXT_ID.select();
}

function objectTag() {
  var TAG = '<asp:ImageButton';
  
  if (TEXT_ID.value != "")
    TAG += ' id="' + TEXT_ID.value + '"';
  else
    TAG += ' id="|"';
    
  if (TEXT_ALT.value != "")
    TAG += ' AlternateText="' + TEXT_ALT.value + '"';

  if (TEXT_URL.value != "")
    TAG += ' ImageUrl="' + TEXT_URL.value + '"';

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