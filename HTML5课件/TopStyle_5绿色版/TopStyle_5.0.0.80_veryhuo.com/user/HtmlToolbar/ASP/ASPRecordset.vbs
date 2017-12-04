Sub initUI() 
  document.forms(0).sql.focus()
End Sub

Function objectTag()
  objectTag = document.forms(0).sql.value & " = """ & document.forms(0).sqlquery.value & """" & vbcrlf
  If document.forms(0).asptags.checked Then objectTag = "<% " & document.forms(0).sql.value & " = """ & document.forms(0).sqlquery.value & """" & vbcrlf End if
  objectTag = objectTag & "set " & document.forms(0).rs.value & " = Server.CreateObject(""ADODB.Recordset"")" & vbcrlf & document.forms(0).rs.value & ".open " & document.forms(0).sql.value & "," & document.forms(0).conn.value & "," & document.forms(0).CursorType.value & "," & document.forms(0).LockType.value 
  If document.forms(0).asptags.checked Then objectTag = objectTag & " %>" End If
  objectTag = objectTag & vbcrlf  & vbcrlf  & vbcrlf
  If document.forms(0).asptags.checked Then objectTag = objectTag & "<% " End If
  objectTag = objectTag & document.forms(0).rs.value & ".close" & vbcrlf
  objectTag = objectTag & "set " & document.forms(0).rs.value & " = nothing"
  If document.forms(0).asptags.checked Then objectTag = objectTag & " %>" End If  
    
End Function