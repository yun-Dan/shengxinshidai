import XTXAB from './XTXSAB'
/* globals var */
var $_$sealImg = new Image;
var $_$bPos = false;
var $_$WebSocketConnectState = false;
var $_$WebSign_AppObj = null; // PDFClientLogin class Object
var $_$WebSign_WebSocketObj = null; // WebSocket class Object
var $_$WebSign_CurrentObj = null; // Current use class Object
var $_$Org_Data = ""; //data for sign
var $_$Signature = ""; //Signature
var $_$Org_Data_field_name = ""; //field name
var $_$Cur_CertID = ""; //data for sign
var $_$bReSign = false;
var $_$Seal_Pic_Main_Div_Name = "";
var $_$Seal_Pic_Div_Name = "";
var $_$Seal_Img_Name = "";
var $_$Signature_Element_Name = "";
var $_$OriginData_Element_Name = "";
var $_$Method_Element_Name = "";
var $_$Method_Name = "";
var $_$bJustShow = false;
var $_$bUseSHA256 = true;
var $_$SGD_SM3_RSA	= 0x00010001	//基于SM3算法和RSA算法的签名
var $_$SGD_SHA1_RSA	= 0x00010002	//基于SHA1算法和RSA算法的签名
var $_$SGD_SHA256_RSA = 0x00010004	//基于SHA256算法和RSA算法的签名
var $_$SGD_SM3_SM2 = 0x00020101	//基于SM2算法和SM3算法的签名
// const var
var $_$SELECT_OPTION_VALUE = "------select------";
var $_$container_Element_Name = "";
var cur_cert_id = "";

function $myOKRtnFunc(retVal, cb, ctx) {
    if (typeof cb === 'function') {
        var retObj = {
            retVal: retVal,
            ctx: ctx
        };
        cb(retObj);
    }
    return retVal;
}

function $myErrorRtnFunc(retVal, cb, ctx) {
    if (typeof cb === 'function') {
        var retObj = {
            retVal: retVal,
            ctx: ctx
        };
        cb(retObj);
    }
    return retVal;
}

/**
 * 用户列表选择框
 @param sealPicMainDivName 印章图片DIV外层DIV的id名
 @param sealDivName 印章图片DIV的id名
 */
function $SelectSealDlg(userListArray, sealPicMainDivName, sealDivName, sealImgName, bDrag, originDataElementName, signatureElementName, methodElementName){
	var msgWidth = 300;
	var msgHeight = 135;
	var borderColor = "#336699";
	var titleColor = "#99ccff";
  var titleHeight = 25;

    var sWidth = document.body.offsetWidth + document.body.scrollLeft;
    var sHeight = screen.height + document.body.scrollHeight;

	//背景div
	var bgObj = document.createElement("div");
	bgObj.setAttribute('id','bgDiv');
	bgObj.style.position="absolute";
	bgObj.style.top = "0";
	bgObj.style.background = "#777";
	bgObj.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75";
	bgObj.style.opacity = "0.6";
	bgObj.style.left = "0";
	bgObj.style.width = sWidth + "px";
	bgObj.style.height = sHeight + "px";
	bgObj.style.zIndex = "10000";
	document.body.appendChild(bgObj);

	//对话框div
	var msgObj = document.createElement("div");
	msgObj.setAttribute("id","msgDiv");
	msgObj.setAttribute("align","center");
	msgObj.style.background = "white";
	msgObj.style.border = "1px solid " + borderColor;
	msgObj.style.position = "absolute";
	msgObj.style.left = "50%";
	msgObj.style.top = "50%";
	msgObj.style.font = "12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
	msgObj.style.marginLeft = "-125px" ;
	msgObj.style.marginTop = -75 + document.body.scrollTop + "px";
	msgObj.style.width = msgWidth + "px";
	msgObj.style.height = msgHeight + "px";
	msgObj.style.textAlign = "center";
	msgObj.style.lineHeight = "25px";
	msgObj.style.zIndex = "10001";

	//创建一个h4对象（提示框标题栏）
	var title=document.createElement("h4");
	title.setAttribute("id","msgTitle");
	title.setAttribute("align","left");
	title.style.margin = "0";
	title.style.padding = "3px";
	title.style.background = borderColor;
	title.style.filter = "progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);";
	title.style.opacity = "0.75";
	title.style.border = "1px solid " + borderColor;
	title.style.height = "18px";
	title.style.font = "12px Verdana, Geneva, Arial, Helvetica, sans-serif";
	title.style.color = "white";
	title.style.cursor = "default";
	title.innerHTML = "网页签章";
/*
	//创建一个h4对象（提示框关闭按钮）
	var title2=document.createElement("lable");
	title2.setAttribute("id","msgTitle2");
	title2.setAttribute("align","right");
	title2.style.margin = "230";
	title2.style.padding = "3px";
	title2.style.background = borderColor;
	title2.style.filter = "progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);";
	title2.style.opacity = "0.75";
	title2.style.border = "1px solid " + borderColor;
	title2.style.height = "18px";
	title2.style.font = "12px Verdana, Geneva, Arial, Helvetica, sans-serif";
	title2.style.color = "white";
	title2.style.cursor = "pointer";
	title2.innerHTML = "X";
	title2.onclick = selectCancel;
	title.appendChild(title2);
*/
	var selectText = document.createElement("div") ;
	selectText.setAttribute("id","selectText");
	selectText.setAttribute("align","center");
	selectText.style.background = "white";
	selectText.style.position = "absolute";
	selectText.style.left = "8%";
	selectText.style.top = "25%";
	selectText.style.font = "12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
	selectText.innerHTML = "请选择印章：";

    function createSelect(name, list){
        var selectSeal = document.createElement("select");
        selectSeal.setAttribute("id","selectSeal");
        var firstOption = document.createElement("option");
        firstOption.value = $_$SELECT_OPTION_VALUE;
        firstOption.text = $_$SELECT_OPTION_VALUE;
		firstOption.innerHTML = $_$SELECT_OPTION_VALUE;
        selectSeal.appendChild(firstOption);

		for (i = 0; i < list.length; i++) {
			var certObj = list[i];
			var objItem = new Option(certObj.certName, certObj.certID);
			selectSeal.options.add(objItem);
		}
        return selectSeal;
    }
	selectText.appendChild(createSelect('------请选择------', userListArray));

	var buttonOK=document.createElement("input");//创建一个input对象（提示框按钮）
	//定义input的属性，即相当于
	//<input type="button" align="center" style="width:100px; align:center; margin-left:250px; margin-bottom:10px;" value="关闭">
	buttonOK.setAttribute("type","button");
	buttonOK.setAttribute("value","确定");
	buttonOK.style.width = "60px";
	buttonOK.style.height = "28px";
	buttonOK.style.align = "center";
	buttonOK.style.position = "absolute";
	buttonOK.style.left = "15%";
	buttonOK.style.top = "75%";
	buttonOK.style.background = borderColor;
	buttonOK.style.border = "1px solid "+ borderColor;
	buttonOK.style.color = "white";
	buttonOK.onclick = selectOK;
	function selectOK(){
	   	var selectObj = document.getElementById("selectSeal");
	   	cur_cert_id = selectObj.options[selectObj.selectedIndex].value; // 选中值

	   	document.getElementById("msgDiv").removeChild(selectText);
	   	document.body.removeChild(bgObj);//删除背景层Div
	   	document.body.removeChild(msgObj);//删除提示框层

		if(cur_cert_id === $_$SELECT_OPTION_VALUE){
			alert("证书选择错误!");
			return;
		}

		$_$Cur_CertID = cur_cert_id;
		if($_$Cur_CertID === "") {
			alert("CertID为空！");
			return;
		}
		GetPic($_$Cur_CertID, function(ret) {
			if (ret.retVal === "") {
				$GetLastErr();
				return;
			}
			var sealObj = document.getElementById(sealImgName);
			sealObj.src = "data:image/gif;base64," + ret.retVal;
			$_$sealImg.src = "data:image/gif;base64," + ret.retVal;
			//	parObj.appendChild($_$sealImg);
			if(bDrag) {
				document.getElementById(sealDivName).style.display = 'block';
				document.getElementById(sealPicMainDivName).style.display = 'block';
				$_$bPos = false;
				$_$bReSign = false;
				//$_$bJustShow = false;
			} else {
				$SignDataPKCS1(sealDivName, originDataElementName, signatureElementName, methodElementName);
			}
		}, null);

	}

		//取消
	var buttonCancel=document.createElement("input");//创建一个input对象（提示框按钮）
	//定义input的属性，即相当于
	//<input type="button" align="center" style="width:100px; align:center; margin-left:250px; margin-bottom:10px;" value="关闭">
	buttonCancel.setAttribute("type","button");
	buttonCancel.setAttribute("value","取消");
	buttonCancel.style.width = "60px";
	buttonCancel.style.height = "28px";
	buttonCancel.style.align = "center";
	buttonCancel.style.position = "absolute";
	buttonCancel.style.left = "65%";
	buttonCancel.style.top = "75%";
	buttonCancel.style.background = borderColor;
	buttonCancel.style.border = "1px solid "+ borderColor;
	buttonCancel.style.color = "white";
	buttonCancel.onclick = selectCancel;
	function selectCancel(){//点击标题栏触发的事件
	   cur_cert_id = "";

	 //  document.getElementById("msgDiv").removeChild(selectText);
	   document.body.removeChild(bgObj);//删除背景层Div
	   document.body.removeChild(msgObj);//删除提示框层

	   document.getElementById(sealDivName).style.display = 'none';
	}

	document.body.appendChild(msgObj);//在body内添加提示框div对象msgObj
	document.getElementById("msgDiv").appendChild(title);//在提示框div中添加标题栏对象title
	document.getElementById("msgDiv").appendChild(selectText);
	document.getElementById("msgDiv").appendChild(buttonCancel);//在提示框div中添加按钮对象button
	document.getElementById("msgDiv").appendChild(buttonOK);//在提示框div中添加按钮对象button
}

/**
 * 获取并显示印章图片
 @param sealPicMainDivName 印章图片DIV外层DIV的id名
 @param sealDivName 印章图片DIV的id名
 */
function $DragSeal(sealPicMainDivName, sealDivName, sealImgName) {
    //获取用户列表
    XTXAB.GetUserList(function(ret) {
			if (ret.retVal === "") {
				alert("没有发现用户key！258行");
				return;
			}
			var strUserList = ret.retVal;
			var allListArray = [];
			while (true) {
				var i = strUserList.indexOf("&&&");
				if (i <= 0 ) {
					break;
				}
				var strOneUser = strUserList.substring(0, i);
				var strName = strOneUser.substring(0, strOneUser.indexOf("||"));
				var strCertID = strOneUser.substring(strOneUser.indexOf("||") + 2, strOneUser.length);
				allListArray.push({certName:strName, certID:strCertID});

				var len = strUserList.length;
				strUserList = strUserList.substring(i + 3,len);
			}
			var userlist_length = allListArray.length;
			if(userlist_length === 0){
				alert("未能检测到usbkey！");
			} else if(userlist_length === 1){
				var certObj = allListArray[0];
				$_$Cur_CertID = certObj.certID;
				if($_$Cur_CertID === "") {
					alert("CertID为空！");
					return;
				}
				GetPic($_$Cur_CertID, function(ret) {
					if (ret.retVal === "") {
					$GetLastErr();
						return;
					}
					var sealObj = document.getElementById(sealImgName);
					sealObj.src = "data:image/gif;base64," + ret.retVal;
					$_$sealImg.src = "data:image/gif;base64," + ret.retVal;
					//	parObj.appendChild($_$sealImg);
					var sealDivObj = document.getElementById(sealDivName);
					sealDivObj.style.display = 'block';
					var parMainObj = document.getElementById(sealPicMainDivName);
					parMainObj.style.display = 'block';
					$_$bPos = false;
					$_$bReSign = false;
					//$_$bJustShow = false;
				}, null);
			} else{
				$SelectSealDlg(allListArray, sealPicMainDivName, sealDivName, sealImgName, true, null, null, null);
			}
		});
}

