var scheduleID;
var locationID;
var examDate;
var providerName = "For Alan2";
var examName = "Fredtest5";

var availableSchedulesResult = aa.examination.getAvailableSchedules(examName);
if(availableSchedulesResult.getSuccess())
{
		var availableSchedules = availableSchedulesResult.getOutput();
		for(var i=0; i<availableSchedules.size(); i++)
		{
			if(providerName == availableSchedules.get(i).getProviderName())
			{
				scheduleID = availableSchedules.get(i).getScheduleID();
				locationID = availableSchedules.get(i).getLocationID();
				examDate = availableSchedules.get(i).getStartTime();
				break;
			}
		}
}

if(scheduleID)
{
	var result = aa.examination.batchScheduleExam(scheduleID, examDate.getTime(), locationID, getCapIDList());
	if(result.getSuccess())
	{
	    var caps = result.getOutput();
	    for(var i=0; i < caps.size(); i++)
	    {
	    	aa.print(caps.get(i).toString());
	    }
	    aa.print(caps.size() + " Record(s) scheduled successfully.");
	}
	else
	{
		aa.print("No Record scheduled successfully.");
	}
}
else
{
	aa.print("No Record scheduled successfully.");
}

//Schedule for the first three Records of the assigned Record type.
function getCapIDList()
{
    var capIDList = aa.util.newArrayList();
   	var capIDsResult = aa.cap.getByAppType("Building", "Ethan", "Ethan", "Ethan");
   	if(capIDsResult.getSuccess())
   	{
   		var capIDs = capIDsResult.getOutput();
   		var count = 0;
   		for(var i=0; count<3 && i<capIDs.length; i++)
   		{
   			if(capIDs[i].isCompleteCap())
   			{
   				capIDList.add(capIDs[i].getCapID());
   				count++;
   			}
   			
   		}
   	}
    return capIDList;
}

