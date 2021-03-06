
/* eslint-disable */
var bActiveX = false;

//哈希算法(const)
var SGD_SM3 = 1;
var SGD_SHA1 = 2;
var SGD_SHA256 = 4;
var hashAlg = SGD_SHA256;
//设置哈希算法，区分sha1和sha256
function ESeaL_SetHashAlg(nAlgCode){
	hashAlg = nAlgCode;
}

//获取证书
function ESeaL_GetUserCert(strCertID, cb) {
	GetSignCert(strCertID, cb);	
}

//获取签章
function ESeaL_GetStampPic(strCertID, cb) {
	GetEsealPic(strCertID, cb);
}

//签名
function ESeaL_SignHashData(strCertID, passwd, hashdata, cb) {	
	//获取证书
	var cert = null;	
	GetSignCert(strCertID, function(ret){
		cert = ret.retVal;
		if(cert==null || cert.length == 0)
			return;
	
		//判断证书类型
		var infoType = 3;//获取信息类型，3-证书类型，返回"RSA"或"SM2"
		var infoVal = null;
		GetCertBasicinfo(cert, infoType, function(ret){
			infoVal = ret.retVal;
			if(infoVal==null || infoVal.length == 0)
				return;
			
			if(infoVal != "RSA")
				hashAlg = 1;
			
			SignHashData(strCertID, hashdata, hashAlg, cb);
		});
	});		
}
//签名
function ESeaL_ClientSignByHash(json, cur_cert_id, passwd, cb) {
	if(json == "" || cur_cert_id == "") {
		alert("input error!");
		return;
	}
	if(!bActiveX){//websocket服务
		if(passwd == null || passwd == ""){
			alert("passwd error!");
			return;
		}
		//login in		
		VerifyUserPIN(cur_cert_id, passwd, function(ret1){
			var isLoginOK = false;
			isLoginOK = ret1.retVal;
			if(!isLoginOK) {
				alert("login failed!");
				return;
			}
			
			jsonStr = json;
			var jsonObj = JSON.parse(jsonStr);
			
			digestMessageArray = null;
			digestMessageArray = new Array();
			cur_Sign_index = 0;
			
			for(var i = 0; i < jsonObj.digestMessages.length; i++){
				var digestMessage = {}; // 
				digestMessage.signUniqueId = jsonObj.digestMessages[i].signUniqueId;
				digestMessage.fileUniqueId = jsonObj.digestMessages[i].fileUniqueId;
				digestMessageArray[i] = digestMessage;
				ESeaL_SignHashData(cur_cert_id,  passwd, jsonObj.digestMessages[i].hashData,function(ret){
					if(ret.retVal == "") {
						alert("passwd error");
						return;
					}
					digestMessageArray[cur_Sign_index].clientSignData = ret.retVal;
					cur_Sign_index++;
					if(cur_Sign_index == jsonObj.digestMessages.length) {
						// all sign ok;
						var digestMessages = {};
						digestMessages.digestMessages = digestMessageArray;
						var retObj = {retVal:(JSON.stringify(digestMessages)), ctx:null};
						cb(retObj);	
					}
				});					
			}
		});
		
		//if login , return. 
		return;
	}else{//控件	
		jsonStr = json;
		var jsonObj = JSON.parse(jsonStr);
		
		digestMessageArray = null;
		digestMessageArray = new Array();
		cur_Sign_index = 0;
		
		for(var i = 0; i < jsonObj.digestMessages.length; i++){
			var digestMessage = {}; // 
			digestMessage.signUniqueId = jsonObj.digestMessages[i].signUniqueId;
			digestMessage.fileUniqueId = jsonObj.digestMessages[i].fileUniqueId;
			digestMessageArray[i] = digestMessage;
			ESeaL_SignHashData(cur_cert_id,  passwd, jsonObj.digestMessages[i].hashData,function(ret){
				if(ret.retVal == "") {
					alert("passwd error");
					return;
				}
				digestMessageArray[cur_Sign_index].clientSignData = ret.retVal;
				cur_Sign_index++;
				if(cur_Sign_index == jsonObj.digestMessages.length) {
					// all sign ok;
					var digestMessages = {};
					digestMessages.digestMessages = digestMessageArray;
	
					//var retObj = {retVal:($.toJSON(digestMessages)), ctx:ctx};
					var retObj = {retVal:(JSON.stringify(digestMessages)), ctx:null};
					cb(retObj);				
				}
			});					
		}
	}
}