/**
 * 获取印章图片
 * @param strContainerName CertID
 */
function GetPic(strContainerName, cb, ctx) {
    if ($_$WebSign_WebSocketObj != null && $_$WebSign_WebSocketObj.ESeaL_GetStampPic != undefined) {
        return $_$WebSign_WebSocketObj.ESeaL_GetStampPic(strContainerName, cb, ctx);
    } else if ($_$WebSign_AppObj != null && $_$WebSign_AppObj.GetStampPicFromUKey != undefined) {
        return $_$WebSign_AppObj.GetStampPicFromUKey(strContainerName, cb, ctx);
    } else {
        return $myErrorRtnFunc("", cb, ctx);
    }
}

/**
 * 获取签章算法
 */
function GetSignMethod() {
	var sign_method_name;
    if ($_$WebSign_WebSocketObj != null ) {
        sign_method_name = $_$Method_Name;
    } else if ($_$WebSign_AppObj != null && $_$WebSign_AppObj.GetSignMethod != undefined) {
        $_$WebSign_AppObj.GetSignMethod(function(ret) {
			if (ret.retVal === "") {
				$GetLastErr();
				return;
			}
			sign_method_name = ret.retVal;
		}, null);
    }
    return sign_method_name;

}
/**
 * 插入一个印章
 @param stampID 印章ID，含有数字的字符串，用来区分不同印章。注意当一个页面多个印章时，数字不能重复
 @param container_name 容器div ID，默认为body
 @param field_name 待签名区域ID
 @param bDrag 是否拖拽印章，true：可拖拽印章，实现任意点插章；false：直接定点插章，不需要拖拽功能
 */
function ESeaL_InsertStamp(stampID, container_name, field_name, bDrag) {
	//清空Main div
	deleteSigDiv(stampID);

	//Main div
    var sealPicMainDivName = "sealPicMain" + stampID;
    var sealPicMainDiv = document.createElement("div");
    sealPicMainDiv.setAttribute('id', sealPicMainDivName);
    sealPicMainDiv.className = sealPicMainDivName;
    if(container_name) {
        var containerDiv = document.getElementById(container_name);
        if(containerDiv) {
            containerDiv.appendChild(sealPicMainDiv);
		}
    }
    else {
		container_name = "BODY";
        document.body.appendChild(sealPicMainDiv);
	}

	//印章div
    var sealDivName = "sealPicDiv" + stampID;
    var sealDiv = document.createElement("div");
    sealDiv.setAttribute('id', sealDivName);
    sealDiv.className = sealDivName;
    sealDiv.style.position = "absolute";
    sealDiv.style.left = "100px";
    sealDiv.style.top = "100px";
    sealDiv.style.display = "none";
    document.getElementById(sealPicMainDivName).appendChild(sealDiv);

	//图片
    var sealImgName = "sealImg" + stampID;
    var img = document.createElement('img');
    img.setAttribute('id', sealImgName);
    document.getElementById(sealDivName).appendChild(img);

	//签章数据
    var signatureElementName = "signatureElement" + stampID;
    var signatureElement = document.createElement("input");
    signatureElement.type = "hidden";
    signatureElement.setAttribute('id', signatureElementName);
    signatureElement.className = signatureElementName;
    document.getElementById(sealPicMainDivName).appendChild(signatureElement);

	//原文
    var originDataElementName = "originDataElement" + stampID;
    var originDataElement = document.createElement("input");
    originDataElement.type = "hidden";
    originDataElement.setAttribute('id', originDataElementName);
    originDataElement.className = originDataElementName;
    document.getElementById(sealPicMainDivName).appendChild(originDataElement);
    document.getElementById(originDataElementName).value = field_name;

	//算法标识
	var methodElementName = "methodElement" + stampID;
	var methodElement = document.createElement("input");
    methodElement.type = "hidden";
    methodElement.setAttribute('id', methodElementName);
    methodElement.className = methodElementName;
    document.getElementById(sealPicMainDivName).appendChild(methodElement);
	document.getElementById(methodElementName).value = "无信息";

	//容器ID
    var containerElementName = "containerElement" + stampID;
    var containerElement = document.createElement("input");
    containerElement.type = "hidden";
    containerElement.setAttribute('id', containerElementName);
    containerElement.className = containerElementName;
    document.getElementById(sealPicMainDivName).appendChild(containerElement);
	document.getElementById(containerElementName).value = container_name;

    $_$Seal_Pic_Main_Div_Name = sealPicMainDivName;
    $_$Seal_Pic_Div_Name = sealDivName;
    $_$Signature_Element_Name = signatureElementName;
    $_$OriginData_Element_Name = originDataElementName;
    $_$Seal_Img_Name = sealImgName;
	$_$Method_Element_Name = methodElementName;
	$_$container_Element_Name = containerElementName;
    var stampID = $_$Seal_Pic_Div_Name.substr(10);
    //创建右键菜单
    $CreateSignMenu(stampID);
    if(bDrag) {
    	//拖拽印章
    	$DragSeal($_$Seal_Pic_Main_Div_Name, $_$Seal_Pic_Div_Name, $_$Seal_Img_Name);
    	$_$bJustShow = false;
    } else {
        $_$bPos = false;
        $_$bReSign = false;
    }
	document.ondragstart=function() {return false;};
    return;
}

function deleteSigDiv(stampID) {
    var sealPicMainDivName = "sealPicMain" + stampID;
    var sealObj = document.getElementById(sealPicMainDivName);
    if (sealObj != null) sealObj.parentNode.removeChild(sealObj);
}

/**
 * 设置签名算法
 * @param strCertID:CertID
 */
/*
function ESeaL_SetSignMethod(strCertID){
	ExportUserSignCert(strCertID, function(ret) {
			if (ret.retVal === "") {
				// $AlertDlg("xtx签名失败！", 1);
				alert("xtx获取用户证书失败");
				return false;
			}
			GetCertInfo(ret.retVal, 3, function(ret2) {
					if (ret2.retVal === "") {
						// $AlertDlg("xtx签名失败！", 1);
						alert("xtx获取证书信息失败");
						return false;
					}
					if(ret2.retVal === "RSA") {
						if($_$bUseSHA256) {
							SetSignMethod($_$SGD_SHA256_RSA, function(ret3) {
									if (ret3.retVal != 0) {
									// $AlertDlg("xtx签名失败！", 1);
										alert("xtx设置签名算法失败");
										return false;
									}
									$_$Method_Name = "SHA256WithRSA";
									return true;
								});
						} else {
							$_$Method_Name = "SHA1WithRSA";
						}
					} else {
						SetSignMethod($_$SGD_SM3_SM2, function(ret3) {
								if (ret3.retVal != 0) {
								// $AlertDlg("xtx签名失败！", 1);
									alert("xtx设置签名算法失败");
									return false;
								}
								$_$Method_Name = "SM3WithSM2";
								return true;
							});
					}

				}, null);
        }, null);
	return true;
}
*/
function $SignData(strCertID, sealDivName, formData, cb) {
	var ctx = null;
	//2、xtx签名
    XTXAB.SignedData(strCertID, formData, function(ret) {
			if (ret.retVal === "") {
			// $AlertDlg("xtx签名失败！", 1);
				alert("xtx签名失败");
				if (!$_$bReSign) {
					document.getElementById(sealDivName).style.display = 'none';
					//	document.getElementById(sealDivName).style.backgroundImage = "";
				}
				return $myErrorRtnFunc("", cb, ctx);
			}
        XTXAB.SetSignMethod(0, function(ret2) {
					if (ret2.retVal != 0) {
					// $AlertDlg("xtx签名失败！", 1);
						alert("xtx设置签名算法失败");
						return $myErrorRtnFunc("", cb, ctx);
					}
					//3、拼接签名数据
					return $_$WebSign_WebSocketObj.ESeaL_GetSignature(strCertID, ret.retVal, cb, ctx);
				});
		});
}

/**
 * 签章
 * @param strCertID:CertID
 @param sealDivName 印章图片DIV的id名
 */
function ESeaL_Sign(strCertID, sealDivName, orgData, cb) {
    var ctx = null;
    if ($_$WebSign_WebSocketObj != null) {
        //1、获取待签名数据
        $_$WebSign_WebSocketObj.ESeaL_GetDataForSign(strCertID, orgData, function(ret) {
            if (ret.retVal === "") {
                //	alert("获取待签名数据失败");
               // $AlertDlg("获取待签名数据失败！", 1);
               $GetLastErr();
                if (!$_$bReSign) {
                    document.getElementById(sealDivName).style.display = 'none';
                    //	document.getElementById(sealDivName).style.backgroundImage = "";
                }
                return $myErrorRtnFunc("", cb, ctx);
            } else {
				//设置签名算法
                XTXAB.ExportUserSignCert(strCertID, function(ret2) {
					if (ret2.retVal === "") {
						// $AlertDlg("xtx签名失败！", 1);
						alert("xtx获取用户证书失败");
						return $myErrorRtnFunc("", cb, ctx);
					}
                    XTXAB.GetCertInfo(ret2.retVal, 3, function(ret3) {
							if (ret3.retVal === "") {
								// $AlertDlg("xtx签名失败！", 1);
								alert("xtx获取证书信息失败");
								return $myErrorRtnFunc("", cb, ctx);
							}
							if(ret3.retVal === "RSA") {
								if($_$bUseSHA256) {
                                    XTXAB.SetSignMethod($_$SGD_SHA256_RSA, function(ret4) {
											if (ret4.retVal != 0) {
											// $AlertDlg("xtx签名失败！", 1);
												alert("xtx设置签名算法失败");
												return $myErrorRtnFunc("", cb, ctx);
											}
											$_$Method_Name = "SHA256WithRSA";
											return $SignData(strCertID, sealDivName, ret.retVal, cb);
										});
								} else {
									$_$Method_Name = "SHA1WithRSA";
									return $SignData(strCertID, sealDivName, ret.retVal, cb);
								}
							} else {
                                XTXAB.SetSignMethod($_$SGD_SM3_SM2, function(ret5) {
										if (ret5.retVal != 0) {
										// $AlertDlg("xtx签名失败！", 1);
											alert("xtx设置签名算法失败");
											return $myErrorRtnFunc("", cb, ctx);
										}
										$_$Method_Name = "SM3WithSM2";
										return $SignData(strCertID, sealDivName, ret.retVal, cb);
									});
							}

						}, null);
					}, null);
            }
        }, ctx);
    } else if ($_$WebSign_AppObj != null && $_$WebSign_AppObj.SignEx != undefined) {
        return $_$WebSign_AppObj.SignEx(strCertID, orgData, true, cb, ctx);
    } else {
        return $myErrorRtnFunc("", cb, ctx);
    }
}

/**
 * 密码框
 @param sealPicMainDivName 印章图片DIV外层DIV的id名
 @param sealDivName 印章图片DIV的id名
 */
