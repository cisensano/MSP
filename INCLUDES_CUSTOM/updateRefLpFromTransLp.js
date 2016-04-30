function updateRefLpFromTransLp() {
	capLicenseResult = aa.licenseScript.getLicenseProf(capId);
	if (capLicenseResult.getSuccess())
		capLicenseArr = capLicenseResult.getOutput();
	else { 
		logDebug("**ERROR: getting lic prof: " + capLicenseResult.getErrorMessage()); 
		return false;
	}
	if (!capLicenseArr.length) {
		logDebug("WARNING: no license professional available on the application:"); 
		return false; 
	}
	licProfScriptModel = capLicenseArr[0];
	licModel = licProfScriptModel.getLicenseProfessionalModel();
	rlpId = licProfScriptModel.getLicenseNbr();//this is the transactional LP license number, at update this is the same as the refLP license number.
	logDebug("Current transactional license number " + rlpId);
	
	existingCarrier = rlpId;
	logDebug("Existing carrier = " + existingCarrier);
	
	if (true) {
		
		existingCarrierNum = existingCarrier;
		var newLic = getRefLicenseProf(existingCarrierNum);//gets the refLP by license number. Using the TSI field but can be switched to used the rlpId
		if (!newLic) {
			logDebug("Existing carrier " + existingCarrierNum + " not found"); return;
		}
		logDebug("Modifying existing carrier " + existingCarrierNum);
		
		// update existing ref lp with all data from tran LP except MPSC#
		newLic.setAddress1(licProfScriptModel.getAddress1());
		newLic.setAddress2(licProfScriptModel.getAddress2());
		newLic.setAddress3(licProfScriptModel.getAddress3());
		newLic.setContactFirstName(licProfScriptModel.getContactFirstName());
		newLic.setContactLastName(licProfScriptModel.getContactLastName());
		newLic.setContactMiddleName(licProfScriptModel.getContactMiddleName());
		newLic.setAgencyCode(licProfScriptModel.getAgencyCode());
		newLic.setAuditDate(licProfScriptModel.getAuditDate());
		newLic.setAuditID(licProfScriptModel.getAuditID());
		newLic.setAuditStatus(licProfScriptModel.getAuditStatus());
		newLic.setBusinessLicense(licProfScriptModel.getBusinessLicense());
		newLic.setBusinessName(licProfScriptModel.getBusinessName());
		newLic.setCity(licProfScriptModel.getCity());
		newLic.setCityCode(licProfScriptModel.getCityCode());
		newLic.setCountryCode(licProfScriptModel.getCountryCode());
		newLic.setCountry(licProfScriptModel.getCountry());
		newLic.setEinSs(licProfScriptModel.getEinSs());
		newLic.setEMailAddress(licProfScriptModel.getEmail());
		newLic.setFax(licProfScriptModel.getFax());
		newLic.setLicenseType(licProfScriptModel.getLicenseType());
		newLic.setLicOrigIssDate(licProfScriptModel.getLicesnseOrigIssueDate());
		newLic.setPhone1(licProfScriptModel.getPhone1());
		newLic.setPhone2(licProfScriptModel.getPhone2());
		newLic.setSelfIns(licProfScriptModel.getSelfIns());
		newLic.setState(licProfScriptModel.getState());
		newLic.setLicState(licProfScriptModel.getState());
		newLic.setSuffixName(licProfScriptModel.getSuffixName());
		newLic.setZip(licProfScriptModel.getZip());
		newLic.setFein(licProfScriptModel.getFein());
		newLic.setSocialSecurityNumber(licProfScriptModel.getSocialSecurityNumber());
		newLic.setMaskedSsn(licProfScriptModel.getMaskedSsn());
		// newLic.setLicenseBoard(licProfScriptModel.getLicenseBoard());
		newLic.setBusinessName2(licProfScriptModel.getBusName2());
		
		/* ASI to LP */
		if(AInfo["Worker's Compensation Exempt"] != null) {
			if (AInfo["Worker's Compensation Exempt"] == "Yes" || AInfo["Worker's Compensation Exempt"] == "Y") {
				newLic.setWcExempt("Y");
			}
			else
				newLic.setWcExempt("N");
		}
		if(AInfo["Operation Type"] != null) {
			newLic.setLicenseBoard(AInfo["Operation Type"]);
		}
		
		/* LP Template to LP Template */
		attrList = licProfScriptModel.getAttributes()
		for ( i in attrList ) {
			thisAttr = attrList[i]
			name = ""+thisAttr.getAttributeName(); val="";
			// Exclude fields updated by ASI
			if( !matches(name,"AUTO TRANSPORT","HAZ MAT CARRIER", "HOUSEHOLD GOODS AUTHORITY", "PORTABLE STORAGE UNITS", "CONTINUOUS CONTRACT")) {
				val = ""+thisAttr.getAttributeValue()
				editRefLicProfAttribute(rlpId,name,val == "null" ? null : val)
			}
			if (name == "CARGO INSURANCE EXP DATE" && val != "" && val != "null") {
				newLic.setBusinessLicExpDate(aa.date.parseDate(val));
			}
			if (name == "PL/PD INSURANCE EXP DATE" && val != "" && val != "null") {
				newLic.setInsuranceExpDate(aa.date.parseDate(val));
			}
		}

		/* ASI to LP Template */
		if(AInfo["Auto Transport"] != null) 
			editRefLicProfAttribute(rlpId,"AUTO TRANSPORT",AInfo["Auto Transport"])
		if(AInfo["Hazardous Material"] != null) 
			editRefLicProfAttribute(rlpId,"HAZ MAT CARRIER",AInfo["Hazardous Material"])
		if(AInfo["Household Goods Authority"] != null) 
			editRefLicProfAttribute(rlpId,"HOUSEHOLD GOODS AUTHORITY",AInfo["Household Goods Authority"])
		if(AInfo["Continuous Contract"] != null) 
			editRefLicProfAttribute(rlpId,"CONTINUOUS CONTRACT",AInfo["Continuous Contract"])
		if(AInfo["Portable Storage Units"] != null) 
			editRefLicProfAttribute(rlpId,"PORTABLE STORAGE UNITS",AInfo["Portable Storage Units"]);	
	}
	return rlpId
}