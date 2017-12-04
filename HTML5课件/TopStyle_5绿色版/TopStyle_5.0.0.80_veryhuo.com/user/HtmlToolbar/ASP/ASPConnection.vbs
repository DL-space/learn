Sub initUI() 
  document.forms(0).conn.focus()
End Sub

Function objectTag()	
  If document.forms(0).provider.value = 0 Then connstring= """Provider=Microsoft.Jet.OLEDB.4.0;Data Source="" & Server.Mappath(""" & document.forms(0).datasource.value & """)" End If
  If document.forms(0).provider.value = 1 Then connstring= """Provider=SQLOLEDB;Data Source=" & document.forms(0).datasource.value & ";Initial Catalog=" & document.forms(0).database.value & ";User Id=" & document.forms(0).uid.value & ";Password=" & document.forms(0).pwd.value & """" End If
  If document.forms(0).provider.value = 2 Then connstring= """Provider=SQLNCLI;Server=" & document.forms(0).datasource.value & ";Database=" & document.forms(0).database.value & ";Uid=" & document.forms(0).uid.value & ";Pwd=" & document.forms(0).pwd.value & """" End If
  If document.forms(0).provider.value = 3 Then connstring= """Provider=SQLNCLI;Server=" & document.forms(0).datasource.value & "\SQLEXPRESS;Database=" & document.forms(0).database.value & ";Uid=" & document.forms(0).uid.value & ";Pwd=" & document.forms(0).pwd.value & """" End If
  If document.forms(0).asptags.checked Then objectTag = "<% " End if
  objectTag = objectTag & "set " & document.forms(0).conn.value & " = Server.CreateObject(""ADODB.Connection"")" & vbcrlf & document.forms(0).conn.value & ".open " & connstring 
  If document.forms(0).asptags.checked Then objectTag = objectTag & "%>" End if
  objectTag = objectTag & vbcrlf  & vbcrlf  & vbcrlf
  If document.forms(0).asptags.checked Then objectTag = objectTag & "<% " End If
  objectTag = objectTag & document.forms(0).conn.value & ".close" & vbcrlf
  objectTag = objectTag & "set " & document.forms(0).conn.value & " = nothing"
  If document.forms(0).asptags.checked Then objectTag = objectTag & " %>" End If  
    
End Function