function $PassWdDlg(sealDivName, org_data, signatureElementName, signMethodElementName){
    var msgWidth = 300;
    var msgHeight = 220;

    var borderColor = "#336699";
    var titleColor = "#99ccff";
    var titleHeight = 25;
    var sWidth = document.body.offsetWidth + document.body.scrollLeft;
    var sHeight = screen.height + document.body.scrollHeight;
    //背景div
    var bgObj = document.createElement("div");
    bgObj.setAttribute('id', 'bgDiv');
    bgObj.style.position = "fixed";
    bgObj.style.left = "0";
    bgObj.style.top = "0";
    bgObj.style.background = "#777";
    bgObj.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75";
    bgObj.style.opacity = "0.6";
    bgObj.style.width = sWidth + "px";
    bgObj.style.height = sHeight + "px";
    bgObj.style.zIndex = "10000";
    document.body.appendChild(bgObj);
    //对话框div
    var msgObj = document.createElement("div");
    msgObj.setAttribute("id", "msgDiv");
    msgObj.setAttribute("align", "center");
    msgObj.style.background = "white";
    // msgObj.style.border = "1px solid " + borderColor;
    msgObj.style.position = "fixed";
    msgObj.style.left = "50%";
    msgObj.style.top = "200px";
    msgObj.style.font = "12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
    msgObj.style.marginLeft = "-125px";
    msgObj.style.marginTop = -75 + document.body.scrollTop+ "px";
    msgObj.style.width = msgWidth + "px";
    msgObj.style.height = msgHeight + "px";
    msgObj.style.textAlign = "center";
    msgObj.style.lineHeight = "25px";
    msgObj.style.zIndex = "10001";
    document.body.appendChild(msgObj); //在body内添加提示框div对象msgObj
    //创建一个h4对象（提示框标题栏）
    var title = document.createElement("h3");
    title.setAttribute("id", "msgTitle");
    title.setAttribute("align", "left");
    title.style.margin = "0";
    title.style.padding = "20px 0";
    // title.style.background = borderColor;
    // title.style.opacity = "0.75";
    // title.style.border = "1px solid " + borderColor;
    title.style.height = "20px";
    title.style.textAlign = "center";
    title.style.font = "18px Verdana, Geneva, Arial, Helvetica, sans-serif";
    title.style.color = "#303133";
    title.style.cursor = "default";
    title.innerHTML = "请输入密码";
    document.getElementById("msgDiv").appendChild(title); //在提示框div中添加标题栏对象title
	//密码框
	var passwdInput = document.createElement("input") ;
	passwdInput.setAttribute("id","passwdInput");
	passwdInput.setAttribute("type","password");
	passwdInput.setAttribute("align","left");
	passwdInput.setAttribute("maxlength","16");
	passwdInput.style.margin = "10px 0 0";
   // passwdInput.style.padding = "6px";
  passwdInput.style.height = "40px";
	passwdInput.style.width = "250px";
	// passwdInput.style.position = "absolute";
	// passwdInput.style.left = "10%";
	// passwdInput.style.top = "35%";
	passwdInput.style.padding = "0 6px";
	passwdInput.style.border = "1px solid #ccc";
	passwdInput.style.borderRadius = "4px";
	document.getElementById("msgDiv").appendChild(passwdInput);

	//确定
	var buttonOK=document.createElement("input");//创建一个input对象（提示框按钮）
	//定义input的属性，即相当于
	//<input type="button" align="center" style="width:100px; align:center; margin-left:250px; margin-bottom:10px;" value="关闭">
	buttonOK.setAttribute("type","button");
	buttonOK.setAttribute("value","确 定");
	buttonOK.style.width = "74px";
	buttonOK.style.height = "40px";
	buttonOK.style.align = "center";
	buttonOK.style.position = "absolute";
	buttonOK.style.left = "22%";
	buttonOK.style.top = "65%";
	buttonOK.style.background = '#409EFF';
	buttonOK.style.border = "1px solid #409EFF";
	buttonOK.style.color = "white";
	buttonOK.style.borderRadius = "4px";
	buttonOK.onclick = selectOK;
	document.getElementById("msgDiv").appendChild(buttonOK);//在提示框div中添加按钮对象button
	function selectOK(){
		var strPin = passwdInput.value;
		if (strPin === "") {
			alert("请输入用户口令");
			passwdInput.focus();
			return;
		}

		//登录
        XTXAB.VerifyUserPIN($_$Cur_CertID, strPin, function(strRes) {
			if (!strRes.retVal) {
				alert("密码错误!");
				passwdInput.focus();
				return;
			}
			document.body.removeChild(bgObj);//删除背景层Div
			document.body.removeChild(msgObj);//删除提示框层
		//	alert("校验PIN成功!\r\n");
		//	ESeaL_SetCertID(strCertID);

			//再签章
			ESeaL_Sign($_$Cur_CertID, sealDivName, org_data, function(ret) {
				if (ret.retVal === "") {
					$GetLastErr();
					//$AlertDlg("获取签名数据失败!", 1);
					//	alert("获取签名数据失败!");
					if (!$_$bReSign) {
						document.getElementById(sealDivName).style.display = 'none';
						//	document.getElementById(sealDivName).style.backgroundImage = "";
					}
				} else {
					document.getElementById(sealDivName).style.display = 'block';
					// alert("签名成功！");
					//$AlertDlg("签名成功！", 1);
					$_$Signature = ret.retVal;
					//	alert($_$Signature);
					document.getElementById(signatureElementName).value = $_$Signature;
					var sign_method = "";
					sign_method = GetSignMethod();
					if(sign_method === "") {
						return;
					}
					document.getElementById(signMethodElementName).value = sign_method;
					$_$bReSign = true;
				}
			});
		});
	}

	//取消
	var buttonCancel=document.createElement("input");//创建一个input对象（提示框按钮）
	//定义input的属性，即相当于
	//<input type="button" align="center" style="width:100px; align:center; margin-left:250px; margin-bottom:10px;" value="关闭">
	buttonCancel.setAttribute("type","button");
	buttonCancel.setAttribute("value","取 消");
	buttonCancel.style.width = "74px";
	buttonCancel.style.height = "40px";
	buttonCancel.style.align = "center";
	buttonCancel.style.position = "absolute";
	buttonCancel.style.left = "52%";
	buttonCancel.style.top = "65%";
	buttonCancel.style.background = "#fff";
	buttonCancel.style.border = "1px solid #DCDFE6";
	buttonCancel.style.color = "#606266";
	buttonCancel.style.borderRadius = "4px";
	buttonCancel.onclick = selectCancel;
	document.getElementById("msgDiv").appendChild(buttonCancel);//在提示框div中添加按钮对象button
	function selectCancel(){//点击标题栏触发的事件
	   cur_cert_id = "";

	 //  document.getElementById("msgDiv").removeChild(passwdInput);
	   document.body.removeChild(bgObj);//删除背景层Div
	   document.body.removeChild(msgObj);//删除提示框层
	   document.getElementById(sealDivName).style.display = 'none';
	}
}

/**
 * 签章
 @param sealDivName 印章图片DIV的id名
 */
function $SignDataPKCS1(sealDivName, originDataElementName, signatureElementName, signMethodElementName) {
    /*
    if($_$Org_Data_field_name === "") {
    	alert("请先设置表单名称！");
    	return;
    }
    ESeaL_SetOrgDataEx($_$Org_Data_field_name);

    if($_$Org_Data === "") {
    	alert("表单原数据为空！");
    	return;
    }
    */
    var Org_Data_field_name = document.getElementById(originDataElementName).value;
    if (Org_Data_field_name === "") {
        //$AlertDlg("表单原数据标签ID为空！", 1);
        alert("表单原数据标签ID为空！");
        return;
    }
    var org_data = document.getElementById(Org_Data_field_name).value;
    if (org_data === "") {
        //$AlertDlg("表单原数据为空！", 1);
        /**@@@@@@@此处判断签章的必要条件**/
        // alert("表单原数据为空！");
        // return;
    }
    if ($_$Cur_CertID === "") {
        //$AlertDlg("CertID为空！", 1);
        alert("CertID为空！");
        return;
    }

	//先登录
	$PassWdDlg(sealDivName, org_data, signatureElementName, signMethodElementName);
}
/**
 * 验章
 * @param sealDivName 印章DIV的id名
 * @param originDataElementName 原文DIV的id名
 * @param signatureElementName 签章数据DIV的id名
 * @param sealImgName 图片DIV的id名
 * @param stampID 印章对象的ID，不可为空
 * @param elementID 标签ID，即希望印章相对于该标签进行定位，不可为空
 * @param offsetX 印章相对elementID标签的相对横向位移，不可为空
 * @param offsetY 印章相对elementID标签的相对纵向位移，不可为空
 */
function $VerifyPKCS1(sealDivName, originDataElementName, signatureElementName, methodElementName, sealImgName, stampID, elementID, offsetX, offsetY) {
    /*
    	if($_$Org_Data_field_name === "") {
    		alert("请先设置表单名称！");
    		return;
    	}
    	ESeaL_SetOrgDataEx($_$Org_Data_field_name);

    	if($_$Org_Data === "") {
    		alert("表单原数据为空！");
    		return;
    	}
    	*/
    var ctx = null;
    var Org_Data_field_name = document.getElementById(originDataElementName).value;
    if (Org_Data_field_name === "") {
        //$AlertDlg("表单原数据标签ID为空！", 1);
        alert("表单原数据标签ID为空！");
        return;
    }
    var org_data = document.getElementById(Org_Data_field_name).value;
    if (org_data === "") {
        //$AlertDlg("表单原数据为空！", 1);
        alert("表单原数据为空！");
        return;
    }
    var signdata = document.getElementById(signatureElementName).value;
    //alert(signdata);
    if (signdata === "") {
        //$AlertDlg("签章数据为空！", 1);
        alert("签章数据为空！");
        return;
    }

	var method_name = document.getElementById(methodElementName).value;
    if (method_name === "") {
		method_name = "无信息";
    }

    if ($_$WebSign_WebSocketObj != null) {
        $_$WebSign_WebSocketObj.ESeaL_Verify(org_data, signdata, function(ret) {
            if (ret.retVal === "true") {
				var sInfo = "验证成功，数据有效！\r\n" + "签名算法：" + method_name;
                 // alert(sInfo);
                //$AlertDlg("验证成功，数据有效！", 1);
                //return;
            } else {
				var sInfo = "验证失败，数据无效！\r\n" + "签名算法：" + method_name;
                alert(sInfo);
               //  alert("验证失败，数据无效！");
               // $AlertDlg("验证失败，数据无效！", 1);
            }
            $_$WebSign_WebSocketObj.ESeaL_GetStampPicAfterVerified(ret.retVal, signdata, function(ret2) {
                if (ret2.retVal) {
                    //	var parObj = document.getElementById(sealDivName);
                    //	parObj.dataSrc = "url(data:image/gif;base64,"+ret2.retVal+")";
                    var sealObj = document.getElementById(sealImgName);
                    sealObj.src = "data:image/gif;base64," + ret2.retVal;
                    $_$sealImg.src = "data:image/gif;base64," + ret2.retVal;

					if(elementID != null) {
						ESeaL_SetOffsetPos(stampID, elementID, offsetX, offsetY, true);
					}

					var sealDivObj = document.getElementById(sealDivName);
					sealDivObj.style.display = 'block';
                } else {
                    $GetLastErr();
                    //$AlertDlg("获取验签后的印章图片失败！", 1);
                }
            }, ctx);
        }, ctx);
    } else if ($_$WebSign_AppObj != null && $_$WebSign_AppObj.Verify != undefined && $_$WebSign_AppObj.GetStampPicAfterVerified != undefined) {
        $_$WebSign_AppObj.Verify(org_data, signdata, function(ret) {
            if (ret.retVal) {
				var sInfo = "验证成功，数据有效！\r\n" + "签名算法：" + method_name;
                // alert(sInfo);
               // alert("验证成功，数据有效！");
                //$AlertDlg("验证成功，数据有效！", 1);
                $_$WebSign_AppObj.GetStampPicAfterVerified(function(ret2) {
                    if (ret2.retVal != "") {
                        var sealObj = document.getElementById(sealImgName);
                        sealObj.src = "data:image/gif;base64," + ret2.retVal;
                        $_$sealImg.src = "data:image/gif;base64," + ret2.retVal;

						if(elementID != null) {
							ESeaL_SetOffsetPos(stampID, elementID, offsetX, offsetY, true);
						}

						var sealDivObj = document.getElementById(sealDivName);
						sealDivObj.style.display = 'block';
                    } else {
                        $GetLastErr();
                        //$AlertDlg("获取验签后的印章图片失败！", 1);
                    }
                }, ctx);
            } else {
				var sInfo = "验证失败，数据无效！\r\n" + "签名算法：" + method_name;
                alert(sInfo);
             //   alert("验证失败，数据无效！");
                //$AlertDlg("验证失败，数据无效！", 1);
                $_$WebSign_AppObj.GetStampPicAfterVerified(function(ret) {
                    if (ret.retVal != "") {
                        var sealObj = document.getElementById(sealImgName);
                        sealObj.src = "data:image/gif;base64," + ret.retVal;
                        $_$sealImg.src = "data:image/gif;base64," + ret.retVal;

						if(elementID != null) {
							ESeaL_SetOffsetPos(stampID, elementID, offsetX, offsetY, true);
						}

						var sealDivObj = document.getElementById(sealDivName);
						sealDivObj.style.display = 'block';
                    } else {
                        $GetLastErr();
                        //$AlertDlg("获取验签后的印章图片失败！", 1);
                    }
                }, ctx);
            }
        }, ctx);
    } else {
        return;
    }
}
/**
 * 撤章
 * @param cur_cert_id:CertID
 * @param signature:签名值
 @param sealDivName 印章图片DIV的id名
 */
