/*
 * This sample is show how to handle result and send email to relative user after
 * finish one csv file for result inspections.
 *
 * Event Name:V360BatchResultInspectionAfter
 * Script Name:V360BatchResultInspectionAfter
 */
 
// Get errorMsg first.
var error = aa.env.getValue('ErrorMsg');
var errorCode = aa.env.getValue('ErrorCode');
var currentUserID = aa.env.getValue('CurrentUserID');
var announcementContent = "";

// This is a email template, use '$$*****$$' as the key that you want to replace, eg. $$USER_NAME$$.
// And use '<br>' as <br> char. Use the function 'fillParamInTemplate' to fill the value into the template.
// The map use to hold the key and the value, eg. 'USER_NAME, PUBLIUSER123', use aa.util.newHashMap() to get a map instance.
var contentTemplate = "Dear $$USER_NAME$$, <br><br> Inspection Result CSV <b>$$FILE_NAME$$</b> is performed completely.  Please see attached log file to see failed items.   This email is sent by system automatically. Please don't reply email. <br><br>NYC Building Department ";
var successContentTemplate = "Dear $$USER_NAME$$, <br><br> Inspection Result CSV <b>$$FILE_NAME$$</b> is performed successfully, <b>$$INSPECTION_NUMBER$$</b> inspection  have been resulted.   This email is sent by system automatically. Please don't reply email. <br><br>NYC Building Department ";
// This method is use a map to fill the value in the contentTemplate.
function fillParamInTemplate(contentTemplate, paramMap)
{
	 var keySet = paramMap.keySet();
   var strBuff = aa.util.newStringBuffer();
   strBuff.append(contentTemplate );
   for (var it = keySet.iterator(); it.hasNext();)
   {
      var keyName = it.next() ;
      var key = "$$" + keyName + "$$";
      var value = paramMap.get(keyName);
      var start = strBuff.indexOf(key);
      if (start != -1)
      {
         var end = start + key.length;
         strBuff.replace(start, end, value);
      }
   }
   return strBuff.toString();
}
// If errorCode is not null or '', it means that some error cause this operation fail. 
// The error code is:
// 'FILE_ERR' (The file name's suffix is not '.csv')
// 'HEADER_ERR' (Some columns are missing from system configuration)
// 'COLUMN_ERR' (Some columns are not config in system)
// 'UPLOAD_LOG_FAIL' (Log file upload fail)
// 'OTHER_ERR' (Other error cause fail, eg. network breakdown or DB error.
if (errorCode != '')
{
    var subject = 'The operation Result';
    var content = error;
    aa.alert.createAlertMessage(subject,content,currentUserID);
    var uploadDoc = aa.env.getValue('CSVDocument');
    
     // Change the document status as 'Executed';
    //uploadDoc.setDocStatus('Executed');
    aa.document.updateDocument(uploadDoc);
    
    // Get the user who upload the csv file to do result inspection.
    var uploadUserID = uploadDoc.getFileUpLoadBy();
    var uploadUser = aa.people.getSysUserByID(uploadUserID).getOutput();
    
    // Get current user 
    var currentUser = aa.people.getSysUserByID(currentUserID).getOutput();
    // Set your from email address.
    var from = '';
    var to = currentUser.getEmail() + ";" + uploadUser.getEmail()+";amy.bao@achievo.com"
    var cc = 'lucher.hu@achievo.com;carol.gong@achievo.com';	

    var list = aa.util.newArrayList();
    list.add(uploadDoc);
    // Start send email.
    aa.meeting.sendEmail(subject,content,from, to, cc, list);
    announcementContent = "The file " + uploadDoc.getFileName() + " fail to parse with flow error:<br> " + error;
    // Start send announcement.
    var result = aa.inspection.sendAnnouncement(uploadUser.getEmail(), subject, announcementContent, uploadUser.getUserID());
    if(result.getSuccess())
    {
			aa.print("--------send announcement success-------------");
    }
    aa.print(error);
}
else
{
    // Get inspection that result successfully.
    var inspList = aa.env.getValue('ResultInspectionList');
    // Get log for record that fail to result inspection.
    var logID = aa.env.getValue('LogDocumentID');
    var logDoc = aa.document.getDocumentByPK(logID).getOutput();
    
    // Get csv file that use for batch result inspection.
    var uploadDoc = aa.env.getValue('CSVDocument');
    // Set the document as 'Executed';
    //uploadDoc.setDocStatus('Executed');
    aa.document.updateDocument(uploadDoc);
    var uploadUserID = uploadDoc.getFileUpLoadBy();
    // Get user who is upload the csv file.
    var uploadUser = aa.people.getSysUserByID(uploadUserID).getOutput();
     
    // Get current user 
    var currentUser = aa.people.getSysUserByID(currentUserID).getOutput();
    // Set your from email address.
    var from = '';
    var to = currentUser.getEmail() + ";" + uploadUser.getEmail()+";amy.bao@achievo.com"
    var cc = 'lucher.hu@achievo.com;carol.gong@achievo.com';
    var content = '';
    var subject = 'The operation Result';
    var paramMap = aa.util.newHashMap();
    paramMap.put("USER_NAME",currentUser.getFullName());
    paramMap.put("FILE_NAME",uploadDoc.getFileName());
    var list = aa.util.newArrayList();
    if (logDoc != null)
    {
    	// Replace the template if some inspections result failure.
      content = fillParamInTemplate(contentTemplate, paramMap);
      announcementContent = "Agency approved inspection result CSV file " + uploadDoc.getFileName() + ", however some inspections failed to be updated because of some data issues. Please download log file in \"Log\" section to view error description. Once you fix the data issue, you can upload inspection result again.";
      list.add(logDoc);
    	aa.print(logDoc.getFileName());
    }
    else
    {
    	paramMap.put("INSPECTION_NUMBER",inspList.size() + "");
    	// Replace the template if all inspections result successfully.
    	content = fillParamInTemplate(successContentTemplate, paramMap);
    	announcementContent = "Agency approved inspection result CSV file " + uploadDoc.getFileName() + " successfully.";
    }
    
    // Start send email.
    aa.meeting.sendEmail(subject,content,from, to, cc, list);
    aa.print(uploadDoc.getFileName());
    aa.alert.createAlertMessage(subject,content,currentUserID);
    // Start send announcement.
    
    var result = aa.inspection.sendAnnouncement(uploadUser.getEmail(), subject, announcementContent, uploadUser.getUserID());
    if(result.getSuccess())
    {
			aa.print("--------send announcement success-------------");
    }
}

