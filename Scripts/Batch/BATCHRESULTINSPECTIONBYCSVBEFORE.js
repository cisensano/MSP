/*
 * This sample is show how to change document status as 'In Progress' before
 * parsing csv document and result inspections.
 *
 * Event Name:V360BatchResultInspectionBefore
 * Script Name:V360BatchResultInspectionBefore
 */
 
// Get the document model use for batch result inspection.
var uploadDoc = aa.env.getValue('CSVDocument');
aa.print(uploadDoc.getFileName());
// Change the document status as 'In Progress' and update the document status.
//uploadDoc.setDocStatus('In Progress');
// if update status successfully, print 'update successfully' message.
var i = aa.document.updateDocument(uploadDoc).getOutput();
if (i > 0)
{
   aa.print('update successfully');
}