function $CheckRemoveRight(signatureElementName, sealDivName) {
    var ctx = null;
    var signdata = document.getElementById(signatureElementName).value;
    //alert(signdata);
    if (signdata === "") {
        //$AlertDlg("签章数据为空！", 1);
        alert("签章数据为空！");
        return;
    }
	if (sealDivName === "") {
        //$AlertDlg("签章数据为空！", 1);
        alert("签章DIV异常！");
        return;
    }
    var stampID = sealDivName.substr(10);
    if ($_$WebSign_WebSocketObj != null) {
        //1、获取待签名数据
        $_$WebSign_WebSocketObj.ESeaL_CheckRemoveRight(signdata, function(ret) {
            if (ret.retVal === "true") {
                document.getElementById(sealDivName).style.display = 'none';
				deleteSigDiv(stampID);
               // $AlertDlg("撤销签章成功！", 1);
                alert("撤销签章成功！");
            } else if (ret.retVal === "") {
                $GetLastErr();
               // $AlertDlg("内部出现错误，请查看日志！", 1);
                //	alert("U-KEY不存在，或者当前key不是已登录key！");
            } else {
               // $AlertDlg(ret.retVal, 2);
               alert(ret.retVal);
            }
        }, ctx);
    } else if ($_$WebSign_AppObj != null && $_$WebSign_AppObj.CheckRemoveRight != undefined) {
        $_$WebSign_AppObj.CheckRemoveRight(signdata, function(ret) {
            if (ret.retVal === "true") {
                document.getElementById(sealDivName).style.display = 'none';
				deleteSigDiv(stampID);
            //    $AlertDlg("撤销签章成功！", 1);
                alert("撤销签章成功！");
            } else if (ret.retVal === "") {
                $GetLastErr();
               // $AlertDlg("内部出现错误，请查看日志！", 1);
                //	alert("U-KEY不存在，或者当前key不是已登录key！");
            } else {
            //    $AlertDlg(ret.retVal, 2);
            alert(ret.retVal);
            }
        }, ctx);
    } else {
        return;
    }
}
/**
 * 显示证书信息
 * @param signatureElementName:签名值DIV ID
 */
function $ShowUserCerInfo(signatureElementName) {
    var ctx = null;
    var signdata = document.getElementById(signatureElementName).value;
    //alert(signdata);
    if (signdata === "") {
        //$AlertDlg("签章数据为空！", 1);
        alert("签章数据为空！");
        return;
    }
    if ($_$WebSign_WebSocketObj != null) {
        $_$WebSign_WebSocketObj.ESeaL_ShowUserCerInfo(signdata, function(ret) {
            if (ret.retVal === "") {
                $GetLastErr();
                //   alert("获取证书失败");
               // $AlertDlg("显示证书失败!", 1)
                //return;
            } else {
                //   alert("显示证书！");
               // alert(ret.retVal);
                $AlertDlg(ret.retVal, 2)
            }
        }, ctx);
    } else if ($_$WebSign_AppObj != null && $_$WebSign_AppObj.ShowSignerCertInfoEx != undefined) {
        $_$WebSign_AppObj.ShowSignerCertInfoEx(signdata, function(ret) {
            if (ret.retVal === "") {
                $GetLastErr();
               // alert("获取证书失败");
               // $AlertDlg("显示证书失败!", 1)
                //return;
            } else {
               // alert(ret.retVal);
                $AlertDlg(ret.retVal, 2)
            }
        }, ctx);
    } else {
        return;
    }
}
/**
 * 显示签章时间
 * @param signDataString:签名值
 */
function $ShowSignTime(signatureElementName) {
    var ctx = null;
    var signdata = document.getElementById(signatureElementName).value;
    //alert(signdata);
    if (signdata === "") {
        //$AlertDlg("签章数据为空！", 1);
        alert("签章数据为空！");
        return;
    }
    if ($_$WebSign_WebSocketObj != null) {
        $_$WebSign_WebSocketObj.ESeaL_ShowSignTime(signdata, function(ret) {
            if (ret.retVal === "") {
                $GetLastErr();
                //   alert("获取时间失败");
                //$AlertDlg("显示时间失败!", 1)
                //return;
            } else {
                //alert(ret.retVal);
                $AlertDlg(ret.retVal, 1);
            }
        }, ctx);
    } else if ($_$WebSign_AppObj != null && $_$WebSign_AppObj.ShowSignTimeEx != undefined) {
        $_$WebSign_AppObj.ShowSignTimeEx(signdata, function(ret) {
            if (ret.retVal === "") {
                $GetLastErr();
                //   alert("获取时间失败");
                //$AlertDlg("显示时间失败!", 1)
                //return;
            } else {
                //alert(ret.retVal);
                $AlertDlg(ret.retVal, 1);
            }
        }, ctx);
    } else {
        return;
    }
}
/**
 * 关于
 */
function $GetVersion() {
    var ctx = null;
    if ($_$WebSign_WebSocketObj != null) {
        $_$WebSign_WebSocketObj.ESeaL_GetGetVersion(function(ret) {
            if (ret.retVal === "") {
                $GetLastErr();
                //    alert("获取版本号失败");
                //$AlertDlg("获取版本号失败", 1);
                //return;
            } else {
                //alert("BJCA网页签章V" + ret.retVal);
                $AlertDlg("BJCA网页签章V" + ret.retVal, 1);
            }
        }, ctx);
    } else if ($_$WebSign_AppObj != null && $_$WebSign_AppObj.GetVersion != undefined) {
        $_$WebSign_AppObj.GetVersion(function(ret) {
            if (ret.retVal === "") {
                $GetLastErr();
                //    alert("获取版本号失败");
                //$AlertDlg("获取版本号失败", 1);
                //return;
            } else {
                //alert("BJCA网页签章V" + ret.retVal);
                $AlertDlg("BJCA网页签章V" + ret.retVal, 1);
            }
        }, ctx);
    } else {
        return;
    }
}
/**
 * 获取最近一次错误信息
 */
function $GetLastErr() {
    var ctx = null;
    if ($_$WebSign_WebSocketObj != null) {
        $_$WebSign_WebSocketObj.ESeaL_GetLastErr(function(ret) {
            if (ret.retVal === "") {
                alert("获取错误信息失败");
               // $AlertDlg("获取版本号失败", 1);
                //return;
            } else {
                alert(ret.retVal);
                //$AlertDlg(ret.retVal, 1);
            }
        }, ctx);
    } else if ($_$WebSign_AppObj != null && $_$WebSign_AppObj.GetLastErr != undefined) {
        $_$WebSign_AppObj.GetLastErr(function(ret) {
            if (ret.retVal === "") {
                alert("获取错误信息失败");
                //$AlertDlg("获取版本号失败", 1);
                //return;
            } else {
                alert(ret.retVal);
                //$AlertDlg(ret.retVal, 1);
            }
        }, ctx);
    } else {
        return;
    }
}
/**
 * 设置CertID
 * @param cur_cert_id:CertID
 */
function ESeaL_SetCertID(cert_id) {
    //$_$Cur_CertID = "";
    //$GetSignStampPic();
    $_$Cur_CertID = "";
    if (cert_id === "") {
      //  $AlertDlg("CertID为空！", 1);
        	alert("请先登录！");
        return;
    }
    $_$Cur_CertID = cert_id;
}
/**
 * 设置待签名的原始数据
 * @param field_name 待签名的原始数据所在表单元素名称
 */
function ESeaL_SetOrgDataEx(stampID, field_name) {
    $_$Org_Data = "";
    if (field_name === "") {
        //$AlertDlg("表单名称为空！", 1);
        alert("表单名称为空！");
        return;
    }
    var originDataElementName = "originDataElement" + stampID;
    document.getElementById(originDataElementName).value = field_name;

    var org_data = document.getElementById(field_name).value;
    if (org_data === "") {
        //$AlertDlg("表单原数据为空！", 1);
        alert("表单原数据为空！");
        return;
    }
    $_$Org_Data_field_name = field_name;
    $_$Org_Data = org_data;
}
/**
 * 设置待签名的原始数据
 * @param org_data 待签名的原始数据
 */
function ESeaL_SetOrgData(org_data) {
    $_$Org_Data = org_data;
}
/**
 * 设置印章数据
 * @param stampID 印章对象的ID，不可为空
 * @param field_name 原文区域的标签ID，不可为空
 * @param signature_data 签章数据，不可为空
 * @param method_name 签章算法名称
 * @param elementID 标签ID，即希望印章相对于该标签进行定位，不可为空
 * @param offsetX 印章相对elementID标签的相对横向位移，不可为空
 * @param offsetY 印章相对elementID标签的相对纵向位移，不可为空
 */
function ESeaL_SetData(stampID, field_name, signature_data, method_name, elementID, offsetX, offsetY) {
    // if ((stampID === "") || (field_name === "") || (signature_data === "") || (elementID === "") || (offsetX === "") || (offsetY === "")) {
    //     //$AlertDlg("ID名称不能为空！", 1);
    //     alert("参数不可为空！");
    //     return;
    // }

    $_$Signature = signature_data;
    $_$Signature_Element_Name = "signatureElement" + stampID;
    document.getElementById($_$Signature_Element_Name).value = $_$Signature;
	$_$Method_Element_Name = "methodElement" + stampID;
	document.getElementById($_$Method_Element_Name).value = method_name;

    //验证
    $_$OriginData_Element_Name = "originDataElement" + stampID;
    document.getElementById($_$OriginData_Element_Name).value = field_name;
    $_$Seal_Pic_Main_Div_Name = "sealPicMain" + stampID;
    $_$Seal_Pic_Div_Name = "sealPicDiv" + stampID;
    $_$Seal_Img_Name = "sealImg" + stampID;

    $VerifyPKCS1($_$Seal_Pic_Div_Name, $_$OriginData_Element_Name, $_$Signature_Element_Name, $_$Method_Element_Name, $_$Seal_Img_Name, stampID, elementID, offsetX, offsetY);

    $_$bJustShow = true;
    $_$bPos = true;
}

/**
 * 设置印章位置并签章
 * @param stampID 印章对象的ID，不可为空
 * @param elementID 标签ID，即希望印章相对于该标签进行定位，不可为空
 * @param offsetX 印章相对elementID标签的相对横向位移，不可为空
 * @param offsetY 印章相对elementID标签的相对纵向位移，不可为空
 */
function ESeaL_SetSealPosAndSign(stampID, elementID, offsetX, offsetY) {
	if ((stampID === "") || (elementID === "") || (offsetX === "") || (offsetY === "")) {
        //$AlertDlg("ID名称不能为空！", 1);
        alert("参数不可为空！");
        return;
    }
	//获取用户列表
    XTXAB.GetUserList(function(ret) {
			if (ret.retVal === "") {
        	alert("没有发现用户key！");
        	return;
        }
			var strUserList = ret.retVal;
			var allListArray = [];
			while (true) {
				var i = strUserList.indexOf("&&&");
				if (i <= 0 ) {
					break;
				}
				var strOneUser = strUserList.substring(0, i);
				var strName = strOneUser.substring(0, strOneUser.indexOf("||"));
				var strCertID = strOneUser.substring(strOneUser.indexOf("||") + 2, strOneUser.length);
				allListArray.push({certName:strName, certID:strCertID});
				var len = strUserList.length;
				strUserList = strUserList.substring(i + 3,len);
			}
			var userlist_length = allListArray.length;

			$_$Seal_Pic_Main_Div_Name = "sealPicMain" + stampID;
			$_$OriginData_Element_Name = "originDataElement" + stampID;
			$_$Seal_Pic_Div_Name = "sealPicDiv" + stampID;
			$_$Seal_Img_Name = "sealImg" + stampID;
			$_$Signature_Element_Name = "signatureElement" + stampID;
			$_$Method_Element_Name = "methodElement" + stampID;
			if(userlist_length === 0){
				alert("未能检测到usbkey！");
			} else if(userlist_length === 1){
				var certObj = allListArray[0];
				$_$Cur_CertID = certObj.certID;
				if($_$Cur_CertID === "") {
					alert("CertID为空！");
					return;
				}
				GetPic($_$Cur_CertID, function(ret) {
					if (ret.retVal === "") {
					$GetLastErr();
						return;
					}
					var sealObj = document.getElementById($_$Seal_Img_Name);
					sealObj.src = "data:image/gif;base64," + ret.retVal;
					$_$sealImg.src = "data:image/gif;base64," + ret.retVal;
					//	parObj.appendChild($_$sealImg);
				//	var sealDivObj = document.getElementById(sealDivName);
					//sealDivObj.style.display = 'block';
				//	var parMainObj = document.getElementById(sealPicMainDivName);
				//	parMainObj.style.display = 'block';
					$SignDataPKCS1($_$Seal_Pic_Div_Name, $_$OriginData_Element_Name, $_$Signature_Element_Name, $_$Method_Element_Name);
				}, null);
			} else{
				$SelectSealDlg(allListArray, $_$Seal_Pic_Main_Div_Name, $_$Seal_Pic_Div_Name, $_$Seal_Img_Name, false, $_$OriginData_Element_Name, $_$Signature_Element_Name, $_$Method_Element_Name);
			}
		});

	/*
    $_$Signature = signature_data;
    $_$Signature_Element_Name = "signatureElement" + stampID;
    document.getElementById($_$Signature_Element_Name).value = $_$Signature;

    //验证
    $_$OriginData_Element_Name = "originDataElement" + stampID;
    document.getElementById($_$OriginData_Element_Name).value = field_name;
    $_$Seal_Pic_Main_Div_Name = "sealPicMain" + stampID;
    $_$Seal_Pic_Div_Name = "sealPicDiv" + stampID;
    $_$Seal_Img_Name = "sealImg" + stampID;
    $VerifyPKCS1($_$Seal_Pic_Div_Name, $_$OriginData_Element_Name, $_$Signature_Element_Name, $_$Seal_Img_Name, stampID, elementID, offsetX, offsetY);
*/
	ESeaL_SetOffsetPos(stampID, elementID, offsetX, offsetY, false);
    $_$bJustShow = true;
    $_$bPos = true;
}

/**
 * 获取签名数据
 @param stampID 印章对象的ID
 */
function ESeaL_GetSignatureData(stampID) {
	$_$Signature_Element_Name = "signatureElement" + stampID;
	var SignatureObj = document.getElementById($_$Signature_Element_Name);
	if(SignatureObj) {
		$_$Signature = SignatureObj.value;
		return $_$Signature;
	} else {
		alert("签章值为空！");
		return "";
	}
}

/**
 * 获取签名算法
 @param stampID 印章对象的ID
 */
function ESeaL_GetMethod(stampID) {
	$_$Method_Element_Name = "methodElement" + stampID;
	var MethodObj = document.getElementById($_$Method_Element_Name);
		if(MethodObj) {
		var methodName = MethodObj.value;
		return methodName;
	} else {
		alert("签名算法为空！");
		return;
	}
}

/**
 * 获取原文
 @param stampID 印章对象的ID
 */
function ESeaL_GetOrgData(stampID) {
	$_$OriginData_Element_Name = "originDataElement" + stampID;
	var OrgElementObj = document.getElementById($_$OriginData_Element_Name);
	if(OrgElementObj) {
		var OrgDataObj = document.getElementById(OrgElementObj.value);
		$_$Org_Data = OrgDataObj.value;
		return $_$Org_Data;
	} else {
		alert("原文数据为空！");
		return "";
	}
}

 /**
 * 获取印章图片
 @param stampID 印章对象的ID
 */
function ESeaL_GetPic(stampID) {
	var imgName = "sealImg" + stampID;
	var imgElementObj = document.getElementById(imgName);
	if(imgElementObj) {
		var imgDataSrc = imgElementObj.src;
		var imgData = imgDataSrc.substr(22);
		return imgData;
	} else {
		alert("原文数据为空！");
		return "";
	}
}

 /**
* 获取当前标签相对于页面的横向坐标
@param e 标签对象
*/
function getLeft(e) {
    var offset = e.offsetLeft;
    // if (e.offsetParent != null) offset += getLeft(e.offsetParent);
    return offset;
}

 /**
* 获取当前标签相对于页面的纵向坐标
@param e 标签对象
*/
function getTop(e) {
    var offset = e.offsetTop;
    if (e.offsetParent != null) offset += getTop(e.offsetParent);
    return offset;
}
/**
* 设置相对标签的位置
@param stampID 印章ID，含有数字的字符串，用来区分不同印章。注意当一个页面多个印章时，数字不能重复
@param elementID 标签ID
@param offsetX 印章相对elementID标签的相对横向位移
@param offsetY 印章相对elementID标签的相对纵向位移
*/
function ESeaL_SetOffsetPos(stampID, elementID, offsetX, offsetY, bDrag) {
    var seal_pic_div_name = "sealPicDiv" + stampID;
    var seal_img_name = "sealImg" + stampID;
	var container_Element_Name = "containerElement" + stampID;
    var sealPic = document.getElementById(seal_pic_div_name);
    var sealImg = window.document.getElementById(seal_img_name);
	var ele = document.getElementById(elementID);
	var containerDIV = window.document.getElementById(container_Element_Name);
	if(bDrag) {
		if(sealImg === null || $_$sealImg.src === "") {
		//	console.log(containerDIV,sealPic,sealImg,"sealImg.src:"+$_$sealImg.src)
			return;
		}
	}
	if(containerDIV === null || sealPic === null ) {
	//	console.log(containerDIV,sealPic,sealImg,"sealImg.src:"+$_$sealImg.src)
		return;
	}

	var offsetLeft = offsetX;
	var offsetTop = offsetY;
	if(ele != null) {
		//标签相对页面左上角的绝对坐标
		var rtElementLeft, rtElementTop;
		rtElementLeft = getLeft(ele);
		rtElementTop = getTop(ele);
		offsetLeft += rtElementLeft;
		offsetTop += rtElementTop;
	}

	if(containerDIV.value === "BODY") {
		sealPic.style.left = offsetLeft + "px";
		sealPic.style.top = offsetTop + "px";
	} else {
		var containerObj = window.document.getElementById(containerDIV.value);
		if (containerObj === null)
			return;

		//容器相对页面左上角的绝对坐标
		var containerObj = document.getElementById(containerDIV.value);
		var containerElementLeft, containerElementTop;
		containerElementLeft = getLeft(containerObj);
		containerElementTop = getTop(containerObj);

		//再计算相对坐标
		sealPic.style.left = offsetLeft - containerElementLeft + "px";
		sealPic.style.top = offsetTop - containerElementTop + "px";
	}
    return;
}

function $checkBrowserISIE() {
    return (!!window.ActiveXObject || 'ActiveXObject' in window) ? true : false;
}
/**
 * 提示框
 * @param content 提示框显示的信息内容
 * @param type 2：证书信息显示框   其他：常规信息显示框
 */
function $AlertDlg(content, type) {
    var msgWidth = 300;
    var msgHeight = 165;
    if (type === 2) {
        msgHeight = 250;
    }
    var borderColor = "#336699";
    var titleColor = "#99ccff";
    var titleHeight = 25;
    var sWidth = document.body.offsetWidth + document.body.scrollLeft;
    var sHeight = screen.height + document.body.scrollHeight;
    //背景div
    var bgObj = document.createElement("div");
    bgObj.setAttribute('id', 'bgDiv');
    bgObj.style.position = "absolute";
    bgObj.style.left = "0";
    bgObj.style.top = "0";
    bgObj.style.background = "#777";
    bgObj.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75";
    bgObj.style.opacity = "0.6";
    bgObj.style.width = sWidth + "px";
    bgObj.style.height = sHeight + "px";
    bgObj.style.zIndex = "10000";
    document.body.appendChild(bgObj);
    //对话框div
    var msgObj = document.createElement("div");
    msgObj.setAttribute("id", "msgDiv");
    msgObj.setAttribute("align", "center");
    msgObj.style.background = "white";
    msgObj.style.border = "1px solid " + borderColor;
    msgObj.style.position = "absolute";
    msgObj.style.left = "50%";
    msgObj.style.top = "50%";
    msgObj.style.font = "12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
    msgObj.style.marginLeft = "-125px";
    msgObj.style.marginTop = -75 + document.body.scrollTop + "px";
    msgObj.style.width = msgWidth + "px";
    msgObj.style.height = msgHeight + "px";
    msgObj.style.textAlign = "center";
    msgObj.style.lineHeight = "25px";
    msgObj.style.zIndex = "10001";
    document.body.appendChild(msgObj); //在body内添加提示框div对象msgObj
    //创建一个h4对象（提示框标题栏）
    var title = document.createElement("h3");
    title.setAttribute("id", "msgTitle");
    title.setAttribute("align", "left");
    title.style.margin = "0";
    title.style.padding = "3px";
    title.style.background = borderColor;
    //	title.style.filter = "progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);";
    title.style.opacity = "0.75";
    title.style.border = "1px solid " + borderColor;
    title.style.height = "18px";
    title.style.font = "12px Verdana, Geneva, Arial, Helvetica, sans-serif";
    title.style.color = "white";
    title.style.cursor = "default";
    title.innerHTML = "提示";
    if (type === 2) {
        title.innerHTML = "证书信息";
    }
    document.getElementById("msgDiv").appendChild(title); //在提示框div中添加标题栏对象title
    /*
    	//创建一个对象（提示框关闭按钮）
    	var title2=document.createElement("lable");
    	title2.setAttribute("id","msgTitle2");
    	title2.setAttribute("align","right");
    	title2.style.margin = "250";
    	title2.style.padding = "3px";
    	title2.style.background = borderColor;
    //	title2.style.filter = "progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);";
    	title2.style.opacity = "0.75";
    	title2.style.border = "1px solid " + borderColor;
    	title2.style.height = "18px";
    	title2.style.font = "14px Verdana, Geneva, Arial, Helvetica, sans-serif";
    	title2.style.color = "white";
    	title2.style.cursor = "pointer";
    	if(type === 2) {
    		title2.style.left = "90%";
    		title2.style.top = "10%";
    	}
    	title2.innerHTML = "X";
    	title2.onclick = selectCancel;
    	title.appendChild(title2);
    	function selectCancel(){//点击标题栏触发的事件
    	   document.getElementById("msgDiv").removeChild(title);
    	   document.getElementById("msgDiv").removeChild(info);
    	   document.body.removeChild(bgObj);//删除背景层Div
    	   document.body.removeChild(msgObj);//删除提示框层
    	}
    	*/
    var info = document.createElement("div");
    info.setAttribute("id", "info");
    info.setAttribute("align", "left");
    info.style.background = "white";
    info.style.position = "absolute";
    info.style.left = "15%";
    info.style.top = "40%";
    info.style.right = "15%";
    if (type === 2) {
        info.style.left = "7%";
        info.style.top = "20%";
        info.style.right = "7%";
    }
    info.style.font = "12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
    var ind = content.indexOf("\r\n");
    if (ind > 0) {
        var temp_content = content;
        var s1 = "",
            s2 = "",
            sCon = "";
        while (ind > 0) {
            s1 = temp_content.substring(0, ind);
            s2 = temp_content.substring(ind + 2, temp_content.length);
            sCon += s1 + "<br/>";
            temp_content = s2;
            ind = temp_content.indexOf("\r\n");
        }
        sCon += s2;
        info.innerHTML = sCon;
    } else {
        info.innerHTML = content;
    }
    var buttonOK = document.createElement("input"); //创建一个input对象（提示框按钮）
    //定义input的属性，即相当于
    //<input type="button" align="center" style="width:100px; align:center; margin-left:250px; margin-bottom:10px;" value="关闭">
    buttonOK.setAttribute("type", "button");
    buttonOK.setAttribute("value", "确定");
    buttonOK.style.width = "60px";
    buttonOK.style.height = "28px";
    buttonOK.style.align = "center";
    buttonOK.style.position = "absolute";
    buttonOK.style.left = "40%";
    buttonOK.style.top = "75%";
    buttonOK.style.background = borderColor;
    buttonOK.style.border = "1px solid " + borderColor;
    buttonOK.style.color = "white";
    if (type === 2) {
        buttonOK.style.top = "80%";
    }
    buttonOK.onclick = selectOK;

    function selectOK() {
        document.getElementById("msgDiv").removeChild(title);
        document.getElementById("msgDiv").removeChild(info);
        document.body.removeChild(bgObj); //删除背景层Div
        document.body.removeChild(msgObj); //删除提示框层
    }
    document.getElementById("msgDiv").appendChild(info);
    document.getElementById("msgDiv").appendChild(buttonOK); //在提示框div中添加按钮对象button
}
/**
 * IE11下注册监听函数
 * @param strObjName 控件对象名称
 * @param eventName 事件名称
 * @param callbackFunName 回调方法名称
 */
function $AttachForIE11Event(strObjName, eventName, callbackFunName) {
    var handler = document.createElement("script");
    handler.setAttribute("for", strObjName);
    handler.setAttribute("event", eventName);
    handler.appendChild(document.createTextNode(callbackFunName));
    document.body.appendChild(handler);
}
/**
 * 加载一个控件
 * @param CLSID 控件的CLSID
 * @param ctlName 控件对象名称
 * @param testFuncName 测试方法名称
 * @param addEvent 是否增加回调函数
 * @param OnSignCallbackFun 签章回调函数
 * @param OnSignCallbackFunString 签章回调函数字符串
 * @param OnVerifyCallbackFun 验章回调函数
 * @param OnVerifyCallbackFunString 验章回调函数字符串
 * @param OnSignRemovedCallbackFun 撤章回调函数
 * @param OnSignRemovedCallbackFunString 撤章回调函数字符串
 */
function $LoadControl(CLSID, ctlName, testFuncName, addEvent, OnSignCallbackFun, OnSignCallbackFunString, OnVerifyCallbackFun, OnVerifyCallbackFunString, OnSignRemovedCallbackFun, OnSignRemovedCallbackFunString) {
    var pluginDiv = document.getElementById("pluginDiv" + ctlName);
    if (pluginDiv) {
        //return true;
        document.body.removeChild(pluginDiv);
        pluginDiv.innerHTML = "";
        pluginDiv = null;
    }
    pluginDiv = document.createElement("div");
    pluginDiv.id = "pluginDiv" + ctlName;
    document.body.appendChild(pluginDiv);
    try {
        if ($checkBrowserISIE()) { // IE
            if (window.navigator.platform === "Win32") //codeBase="BJCAWebSign.CAB#version=4,1,0,0"
                pluginDiv.innerHTML = '<object id="' + ctlName + '" classid="CLSID:' + CLSID + '" codeBase="BJCAWebSign.CAB" style="POSITION: absolute; TOP: 10px; LEFT: 10px;"> <PARAM NAME="Visible" VALUE="false"> </object>';
            else pluginDiv.innerHTML = '<object id="' + ctlName + '" classid="CLSID:' + CLSID + '" codeBase="BJCAWebSignX64.CAB" style="POSITION: absolute; TOP: 10px; LEFT: 10px;"> <PARAM NAME="Visible" VALUE="false"> </object>';
            if (addEvent) {
                var clt = eval(ctlName);
                if (clt.attachEvent) {
                    clt.attachEvent("OnSign", OnSignCallbackFun);
                    clt.attachEvent("OnVerify", OnVerifyCallbackFun);
                    clt.attachEvent("OnSignRemoved", OnSignRemovedCallbackFun);
                } else { // IE11 not support attachEvent, and addEventListener do not work well, so addEvent ourself
                    $AttachForIE11Event(ctlName, "OnSign", OnSignCallbackFunString);
                    $AttachForIE11Event(ctlName, "OnVerify", OnVerifyCallbackFunString);
                    $AttachForIE11Event(ctlName, "OnSignRemoved", OnSignRemovedCallbackFunString);
                    //clt.addEventListener("OnUsbKeyChange", $OnUsbKeyChange, false);
                }
            }
        } else {
            var chromeVersion = window.navigator.userAgent.match(/Chrome\/(\d+)\./);
            if (chromeVersion && chromeVersion[1]) {
                if (parseInt(chromeVersion[1], 10) >= 42) { // not support npapi return false
                    document.body.removeChild(pluginDiv);
                    pluginDiv.innerHTML = "";
                    pluginDiv = null;
                    return false;
                }
            }
            pluginDiv.innerHTML = '<embed id=' + ctlName + ' type=application/x-xtx-axhost clsid={' + CLSID + '} width=0 height=0 />';
        }
        if (testFuncName != null && testFuncName != "") {
            if (eval(ctlName + "." + testFuncName) === undefined) {
                document.body.removeChild(pluginDiv);
                pluginDiv.innerHTML = "";
                pluginDiv = null;
                return false;
            }
        }
        return true;
    } catch (e) {
        document.body.removeChild(pluginDiv);
        pluginDiv.innerHTML = "";
        pluginDiv = null;
        return false;
    }
}
/**
 * 创建网页签章控件对象
 * @param objectIDString 提示框显示的信息内容
 * @param OnSignCallbackFun 签章回调函数
 * @param OnSignCallbackFunString 签章回调函数字符串
 * @param OnVerifyCallbackFun 验章回调函数
 * @param OnVerifyCallbackFunString 验章回调函数字符串
 * @param OnSignRemovedCallbackFun 撤章回调函数
 * @param OnSignRemovedCallbackFunString 撤章回调函数字符串
 */
function CreateAppObject_WebSign(objectIDString, OnSignCallbackFun, OnSignCallbackFunString, OnVerifyCallbackFun, OnVerifyCallbackFunString, OnSignRemovedCallbackFun, OnSignRemovedCallbackFunString) {
    var bOK = $LoadControl("820390E5-1C07-483D-AEED-6A0EDF640AA2", objectIDString, null, false, OnSignCallbackFun, OnSignCallbackFunString, OnVerifyCallbackFun, OnVerifyCallbackFunString, OnSignRemovedCallbackFun, OnSignRemovedCallbackFunString);
    if (!bOK) {
        return null;
    }
    var o = new Object();
    var clt = eval(objectIDString);
    o.Sign = function(plainstring, cb, ctx) {
        var ret = clt.Sign(plainstring);
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.Verify = function(plainstring, signDataString, cb, ctx) {
        var ret = clt.Verify(plainstring, signDataString);
        return $myOKRtnFunc(ret, cb, ctx);
    };
    /*
    	o.ConvertSampleSeal = function() {
    		return clt.RemoveSign();
    	};
    */
    o.SetCtrlPos = function(x, y, cb, ctx) {
        var ret = clt.SetCtrlPos(x, y);
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.SetOffsetPos = function(posRelativeElementIDString, x, y, cb, ctx) {
        var ret = clt.SetOffsetPos(posRelativeElementIDString, x, y);
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.SetDisplayRect = function(left, top, width, height, cb, ctx) {
        var ret = clt.SetDisplayRect(left, top, width, height);
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.ShowLastVerifyResult = function(cb, ctx) {
        var ret = clt.ShowLastVerifyResult();
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.GetSignature = function(cb, ctx) {
        var ret = clt.GetSignature();
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.SetSignature = function(signValue, cb, ctx) {
        var ret = clt.SetSignature(signValue);
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.IsSigned = function(cb, ctx) {
        var ret = clt.IsSigned();
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.SetVisible = function(bVisible, cb, ctx) {
        var ret = clt.SetVisible(bVisible);
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.GetVisible = function(cb, ctx) {
        var ret = clt.GetVisible();
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.IsKeyReady = function(cb, ctx) {
        var ret = clt.IsKeyReady();
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.SignFormFields = function(formname, elementname, bsilence, cb, ctx) {
        var ret = clt.SignFormFields(formname, elementname, bsilence);
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.VerifyFormFields = function(cb, ctx) {
        var ret = clt.VerifyFormFields();
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.GetSignTime = function(cb, ctx) {
        var ret = clt.GetSignTime();
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.GetStampPicAfterVerified = function(cb, ctx) {
        var ret = clt.GetStampPicAfterVerified();
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.SetWebServiceURL = function(strData, cb, ctx) {
        var ret = clt.SetWebServiceURL(strData);
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.ShowSignerCertInfo = function(cb, ctx) {
        var ret = clt.ShowSignerCertInfo();
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.RemoveESign = function(bAlertMsg, cb, ctx) {
        var ret = clt.RemoveESign(bAlertMsg);
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.ShowSignerCertInfoEx = function(strSignature, cb, ctx) {
        var ret = clt.ShowSignerCertInfoEx(strSignature);
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.AboutBox = function(cb, ctx) {
        var ret = "";
        clt.AboutBox();
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.GetStampPicFromUKey = function(strCertID, cb, ctx) {
        var ret = clt.GetStampPicFromUKey(strCertID);
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.ShowSignTimeEx = function(strSignature, cb, ctx) {
        var ret = clt.ShowSignTimeEx(strSignature);
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.CheckRemoveRight = function(strSignature, cb, ctx) {
        var ret = clt.CheckRemoveRight(strSignature);
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.SignEx = function(strCertID, plainstring, bAlertMsg, cb, ctx) {
        var ret = clt.SignEx(strCertID, plainstring, bAlertMsg);
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.GetVersion = function(cb, ctx) {
        var ret = clt.GetVersion();
        return $myOKRtnFunc(ret, cb, ctx);
    };
    o.GetLastErr = function(cb, ctx) {
        var ret = clt.GetLastErr();
        return $myOKRtnFunc(ret, cb, ctx);
    };
	o.GetSignMethod = function(cb, ctx) {
        var ret = clt.GetSignMethod();
        return $myOKRtnFunc(ret, cb, ctx);
    };
    return o;
}
/**
 * 创建网页签章webSocket对象
 */
function CreateWebSocketObject_WebSign() {
    var o = new Object();
    o.ws_obj = null;
    o.ws_heartbeat_id = 0;
    o.ws_queue_id = 0; // call_cmd_id
    o.ws_queue_list = {}; // call_cmd_id callback queue
    o.ws_queue_ctx = {};
    o.xtx_version = "";
    o.load_websocket = function() {
        //说明，是否用TLS/SSL，根据url给的ws/wss及端口号来定，端口号固定(21051/21061)
        var ws_url;
        ws_url = "ws://127.0.0.1:21051/websign/"; //非TLS/SSL
        //ws_url = "wss://127.0.0.1:21061/xtxapp/";
        try {
            o.ws_obj = new WebSocket(ws_url);
        } catch (e) {
         //   console.log(e);
            return;
        }
        //   o.ws_queue_list["onUsbkeyChange"] = $OnUsbKeyChange;
        o.ws_obj.onopen = function(evt) {
            clearInterval(o.ws_heartbeat_id);
            //   o.callMethod("SOF_GetVersion", function(str){o.xtx_version = str.retVal;});
            o.ws_heartbeat_id = setInterval(function() {
                //   o.callMethod("SOF_GetVersion", function(str){});
            }, 10 * 1000);
            //    XTXAB.GetUserList($pushAllDropListBox);
            $_$WebSocketConnectState = true;
        };
        o.ws_obj.onclose = function(evt) {};
        o.ws_obj.onmessage = function(evt) {
            var res = JSON.parse(evt.data);
            if (res['set-cookie']) {
                document.cookie = res['set-cookie'];
            }
            //登录失败
            //            if(res['loginError'])
            //           {
            //              alert(res['loginError']);
            //         }
            var call_cmd_id = res['call_cmd_id'];
            if (!call_cmd_id) {
                return;
            }
            var execFunc = o.ws_queue_list[call_cmd_id];
            if (typeof(execFunc) != 'function') {
                return;
            }
            var ctx = o.ws_queue_ctx[res['call_cmd_id']];
            ctx = ctx || {
                returnType: "string"
            };
            var ret;
            if (ctx.returnType === "bool") {
                ret = res.retVal === "true" ? true : false;
            } else if (ctx.returnType === "number") {
                ret = Number(res.retVal);
            } else {
                ret = res.retVal;
            }
            var retObj = {
                retVal: ret,
                ctx: ctx
            };
            execFunc(retObj);
            if (res['call_cmd_id'] != "onUsbkeyChange") {
                delete o.ws_queue_list[res['call_cmd_id']];
            }
            delete o.ws_queue_ctx[res['call_cmd_id']];
        };
        o.ws_obj.onerror = function(evt) {
            o.load_websocket();
        };
        return true;
    };
    o.sendMessage = function(sendMsg) {
        if (o.ws_obj.readyState === WebSocket.OPEN) {
            o.ws_obj.send(JSON.stringify(sendMsg));
        } else {
            console.log("Can't connect to WebSocket server!");
        }
    };
    o.callMethod = function(strMethodName, cb, ctx, returnType, argsArray) {
        o.ws_queue_id++;
        if (typeof(cb) === 'function') {
            o.ws_queue_list['i_' + o.ws_queue_id] = cb;
            ctx = ctx || {};
            ctx.returnType = returnType;
            o.ws_queue_ctx['i_' + o.ws_queue_id] = ctx;
        }
        var sendArray = {};
        sendArray['cookie'] = document.cookie;
        sendArray['websign_func_name'] = strMethodName;
        //get sessionid
        sendArray['call_cmd_id'] = 'i_' + o.ws_queue_id;
        if (o.xtx_version >= "2.16") {
            sendArray['URL'] = window.location.href;
        }
        if (arguments.length > 4) {
            sendArray["param"] = argsArray;
        }
        if (o.ws_obj.readyState === WebSocket.OPEN) {
            o.sendMessage(sendArray)
        } else if (o.ws_obj.readyState != WebSocket.CONNECTING) {
            o.load_websocket();
            setTimeout(o.sendMessage(sendArray), 500);
        }
    };
    //	o.ESeaL_Sign = function(strCertID, plainstring, cb, ctx) {
    //		var paramArray = [strCertID, plainstring];
    //		ctx = null;
    //		returnType = null;
    //		o.callMethod('ESeaL_Sign', cb, ctx, returnType, paramArray);
    //	};
    o.ESeaL_Verify = function(plainstring, signDataString, cb, ctx) {
        var paramArray = [plainstring, signDataString];
        ctx = null;
        var returnType = null;
        o.callMethod('ESeaL_Verify', cb, ctx, returnType, paramArray);
    };
    o.ESeaL_ShowUserCerInfo = function(signDataString, cb, ctx) {
        var paramArray = [signDataString];
        ctx = null;
        var returnType = null;
        o.callMethod('ESeaL_ShowUserCerInfo', cb, ctx, returnType, paramArray);
    };
    o.ESeaL_ShowSignTime = function(signDataString, cb, ctx) {
        var paramArray = [signDataString];
        ctx = null;
        var returnType = null;
        o.callMethod('ESeaL_ShowSignTime', cb, ctx, returnType, paramArray);
    };
    //export user stamp
    o.ESeaL_GetStampPic = function(strCertID, cb, ctx) {
        var paramArray = [strCertID];
        ctx = null;
        var returnType = null;
        o.callMethod('ESeaL_GetStampPic', cb, ctx, returnType, paramArray);
    };
    o.ESeaL_GetGetVersion = function(cb, ctx) {
        var paramArray = "";
        ctx = null;
        var returnType = null;
        o.callMethod('ESeaL_GetGetVersion', cb, ctx, returnType, paramArray);
    };
    o.ESeaL_CheckRemoveRight = function(signDataString, cb, ctx) {
        var paramArray = [signDataString];
        ctx = null;
        var returnType = null;
        o.callMethod('ESeaL_CheckRemoveRight', cb, ctx, returnType, paramArray);
    };
    o.ESeaL_GetDataForSign = function(strCertID, plainstring, cb, ctx) {
        var paramArray = [strCertID, plainstring];
        ctx = null;
        var returnType = null;
        o.callMethod('ESeaL_GetDataForSign', cb, ctx, returnType, paramArray);
    };
    o.ESeaL_GetSignature = function(strCertID, signature, cb, ctx) {
        var paramArray = [strCertID, signature];
        ctx = null;
        var returnType = null;
        o.callMethod('ESeaL_GetSignature', cb, ctx, returnType, paramArray);
    };
    o.ESeaL_GetStampPicAfterVerified = function(bVerify, signature, cb, ctx) {
        var paramArray = [bVerify, signature];
        ctx = null;
        var returnType = null;
        o.callMethod('ESeaL_GetStampPicAfterVerified', cb, ctx, returnType, paramArray);
    };
    o.ESeaL_GetLastErr = function(cb, ctx) {
        var paramArray = "";
        ctx = null;
        var returnType = null;
        o.callMethod('ESeaL_GetLastErr', cb, ctx, returnType, paramArray);
    };
    if (!o.load_websocket()) {
        return null;
    }
    return o;
}

document.onmousemove = function(event){
	event = event || window.event;

	var sealPic = window.document.getElementById($_$Seal_Pic_Div_Name);
	var sealImg = window.document.getElementById($_$Seal_Img_Name);
	var mainDIV = window.document.getElementById($_$container_Element_Name);
	if(mainDIV === null || sealPic === null || sealImg === null || $_$sealImg.src === "")
		return;

	if($_$bPos)
		return;

	if($_$bJustShow)
		return;

	var sealPicWidth = $_$sealImg.width;
	var sealPicHeight = $_$sealImg.height;
	sealPic.style.width = sealPicWidth + "px";
	sealPic.style.height = sealPicHeight + "px";

	if(mainDIV.value === "BODY") {
		sealPic.style.display = "block";
		//鼠标在印章div的外面，加1，从而定位
		var pixelLeft = document.body.scrollLeft + event.clientX + 1;
		var pixelTop = document.body.scrollTop + event.clientY + 1;
		sealPic.style.left =  pixelLeft + 'px';
		sealPic.style.top = pixelTop + 'px';
	} else {
		var containerObj = window.document.getElementById(mainDIV.value);
		if (containerObj === null)
			return;

		sealPic.style.display = "block";
		//鼠标在印章div的外面，加1，从而定位
		var pixelLeft = document.body.scrollLeft + event.clientX + 1;
		var pixelTop = document.body.scrollTop + event.clientY + 1;
		sealPic.style.left =  pixelLeft - containerObj.offsetLeft + 'px';
		sealPic.style.top = pixelTop - containerObj.offsetTop + 'px';
	}
}

document.onmousedown = function(event){
	event = event || window.event;
	if((event.button === 1) || (event.button === 0)){//ie11 是0，ie9 是1
		if($_$bPos)
			return;

		if($_$bJustShow)
			return;

		var evtObj = event.srcElement ? event.srcElement : event.target;

		var sealPic = window.document.getElementById($_$Seal_Pic_Div_Name);
		var sealImg = window.document.getElementById($_$Seal_Img_Name);
		var mainDIV = window.document.getElementById($_$container_Element_Name);
		if(mainDIV === null || sealPic === null || sealImg === null || $_$sealImg.src === "")
		return;

		if(mainDIV.value === "BODY") {
			//坐标补偿
			var sealPosX = event.x;
			var sealPosY = event.y;

			sealPic.style.left = document.body.scrollLeft + sealPosX +"px";
			sealPic.style.top = document.body.scrollTop + sealPosY  +"px";
		} else {
			var containerObj = window.document.getElementById(mainDIV.value);
			if (containerObj === null)
				return;

			//坐标补偿
			var sealPosX = event.x;
			var sealPosY = event.y;

			sealPic.style.left = document.body.scrollLeft + sealPosX  - containerObj.offsetLeft +"px";
			sealPic.style.top = document.body.scrollTop + sealPosY - containerObj.offsetTop +"px";
		}

		$SignDataPKCS1($_$Seal_Pic_Div_Name, $_$OriginData_Element_Name, $_$Signature_Element_Name, $_$Method_Element_Name);
		$_$bPos = true;
		//document.getElementById('sealPicDiv').style.display = 'none';
		//document.getElementById('sealPicDiv').style.backgroundImage = "";
	}else if(event.button ===2){//右键取消
		if($_$bPos)
			return;
		document.getElementById($_$Seal_Pic_Div_Name).style.display = 'none';
		$_$bPos = true;
	//	document.getElementById($_$Seal_Pic_Div_Name).style.backgroundImage = "";
	}
}

/**
 * 创建右键菜单
 */
function $CreateSignMenu(stampID) {
    deleteSigMenuDiv(stampID);
    var sigMenuDiv = document.createElement("div");
    var sigMenuDivName = "sigMenu" + stampID;
    sigMenuDiv.setAttribute('id', sigMenuDivName);
    sigMenuDiv.className = "contextMenu";
    document.body.appendChild(sigMenuDiv);
    var ulObj = document.createElement("ul");
    var ulObjID = "ulo" + stampID;
    ulObj.setAttribute('id', ulObjID);
    document.getElementById(sigMenuDivName).appendChild(ulObj); //在提示框div中添加标题栏对象title
    /*
    	var liObj = document.createElement("li");
    	liObj.innerHTML = "签章";
    	document.getElementById(ulObjID).appendChild(liObj);//在提示框div中添加标题栏对象title
    */
    var liObj2 = document.createElement("li");
    liObj2.innerHTML = "验章";
    document.getElementById(ulObjID).appendChild(liObj2); //在提示框div中添加标题栏对象title
    var liObj3 = document.createElement("li");
    liObj3.innerHTML = "证书信息";
    document.getElementById(ulObjID).appendChild(liObj3); //在提示框div中添加标题栏对象title
    var liObj4 = document.createElement("li");
    liObj4.innerHTML = "签章时间";
    document.getElementById(ulObjID).appendChild(liObj4); //在提示框div中添加标题栏对象title
    var liObj5 = document.createElement("li");
    liObj5.innerHTML = "撤销签章";
    document.getElementById(ulObjID).appendChild(liObj5); //在提示框div中添加标题栏对象title
    var liObj6 = document.createElement("li");
    liObj6.innerHTML = "关于";
    document.getElementById(ulObjID).appendChild(liObj6); //在提示框div中添加标题栏对象title
    var oMenu = document.getElementById(sigMenuDivName); //"picDragMenu"
    var aUl = oMenu.getElementsByTagName("ul");
    var aLi = oMenu.getElementsByTagName("li");
    var showTimer = null;
    var hideTimer = null;
    var i = 0;
    var maxWidth = 0;
    var maxHeight = 0;
    var aDoc = [document.documentElement.offsetWidth, document.documentElement.offsetHeight];
    oMenu.style.display = "none";
    oMenu.onmouseover = function() {
        oMenu.style.display = "block";
    }
    oMenu.onmouseout = function() {
        oMenu.style.display = "none";
    }
    //var Seal_Pic_Main_Div_Name = "";
    //var Seal_Pic_Div_Name = "";
    //var Signature_Element_Name = "";
    for (i = 0; i < aLi.length; i++) {
        //为含有子菜单的li加上箭头
        aLi[i].getElementsByTagName("ul")[0] && (aLi[i].className = "sub");
        //鼠标移入
        aLi[i].onmouseover = function() {
            var oThis = this;
            var oUl = oThis.getElementsByTagName("ul");
            //鼠标移入样式
            oThis.className += " active";
            //显示子菜单
            if (oUl[0]) {
                clearTimeout(hideTimer);
                showTimer = setTimeout(function() {
                    for (i = 0; i < oThis.parentNode.children.length; i++) {
                        oThis.parentNode.children[i].getElementsByTagName("ul")[0] && (oThis.parentNode.children[i].getElementsByTagName("ul")[0].style.display = "none");
                    }
                    oUl[0].style.display = "block";
                    oUl[0].style.top = oThis.offsetTop + "px";
                    oUl[0].style.left = oThis.offsetWidth + "px";
                    setWidth(oUl[0]);
                    //最大显示范围
                    maxWidth = aDoc[0] - oUl[0].offsetWidth;
                    maxHeight = aDoc[1] - oUl[0].offsetHeight;
                    //防止溢出
                    maxWidth < getOffset.left(oUl[0]) && (oUl[0].style.left = -oUl[0].clientWidth + "px");
                    maxHeight < getOffset.top(oUl[0]) && (oUl[0].style.top = -oUl[0].clientHeight + oThis.offsetTop + oThis.clientHeight + "px")
                }, 300);
            }
        };
        //鼠标移出
        aLi[i].onmouseout = function() {
            var oThis = this;
            var oUl = oThis.getElementsByTagName("ul");
            //鼠标移出样式
            oThis.className = oThis.className.replace(/\s?active/, "");
            clearTimeout(showTimer);
            hideTimer = setTimeout(function() {
                for (i = 0; i < oThis.parentNode.children.length; i++) {
                    oThis.parentNode.children[i].getElementsByTagName("ul")[0] && (oThis.parentNode.children[i].getElementsByTagName("ul")[0].style.display = "none");
                }
            }, 300);
        };
        //鼠标点击
        aLi[i].onclick = function() {
            var oThis = this;
            if ($_$WebSign_CurrentObj) {
                if ((oThis.innerText === "签章") || (oThis.innerHTML === "签章")) {
                    $SignDataPKCS1($_$Seal_Pic_Div_Name, $_$OriginData_Element_Name, $_$Signature_Element_Name, $_$Method_Element_Name);
                } else if ((oThis.innerText === "验章") || (oThis.innerHTML === "验章")) {
                    $VerifyPKCS1($_$Seal_Pic_Div_Name, $_$OriginData_Element_Name, $_$Signature_Element_Name, $_$Method_Element_Name,$_$Seal_Img_Name, null, null, null, null);
                } else if ((oThis.innerText === "证书信息") || (oThis.innerHTML === "证书信息")) {
                    $ShowUserCerInfo($_$Signature_Element_Name);
                } else if ((oThis.innerText === "签章时间") || (oThis.innerHTML === "签章时间")) {
                    $ShowSignTime($_$Signature_Element_Name);
                } else if ((oThis.innerText === "撤销签章") || (oThis.innerHTML === "撤销签章")) {
                    $CheckRemoveRight($_$Signature_Element_Name, $_$Seal_Pic_Div_Name);
                } else if ((oThis.innerText === "关于") || (oThis.innerHTML === "关于")) {
                    $GetVersion();
                }
            }
        };
    }
    //自定义右键菜单
    document.oncontextmenu = function(event) {
    	var sealDivObj = document.getElementById($_$Seal_Pic_Div_Name);
        var parMainObj = document.getElementById($_$Seal_Pic_Main_Div_Name);


        var event = event || window.event;
        var srcObj = event.srcElement ? event.srcElement : event.target;
        var srcObjName = srcObj.id.substr(0, 7);
        var stampID = srcObj.id.substr(7);
        if (stampID != "") {
            $_$Seal_Pic_Main_Div_Name = "sealPicMain" + stampID;
            $_$Seal_Pic_Div_Name = "sealPicDiv" + stampID;
            $_$Signature_Element_Name = "signatureElement" + stampID;
            $_$OriginData_Element_Name = "originDataElement" + stampID;
            $_$Seal_Img_Name = "sealImg" + stampID;
			$_$Method_Element_Name = "methodElement" + stampID;
            if (srcObjName === "sealImg") {
                if ($_$bPos) {
                    oMenu.style.display = "block";
                    /*获取当前鼠标右键按下后的位置，据此定义菜单显示的位置*/
                    var rightedge = document.body.clientWidth - event.clientX;
                    var bottomedge = document.body.clientHeight - event.clientY;
                    /*如果从鼠标位置到容器右边的空间小于菜单的宽度，就定位菜单的左坐标（Left）为当前鼠标位置向左一个菜单宽度*/
                    if (rightedge < oMenu.offsetWidth) oMenu.style.left = document.body.scrollLeft + event.clientX - oMenu.offsetWidth + "px";
                    else
                        /*否则，就定位菜单的左坐标为当前鼠标位置*/
                        oMenu.style.left = document.body.scrollLeft + event.clientX + "px";
                    /*如果从鼠标位置到容器下边的空间小于菜单的高度，就定位菜单的上坐标（Top）为当前鼠标位置向上一个菜单高度*/
                    if (bottomedge < oMenu.offsetHeight) oMenu.style.top = document.body.scrollTop + event.clientY - oMenu.offsetHeight + "px";
                    else
                        /*否则，就定位菜单的上坐标为当前鼠标位置*/
                        oMenu.style.top = document.body.scrollTop + event.clientY + "px";
                    /*
                    oMenu.style.top = event.y-2 + "px";
                    oMenu.style.left = event.x-2 + "px";
                    */
                    setWidth(aUl[0]);
                    liObj2.style.display = "none";
                    liObj3.style.display = "none";
                    liObj4.style.display = "none";
                    var signdata = document.getElementById($_$Signature_Element_Name).value;
                    if (signdata) {
                        liObj2.style.display = "block";
                        liObj3.style.display = "block";
                        liObj4.style.display = "block";
                    }
                    //最大显示范围
                    maxWidth = aDoc[0] - oMenu.offsetWidth;
                    maxHeight = aDoc[1] - oMenu.offsetHeight;
                    //防止菜单溢出
                    //oMenu.offsetTop > maxHeight && (oMenu.style.top = maxHeight + "px");
                    //oMenu.offsetLeft > maxWidth && (oMenu.style.left = maxWidth + "px");
                    oMenu.target = srcObj.id;
                } else {
                    bSignReady = false;
                    document.getElementById($_$Seal_Pic_Div_Name).style.display = 'none';
                }
            }
        }
        return false;
    };
    //点击隐藏菜单
    document.onclick = function() {
        oMenu.style.display = "none";
    };
    //取li中最大的宽度, 并赋给同级所有li
    function setWidth(obj) {
        maxWidth = 0;
        for (i = 0; i < obj.children.length; i++) {
            var oLi = obj.children[i];
            var iWidth = oLi.clientWidth - parseInt(oLi.currentStyle ? oLi.currentStyle["paddingLeft"] : getComputedStyle(oLi, null)["paddingLeft"]) * 2
            if (iWidth > maxWidth) maxWidth = iWidth;
        }
        for (i = 0; i < obj.children.length; i++) obj.children[i].style.width = maxWidth + "px";
    }
}

function deleteSigMenuDiv(stampID) {
    var sigMenuDivName = "sigMenu" + stampID;
    var my = document.getElementById(sigMenuDivName);
    if (my != null) my.parentNode.removeChild(my);
}
(function $onLoadFunc() {
    $_$WebSign_WebSocketObj = CreateWebSocketObject_WebSign();
    if ($_$WebSign_WebSocketObj != null) {
        $_$WebSign_CurrentObj = $_$WebSign_WebSocketObj;
        return;
    }

	$_$WebSign_AppObj = CreateAppObject_WebSign("SignObj", null, null, null, null, null, null);
    if ($_$WebSign_AppObj != null) {
        $_$WebSign_CurrentObj = $_$WebSign_AppObj;
/* 读取注册表会引起ie弹出不安全交互提示框
		try
		{
			var shell = new ActiveXObject("WScript.Shell");
			var key = shell.RegRead("HKEY_CURRENT_USER\\Software\\BJCA\\bUseSHA256");
			if(key) {
				$_$bUseSHA256 = true;
			}

		}
		catch(e)
		{
			alert(e);
			return;
		}
	*/
		return;
	}

    $_$WebSign_CurrentObj = null;
    //$XTXAlert("检查签章核心服务出错!");
    alert("初始化签章核心服务出错!");
    return;
})();

export default {
    // $myOKRtnFunc:$myOKRtnFunc,
    // $myErrorRtnFunc:$myErrorRtnFunc,
    // $SelectSealDlg:$SelectSealDlg,
    // $DragSeal:$DragSeal,
    // GetPic:GetPic,
    // GetSignMethod:GetSignMethod,
    ESeaL_InsertStamp:ESeaL_InsertStamp,
    // deleteSigDiv:deleteSigDiv,
    // $SignData:$SignData,
    // ESeaL_Sign:ESeaL_Sign,
    // $PassWdDlg:$PassWdDlg,
    // $SignDataPKCS1:$SignDataPKCS1,
    // $VerifyPKCS1:$VerifyPKCS1,
    // $CheckRemoveRight:$CheckRemoveRight,
    // $ShowUserCerInfo:$ShowUserCerInfo,
    // $ShowSignTime:$ShowSignTime,
    // $GetVersion:$GetVersion,
    // $GetLastErr:$GetLastErr,
    // ESeaL_SetCertID:ESeaL_SetCertID,
    ESeaL_SetSealPosAndSign:ESeaL_SetSealPosAndSign,
    // getLeft:getLeft,
    // getTop:getTop,
    // ESeaL_SetOffsetPos:ESeaL_SetOffsetPos,
    // $checkBrowserISIE:$checkBrowserISIE,
    // $AlertDlg:$AlertDlg,
    // $AttachForIE11Event:$AttachForIE11Event,
    // $LoadControl:$LoadControl,
    // CreateAppObject_WebSign:CreateAppObject_WebSign,
    // CreateWebSocketObject_WebSign:CreateWebSocketObject_WebSign,
    // $CreateSignMenu:$CreateSignMenu,
    // deleteSigMenuDiv:deleteSigMenuDiv,
    // ESeaL_GetPic:ESeaL_GetPic,
    ESeaL_GetSignatureData:ESeaL_GetSignatureData,
    ESeaL_SetData,
    // ESeaL_GetOrgData,
}
