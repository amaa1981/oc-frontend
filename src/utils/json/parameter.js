export function getJson(name, option) {
  const datajson = {
    //香港大学UWB显示
    "BBEF5D75-26FC-4F3A-B2A3-F1C8B77FC5E1": [{
		"name": "HKUSTPerson",
		"type": "0",
		"clsid": "BBEF5D75-26FC-4F3A-B2A3-F1C8B77FC5E1",
		"abilityterm": [{
			"enable": "1",
			"name": "Enable HKUSTPerson",
			"unit": "",
			"type": "emVT_I4",
			"lVal": "0"
		}, {
			"enable": "1",
			"name": "HKUSTPerson TaskId",
			"unit": "",
			"type": "emVT_I4",
			"lVal": "0"
		}, {
			"enable": "1",
			"name": "HKUSTPerson DetectRect",
			"unit": "unit",
			"type": "emVT_POLYGON",
			"points": option.points.POLYGON[0]
		}, {
			"enable": "1",
			"name": "imagePoint",
			"unit": "unit",
			"type": "emVT_POLYGON",
			"points": option.points.POLYGON[1]
		},{
			"enable": "1",
			"name": "worldPoint",
			"unit": "unit",
			"type": "emVT_POLYGON",
			"points":  option.points.POLYGON[2]
		},{
			"enable": "1",
			"name": "Threshold",
			"unit": "",
			"type": "emVT_R4",
			"fVal": option.personCheckThreshold || 0.6 //人员检查阈值
		}, {
			"enable": "1",
			"name": "floorId",
			"unit": "",
			"type": "emVT_I4",
			"lVal": option.floorId || ""  //楼层id
		}, {
			"enable": "1",
			"name": "distance",
			"unit": "",
			"type": "emVT_I4",
			"lVal": option.personCoordinateDistance || 500 //人员坐标距离
		},{
			"enable": "1",
			"name": "person interval",
			"unit": "",
			"type": "emVT_I4",
			"lVal": option.coordinateUpdateInterval || 1000  //坐标更新间隔
		},{
			"enable": "1",
			"name": "AlarmInterval",
			"unit": "",
			"type": "emVT_R4",
			"fVal": "30"
		}, {
			"enable": "1",
			"name": "Time HKUSTPerson",
			"unit": "",
			"type": "emVT_LPSTR",
			"strVal": ""
		}]
	}],
    //口罩耳机检测
    "27DB5613-D184-4F13-A7E6-671DE5C7F4E6": [{
		"name": "MaskEarphone",
		"type": "0",
		"clsid": "27DB5613-D184-4F13-A7E6-671DE5C7F4E6",
		"abilityterm": [{
			"enable": "1",
			"name": "Enable MaskEarphone",
			"unit": "",
			"type": "emVT_I4",
			"lVal": "0"
		}, {
			"enable": "1",
			"name": "MaskEarphone TaskId",
			"unit": "",
			"type": "emVT_I4",
			"lVal": "0"
		}, {
			"enable": "1",
			"name": "MaskEarphone DetectRect",
			"unit": "unit",
			"type": "emVT_POLYGON",
			"points": option.points.POLYGON[0]
		}, {
			"enable": "1",
			"name": "earphoneThresh",
			"unit": "",
			"type": "emVT_R4",
			"fVal": option.earphoneThresh || 0.6 //耳机阈值
		},
		{
			"enable": "1",
			"name": "faceMaskThresh",
			"unit": "",
			"type": "emVT_R4",
			"fVal": option.faceMaskThresh || 0.6 //口罩阈值
		}, 	{
			"enable": "1",
			"name": "MaskEarphone type",
			"unit": "",
			"type": "emVT_I4",
			"lVal": "0"
		}, {
			"enable": "1",
			"name": "AlarmInterval",
			"unit": "",
			"type": "emVT_R4",
			"fVal": "30"
		}, {
			"enable": "1",
			"name": "FrameInterval",
			"unit": "",
			"type": "emVT_I4",
			"lVal": option.maskEarphoneFrameInterval || 1000 //检测帧率间隔（毫秒）
		},{
			"enable": "1",
			"name": "MLLM",
			"unit": "",
			"type": "emVT_I4",
			"lVal": option.mllm || "0"
		}, {
			"enable": "1",
			"name": "Time MaskEarphone",
			"unit": "",
			"type": "emVT_LPSTR",
			"strVal": ""
		}]
	}],
    //车辆统计
    "0234CA9A-0200-4FE5-9793-859741E689C3": [{
		"name": "VehicleCounting",
		"type": "0",
		"clsid": "0234CA9A-0200-4FE5-9793-859741E689C3",
		"abilityterm": [{
			"enable": "1",
			"name": "Enable VehicleCounting",
			"unit": "",
			"type": "emVT_I4",
			"lVal": "0"
		}, {
			"enable": "1",
			"name": "VehicleCounting TaskId",
			"unit": "",
			"type": "emVT_I4",
			"lVal": "0"
		}, {
			"enable": "1",
			"name": "VehicleCounting DetectRect",
			"unit": "unit",
			"type": "emVT_POLYGON",
			"points": option.points.POLYGON[0]
		}, {
			"enable": "1",
			"name": "VehicleCounting line1",
			"unit": "unit",
			"type": "emVT_POLYGON",
			"points": option.points.LINE[0]
		}, {
			"enable": "1",
			"name": "VehicleCounting line2",
			"unit": "unit",
			"type": "emVT_POLYGON",
			"points": option.points.LINE[1]
		}, {
			"type": "emVT_R4",
			"unit": "",
			"fVal": option.vehicleCarThresh || 0.6,
			"enable": "1",
			"name": "car thresh"   //汽车阈值
		},{
			"type": "emVT_R4",
			"unit": "",
			"fVal": option.vehicleMotorcycleThresh || 0.6,
			"enable": "1",
			"name": "motorcycle thresh" //摩托车阈值
		},{
			"type": "emVT_I4",
			"unit": "",
			"lVal": option.vehicleFrameInterval || 200,
			"enable": "1",
			"name": "FrameInterval"  //检测帧率
		},{
			"enable": "1",
			"name": "AlarmInterval",
			"unit": "",
			"type": "emVT_R4",
			"fVal": "10"
		},{
			"enable": "1",
			"name": "Time VehicleRetrograde",
			"unit": "",
			"type": "emVT_LPSTR",
			"strVal": ""
		}]
	}],
    //充电枪检测
    "DACD8C81-FCDC-47E3-80A9-B648CE558456": [{
		"name": "ChargingDetect",
		"type": "0",
		"clsid": "DACD8C81-FCDC-47E3-80A9-B648CE558456",
		"abilityterm": [{
			"enable": "1",
			"name": "Enable Charging",
			"unit": "",
			"type": "emVT_I4",
			"lVal": "0"
		}, {
			"enable": "1",
			"name": "Charging TaskId",
			"unit": "",
			"type": "emVT_I4",
			"lVal": "0"
		}, {
			"enable": "1",
			"name": "car DetectRect",
			"unit": "unit",
			"type": "emVT_POLYGON",
			"points": option.points.POLYGON[0]
		}, {
			"enable": "1",
			"name": "Charging DetectRect",
			"unit": "unit",
			"type": "emVT_POLYGON",
			"points": option.points.POLYGON[1]
		}, {
			"enable": "1",
			"name": "car Threshold",
			"unit": "",
			"type": "emVT_R4",
			"fVal": option.carThreshold || "0.6"
		}, {
			"enable": "1",
			"name": "Charging Threshold",
			"unit": "",
			"type": "emVT_R4",
			"fVal": option.chargingThreshold || "0.6"
		}, {
			"enable": "1",
			"name": "AlarmInterval",
			"unit": "",
			"type": "emVT_R4",
			"fVal": "30"
		}, {
			"enable": "1",
			"name": "Time Charging",
			"unit": "",
			"type": "emVT_LPSTR",
			"strVal": ""
		}]
	}],
    "8ACD8C8C-FCDC-47E3-80A9-B648CE558661": [{
      "name": "AdhesiveBoard",
      "type": "0",
      "clsid": "8ACD8C8C-FCDC-47E3-80A9-B648CE558661",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable AdhesiveBoard",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "AdhesiveBoard TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "AdhesiveBoard DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0]
      }, {
        "enable": "1",
        "name": "sensitivity",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.fVal || 0.6
      }, {
        "enable": "1",
        "name": "type",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "30"
      }, {
        "enable": "1",
        "name": "Time AdhesiveBoard",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    //手套头套口罩识别
    "27BB5613-D184-4F13-A7E6-671DE5C7F434": [{
      "name": "SAHeadMaskHand",
      "type": "0",
      "clsid": "27BB5613-D184-4F13-A7E6-671DE5C7F434",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable SAHeadMaskHand",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "SAHeadMaskHand TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "SAHeadMaskHand DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0]
      }, {
        "enable": "1",
        "name": "sensitivity",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.fVal || 0.6
      }, {
        "enable": "1",
        "name": "SAHeadMaskHand type",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "30"
      }, {
        "enable": "1",
        "name": "Time SAHeadMaskHand",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    //手套鞋套检测
    "25BB561D-D154-4F13-A7E6-671DE5C7F134": [{
      "name": "GlovesDetect",
      "type": "0",
      "clsid": "25BB561D-D154-4F13-A7E6-671DE5C7F134",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable GlovesDetect",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "GlovesDetect TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "GlovesDetect DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0]
      }, {
        "enable": "1",
        "name": "person Threshold",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.glovesPersonThresh || "0.6"//人员阈值
      }, {
        "enable": "1",
        "name": "Glove Threshold",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.glovesThresh || "0.6" //手套鞋套阈值
      }, {
        "enable": "1",
        "name": "GlovesDetect type",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "30"
      }, {
        "enable": "1",
        "name": "Time Glove",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    //非员工入侵检测
    "8742D74B-BDAC-49E2-BDA0-CB906D28E6E4": [{
      "name": "IntrusionUniform",
      "type": "0",
      "clsid": "8742D74B-BDAC-49E2-BDA0-CB906D28E6E4",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable IntrusionUniform",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "IntrusionUniform TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "IntrusionUniform DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0]
      }, {
        "enable": "1",
        "name": "person Threshold",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.intrusionPersonThresh || "0.5"  //人员检查阈值
      }, {
        "enable": "1",
        "name": "Front pic path",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": option.intrusionFrontPic || ""  //衣服正面图片地址
      }, {
        "enable": "1",
        "name": "Back pic path",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": option.intrusionBackPic || ""  //衣服背面图片地址
      }, {
        "enable": "1",
        "name": "type",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "30"
      }, {
        "enable": "1",
        "name": "Time IntrusionUniform",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    //围栏检测
    "9982D74C-BDAC-49E2-BDA0-CB906D28E69A": [{
      "name": "HKFenceDetect",
      "type": "0",
      "clsid": "9982D74C-BDAC-49E2-BDA0-CB906D28E69A",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable HKFenceDetect",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "HKFenceDetect TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "HKFenceDetect DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0]
      }, {
        "enable": "1",
        "name": "HKFenceDetect center",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POINTS && option.points.POINTS.length > 0 ? option.points.POINTS : [{ "x": "0", "y": "0" }]
      }, {
        "enable": "1",
        "name": "fence Threshold",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.fenceThresh || 0.6  //围栏阈值
      }, {
        "enable": "1",
        "name": "person Threshold",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.fencePersonThresh || 0.6  //人检测阈值
      }, {
        "enable": "1",
        "name": "type",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      },
      {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "30"
      }, {
        "enable": "1",
        "name": "Time HKFenceDetect",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    //玩手机姿势识别
    "D432D747-BDAC-49E2-BDA0-CB906D28E141": [{
      "name": "playphonepose",
      "type": "0",
      "clsid": "D432D747-BDAC-49E2-BDA0-CB906D28E141",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable playphonepose",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "playphonepose TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "playphonepose DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0]
      }, {
        "enable": "1",
        "name": "sensitivity",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.fVal || 0.6
      }, {
        "enable": "1",
        "name": "person Threshold",   //人检测阈值
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.personThreshold || 0.6
      }, {
        "enable": "1",
        "name": "type",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      },
      {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "30"
      }, {
        "enable": "1",
        "name": "Time playphonepose",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    //头套识别
    "9132D74B-BDAC-49E2-BDA0-CB906D28E66E": [{
      "name": "BlackMask",
      "type": "0",
      "clsid": "9132D74B-BDAC-49E2-BDA0-CB906D28E66E",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable BlackMask",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "BlackMask TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "BlackMask DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0]
      }, {
        "enable": "1",
        "name": "sensitivity",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.fVal || 0.6
      }, {
        "enable": "1",
        "name": "person Threshold",  //人检测阈值
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.personThreshold || 0.6
      }, {
        "enable": "1",
        "name": "type",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      },
      {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "30"
      }, {
        "enable": "1",
        "name": "Time BlackMask",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],

    // 机动车违停识别
    "DD32D74B-BDAC-49E2-BDA0-CB906D28E14E": [{
      "name": "IllegalParking",
      "type": "0",
      "clsid": "DD32D74B-BDAC-49E2-BDA0-CB906D28E14E",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable IllegalParking",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "IllegalParking TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "IllegalParking DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0]
      }, {
        "enable": "1",
        "name": "sensitivity",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.fVal || 0.6
      }, {
        "enable": "1",
        "name": "IllegalParking Timeout",
        "unit": "",
        "type": "emVT_I4",
        "lVal": option.IllegalParkingTimeout || 0  //违停限时
      },
      {
        "enable": "1",
        "name": "type",
        "unit": "",
        "type": "emVT_I4",
        "lVal": option.IllegalParkingtype || 0  //类型
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "30"
      }, {
        "enable": "1",
        "name": "Time Dangerous",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    //年龄性别识别
    "76B27D32-5274-A1A5-2DA7-8F827B1C8616": [{
      "name": "AgeGender",
      "type": "0",
      "clsid": "76B27D32-5274-A1A5-2DA7-8F827B1C8616",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable AgeGender",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "AgeGender TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "AgeGender DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0]
      }, {
        "enable": "1",
        "name": "pass line1",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.LINE[0]
      }, {
        "enable": "1",
        "name": "pass line2",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.LINE[1]
      }, {
        "enable": "1",
        "name": "type",
        "unit": "",
        "type": "emVT_I4",
        "lVal": '0'  //类型
      }, {
        "enable": "1",
        "name": "faceColor",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.faceColors || ''  //faceColor
      }, {
        "enable": "1",
        "name": "faceWeight",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.faceWeights || ''  //faceWeight
      }, {
        "enable": "1",
        "name": "sensitivity",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.fVal || 0.6
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.ageGenderAlarmInterval || "0"
      }, {
        "enable": "1",
        "name": "Time Lifebuoy",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    // 门状态检测
    "65EB561E-EAE4-4F13-A7E6-A11DE5C7D163": [{
      "name": "doorstatus",
      "type": "0",
      "clsid": "65EB561E-EAE4-4F13-A7E6-A11DE5C7D163",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable doorstatus",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "doorstatus TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "doorstatus DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0]
      }, {
        "enable": "1",
        "name": "Threshold1",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.Threshold1 || 0.5   //预留字段1
      }, {
        "enable": "1",
        "name": "Threshold2",
        "unit": "",
        "type": "emVT_I4",
        "lVal": option.Threshold2 || 0    //预留字段2
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "30"   //报警间隔时间
      }, {
        "enable": "1",
        "name": "Time ThaiLicensePlate",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    //泰国车牌识别
    "33BB561E-EAE4-4F13-A7E6-A11DE5C7F167": [{
      "name": "ThaiLicensePlate",
      "type": "0",
      "clsid": "33BB561E-EAE4-4F13-A7E6-A11DE5C7F167",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable ThaiLicensePlate",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "ThaiLicensePlate TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "ThaiLicensePlate DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0]
      }, {
        "enable": "1",
        "name": "vehicle Threshold",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.vehicleThreshs || 0.6  //车辆识别阈值
      }, {
        "enable": "1",
        "name": "license Threshold",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.licenseThreshs || 0.6  //车牌识别阈值
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "30"
      }, {
        "enable": "1",
        "name": "Time ThaiLicensePlate",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],


    //表情检测
    "65BB561E-EA54-4F13-A7E6-A11DE5C7F157": [{
      "name": "FacialExpression",
      "type": "0",
      "clsid": "65BB561E-EA54-4F13-A7E6-A11DE5C7F157",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable FacialExpression",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "FacialExpression TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0]
      }, {
        "enable": "1",
        "name": "sensitivity",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.fVal
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "0"
      }, {
        "enable": "1",
        "name": "Time FacialExpression",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    //垃圾满溢检测
    "1f954cb2-b29c-48b9-9a78-8fecf957a515": [{
      "name": "OverGarbageDetect",
      "type": "0",
      "clsid": "1f954cb2-b29c-48b9-9a78-8fecf957a515",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable OverGarbageDetect",
        "unit": "",
        "type": "emVT_I4",
        "fVal": "0"
      }, {
        "enable": "1",
        "name": "OverGarbageDetect TaskId",
        "unit": "",
        "type": "emVT_I4",
        "fVal": "0"
        // 循环 option.points.POLYGON 插入对象
      },
      ...(
        Array.isArray(option.points.POLYGON)
          ? option.points.POLYGON.map((polygon, idx) => ({
            "enable": "1",
            "name": `OverGarbageDetect DetectRect`,
            "unit": "unit",
            "type": "emVT_POLYGON",
            "points": polygon,
          }))
          : []
      ),
      {
        "enable": "1",
        "name": "sensitivity",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.fVal//垃圾检测阈值
      },
      {
        "enable": "1",
        "name": "type",
        "unit": "",
        "type": "emVT_R4",
        "lVal": option.garbageType || 2    //类型  0: 垃圾桶满溢 1: 垃圾乱放  2:   都报
      },

      {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "30"
      }, {
        "enable": "1",
        "name": "Time OverGarbageDetect",
        "unit": "",
        "type": "emVT_LPSTR"
      }]
    }],
    //口罩检测
    "B6B27D32-5274-A1C3-2DA7-8F827B1C8676": [{
      "name": "MaskDetect",
      "type": "0",
      "clsid": "B6B27D32-5274-A1C3-2DA7-8F827B1C8676",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable MaskDetect",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "MaskDetect TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "MaskDetect DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0]
      }, {
        "enable": "1",
        "name": "type",
        "unit": "",
        "type": "emVT_I4",
        "lVal": option.types || 0  //0不太口罩报警 1戴口罩报警
      }, {
        "enable": "1",
        "name": "faceColor",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.faceColor || 0.55  //人脸color阈值
      }, {
        "enable": "1",
        "name": "faceWeight",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.faceWeight || 0.83  //人脸质量权重
      }, {
        "enable": "1",
        "name": "maskScore",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.maskScore || 0.6  //口罩阈值
      }, {
        "enable": "1",
        "name": "Threshold",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "0.6"
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "30"
      }, {
        "enable": "1",
        "name": "Time Lifebuoy",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    // 平台积水检测
    "DAA64F89-9E21-45C9-9FC6-9F4E9C1CB794": [{
      "name": "Waterlogging",
      "type": "0",
      "clsid": "DAA64F89-9E21-45C9-9FC6-9F4E9C1CB794",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable Waterlogging",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "Waterlogging TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "Waterlogging DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0],
      }, {
        "enable": "1",
        "name": "Scale DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[1] || [
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
        ],
      }, {
        "enable": "1",
        "name": "Scale2 DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[2] || [
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
        ],
      }, {
        "type": "emVT_R4",
        "unit": "",
        "fVal": option.waterThresh || 0.5, //积水阈值
        "enable": "1",
        "name": "Waterlogging thresh"
      }, {
        "type": "emVT_R4",
        "unit": "",
        "fVal": option.scaleThresh || 0.5, //标尺阈值
        "enable": "1",
        "name": "ScaleDetect thresh"
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "10"
      }, {
        "enable": "1",
        "name": "Time Waterlogging",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    //摩托车安全帽检测
    "7f954cb2-b29c-48b9-9a78-8fecf957a212": [{
      "name": "Enable MotorcycleHelmetDetect",
      "type": "0",
      "clsid": "7f954cb2-b29c-48b9-9a78-8fecf957a212",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable MotorcycleHelmetDetect",
        "unit": "",
        "type": "emVT_I4",
        "fVal": "0"
      }, {
        "enable": "1",
        "name": "MotorcycleHelmetDetect TaskId",
        "unit": "",
        "type": "emVT_I4",
        "fVal": "0"
      }, {
        "enable": "1",
        "name": "MotorcycleHelmetDetect DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0],
      }, {
        "enable": "1",
        "name": "personThresh Threshold",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.personThresh || 0.60  //人员阈值
      }, {
        "enable": "1",
        "name": "helmetThresh Pattern",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.helmetThresh || 0.6  //安全帽阈值
      }, {
        "enable": "1",
        "name": "motorcycleThresh Pattern",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.motorcycleThresh || 0.6  //摩托车阈值
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "30"
      }, {
        "enable": "1",
        "name": "Time motorcycleThresh",
        "unit": "",
        "type": "emVT_LPSTR"
      }]
    }],
    //店内顾客检测
    "45BB561E-EA54-4F13-A7E6-A11DE5C75648": [{
      "name": "TaiGuestStatistics",
      "type": "0",
      "clsid": "45BB561E-EA54-4F13-A7E6-A11DE5C75648",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable TaiGuestStatistics",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "TaiGuestStatistics TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
        // 循环 option.points.POLYGON 插入对象
      },
      ...(
        Array.isArray(option.points.POLYGON)
          ? option.points.POLYGON.map((polygon, idx) => ({
            "enable": "1",
            "name": option.areaNameList && option.areaNameList[idx] ? option.areaNameList[idx] : `DetectRect${idx + 1}`,
            "unit": "unit",
            "type": "emVT_POLYGON",
            "points": polygon,
          }))
          : []
      ),
      {
        "enable": "1",
        "name": "cross",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.LINE[0],
      }, {
        "enable": "1",
        "name": "direction",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.LINE[1],
      },
      {
        "enable": "1",
        "name": "person Threshold",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.fValperson//人员检测阈值
      }, {
        "enable": "1",
        "name": "Assistant Threshold",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.fValassistant//店员检测阈值
      }, {
        "enable": "1",
        "name": "Threshold2",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "0.6"
      }, {
        "enable": "1",
        "name": "retention time",
        "unit": "",
        "type": "emVT_I4",
        "lVal": option.retentionTime || 60 //客人滞留开始时间
      }, {
        "enable": "1",
        "name": "conversation time",
        "unit": "",
        "type": "emVT_I4",
        "lVal": option.conversationTime || 5 //客人和店员交谈开始时间
      }, {
        "enable": "1",
        "name": "camera IP",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": option.cameraIP2
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "0"
      }, {
        "enable": "1",
        "name": "Time TaiGuestStatistics",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    //进店人数统计
    "174CA9D-0200-4FE5-9793-859741E689C6": [{
      "name": "TaiEntryStatistics",
      "type": "0",
      "clsid": "174CA9D-0200-4FE5-9793-859741E689C6",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable TaiEntryStatistics",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "TaiEntryStatistics TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "TaiEntryStatistics DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0],
      }, {
        "enable": "1",
        "name": "TaiEntryStatistics line1",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.LINE[0]
      }, {
        "enable": "1",
        "name": "TaiEntryStatistics line2",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.LINE[1]
      }, {
        "type": "emVT_R4",
        "unit": "",
        "fVal": option.fVal,//灵敏度
        "enable": "1",
        "name": "sensitivity"
      }, {
        "type": "emVT_R4",
        "unit": "",
        "fVal": 0.7,
        "enable": "1",
        "name": "extend thresh1"
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "0"
      }, {
        "enable": "1",
        "name": "Time VehicleRetrograde",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    //车辆逆行(跟踪)
    "0264CA9D-0200-4FE5-9793-859741E689C1": [{
      "name": "VehicleRetrograde",
      "type": "0",
      "clsid": "0264CA9D-0200-4FE5-9793-859741E689C1",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable VehicleRetrograde",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "VehicleRetrograde TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "VehicleRetrograde DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0],
      }, {
        "enable": "1",
        "name": "VehicleRetrograde line1",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.LINE[0]
      }, {
        "enable": "1",
        "name": "VehicleRetrograde line2",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.LINE[1]
      }, {
        "type": "emVT_R4",
        "unit": "",
        "fVal": option.fVal,//灵敏度
        "enable": "1",
        "name": "sensitivity"
      }, {
        "type": "emVT_R4",
        "unit": "",
        "fVal": 0.7,
        "enable": "1",
        "name": "extend thresh1"
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "10"
      }, {
        "enable": "1",
        "name": "Time VehicleRetrograde",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],



    //打架
    "6C448FBB-83E1-49AD-B06D-297D267BD80B": [{
      "name": "FightingDetect",
      "type": "0",
      "clsid": "6C448FBB-83E1-49AD-B06D-297D267BD80B",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable Fighting",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "Fighting TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "Fighting DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0],
      }, {
        "enable": "1",
        "name": "sensitivity",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.fVal,//灵敏度
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "30"
      }, {
        "enable": "1",
        "name": "Time Fighting",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    //船只识别
    "5FFA8DB9-DC3F-49ED-B0BB-A2AEA1F9FD3F": [{
      "name": "ShippingCounting",
      "type": "0",
      "clsid": "5FFA8DB9-DC3F-49ED-B0BB-A2AEA1F9FD3F",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable ShippingCounting",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "ShippingCounting TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "ShippingCounting DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0],
      }, {
        "enable": "1",
        "name": "ShippingCountingLane",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.LINE[0]
      }, {
        "enable": "1",
        "name": "DirectionLane",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.LINE[1]
        // "points": [{
        //   "x": "0.47375000",
        //   "y": "0.24000000"
        // }, {
        //   "x": "0.47875000",
        //   "y": "0.88750000"
        // }]
      }, {
        "type": "emVT_R4",
        "unit": "",
        "fVal": option.fVal,//灵敏度
        "enable": "1",
        "name": "sensitivity"
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "60"
      }, {
        "enable": "1",
        "name": "Time ShippingCounting",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    //安全帽颜色
    "BA200843-1714-4718-914C-21211CAC5E46": [{
      "name": "SafetyHelmetColourDetect",
      "type": "0",
      "clsid": "BA200843-1714-4718-914C-21211CAC5E46",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable SafetyHelmetColour",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "SafetyHelmetColour TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "SafetyHelmetColour DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0],
      }, {
        "enable": "1",
        "name": "sensitivity",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.fVal,//灵敏度
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "30"
      }, {
        "enable": "1",
        "name": "Time SafetyHelmetColour",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],

    //睡岗检测
    "E7017EDA-4EFD-493E-97DF-4156ECB39656": [{
      "name": "SleepPost",
      "type": "0",
      "clsid": "E7017EDA-4EFD-493E-97DF-4156ECB39656",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable SleepPost",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "SleepPost TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "SleepPost DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0],
      }, {
        "enable": "1",
        "name": "sensitivity",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.fVal,//灵敏度
      }, {
        "enable": "1",
        "name": "PalyPhone Time",
        "unit": "",
        "type": "emVT_I4",
        "lVal": option.sleeptimeOut   //时间 秒
      }, {
        "enable": "1",
        "name": "Time IllegalBuilt",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    //反光衣
    "7F954DB2-C29C-48B9-9A78-8EECF957A290": [{
      "name": "Cross Line",
      "type": "0",
      "clsid": "7F954DB2-C29C-48B9-9A78-8EECF957A290",
      "abilityterm": [
        {
          "unit": "unit",
          "type": "emVT_POLYGON",
          "points": option.points.POLYGON[0],
          "name": "Detect Area",
          "enable": "1"
        },
        {
          "unit": "",
          "type": "emVT_R4",
          "name": "sensitivity",
          "fVal": option.fVal,//灵敏度
          "enable": "1"
        }
      ]
    }],
    //跌倒
    "ADEE06F4-9D5F-44A8-8681-507BBF3CADF8": [{
      "name": "Climb Higher",
      "type": "0",
      "clsid": "ADEE06F4-9D5F-44A8-8681-507BBF3CADF8",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable fall",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "fall TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "fall DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0]
      }, {
        "enable": "1",
        "name": "sensitivity",
        "unit": "",
        "type": "emVT_R4",
       "fVal": option.fVal,//灵敏度
      }, {
        "lVal": option.mllm || "0",
        "type": "emVT_I4",
        "unit": "",
        "enable": "1",
        "name": "MLLM"
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "30"
      }, {
        "enable": "1",
        "name": "Time SAHeadMaskHand",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }],
      // "abilityterm": [
      //   {
      //     "unit": "unit",
      //     "type": "emVT_POLYGON",
      //     "points": option.points.POLYGON[0],
      //     "name": "Detect Area",
      //     "enable": "1"
      //   },
      //   {
      //     "enable": "1",
      //     "name": "MLLM",
      //     "unit": "",
      //     "type": "emVT_I4",
      //     "lVal": option.mllm || "0"
      //   },
      //   {
      //     "unit": "",
      //     "type": "emVT_R4",
      //     "name": "sensitivity",
      //     "fVal": option.fVal,//灵敏度
      //     "enable": "1"
      //   }
      // ]

    }],
    //滞留
    "6C4483AA-83E1-49AD-B06D-297D267BD80B": [{
      "name": "Retention",
      "type": "0",
      "clsid": "6C4483AA-83E1-49AD-B06D-297D267BD80B",
      "abilityterm": [
        {
          "unit": "unit",
          "type": "emVT_POLYGON",
          "points": option.points.POLYGON[0],
          "name": "Retention Area",
          "enable": "1"
        },
        {
          "unit": "",
          "type": "emVT_I4",
          "name": "Retention TimeOut",
          "lVal": option.timeOut,  //滞留时间秒
          "enable": "1"
        }
      ]
    }],
    //车辆逆行
    "0264CA9D-0200-4FE5-9793-859741E689C0": [
      {
        "name": "VehicleConverse",
        "type": "0",
        "clsid": "0264CA9D-0200-4FE5-9793-859741E689C0",
        "abilityterm": [
          {
            "enable": "1",
            "name": "Enable VehicleConverse",
            "unit": "",
            "type": "emVT_I4",
            "lVal": "0"
          },
          {
            "enable": "1",
            "name": "VehicleConverse TaskId",
            "unit": "",
            "type": "emVT_I4",
            "lVal": "0"
          },
          {
            "enable": "1",
            "name": "VehicleConverse DetectRect",
            "unit": "unit",
            "type": "emVT_POLYGON",
            "points": option.points.POLYGON[0],
          },
          {
            "enable": "1",
            "name": "sensitivity",
            "unit": "",
            "type": "emVT_R4",
            "fVal": option.fVal//灵敏度
          },
          {
            "enable": "1",
            "name": "type",
            "unit": "",
            "type": "emVT_R4",
            "fVal": option.type //0检测到车头报警  1检测到车尾报警
          },
          {
            "enable": "1",
            "name": "Time VehicleConverse",
            "unit": "",
            "type": "emVT_LPSTR",
            "strVal": ""
          }
        ]
      }
    ],


    //遗留物
    "BDDBB500-62F3-4A93-AC9E-11C9CC6EA4BE": [
      {
        "name": "RemnantDetect",
        "type": "0",
        "clsid": "BDDBB500-62F3-4A93-AC9E-11C9CC6EA4BE",
        "abilityterm": [
          {
            "lVal": "0",
            "type": "emVT_I4",
            "unit": "",
            "enable": "1",
            "name": "RemnantDetect face"
          },
          {
            "lVal": "0",
            "type": "emVT_I4",
            "unit": "",
            "enable": "1",
            "name": "RemnantDetect TaskId"
          },
          {
            "enable": "1",
            "name": "RemnantDetect Area",
            "unit": "unit",
            "type": "emVT_POLYGON",
            "points": option.points.POLYGON[0],
          },
          {
            "enable": "1",
            "name": "RemnantDetect DelayTime",
            "unit": "",
            "type": "emVT_I4",
            "lVal": option.DelayTime //遗留时间秒
          },
          {
            "strVal": "",
            "type": "emVT_LPSTR",
            "unit": "",
            "enable": "1",
            "name": "Time RemnantDetect"
          },
        ]
      }
    ],


    //脱岗检测
    'F7581B40-A9F9-498E-A510-14F40009C545': [{
      "name": "Leave Post",
      "type": "0",
      "clsid": "F7581B40-A9F9-498E-A510-14F40009C545",
      abilityterm: [
        {
          "enable": "1",
          "name": "Detect Area", //检测位置
          "unit": "unit",
          "type": "emVT_POLYGON",
          "points": option.points.POLYGON[0],
        },
        {
          "enable": "1",
          "name": "sensitivity",
          "unit": "",
          "type": "emVT_R4",
          "fVal": option.fVal//灵敏度
        },
        {
          "enable": "1",
          "name": "LeavePost TimeOut", //离岗时间
          "unit": "",
          "type": "emVT_I4",
          "lVal": option.tuotime || 30 //默认30分钟
        }
      ]
    }],

    //密度检测
    'F7581B40-A9F9-498E-A510-14F40010C545': [{
      "name": "Density",
      "type": "0",
      "clsid": "F7581B40-A9F9-498E-A510-14F40010C545",
      "abilityterm": [
        {
          "enable": "1",
          "name": "DensityDetect DeviceId",//取流的设备ID
          "unit": "",
          "type": "emVT_LPSTR",
          "strVal": option.deviceId
        },
        {
          "enable": "1",
          "name": "DensityDetect DesnityAlarm",
          "unit": "",
          "type": "emVT_I4",
          "lVal": "0"
        },
        {
          "enable": "1",
          "name": "DensityDetect DensityInterval",
          "unit": "",
          "type": "emVT_R4",
          "fVal": option.userNum//人数
        },
        {
          "enable": "1",
          "name": "sensitivity",
          "unit": "",
          "type": "emVT_R4",
          "fVal": option.fVal//灵敏度
        },
        {
          "enable": "1",
          "name": "Detect Area",
          "unit": "unit",
          "type": "emVT_POLYGON",
          "points": option.points.POLYGON[0],
        },
        {
          "enable": "1",
          "name": "DensityDetect DesnityType",
          "unit": "",
          "type": "emVT_I4",
          "lVal": option.alarmType//报警类型
        }
      ]
    }],
    //入侵检测
    "6C448FAA-83E1-49AD-B06D-297D267BD80B": [{
      name: "Cross Line",
      type: "0",
      clsid: "6C448FAA-83E1-49AD-B06D-297D267BD80B",
      abilityterm: [
        {
          enable: "1",
          name: "Detect Area",
          unit: "unit",
          type: "emVT_POLYGON",
          points: option.points.POLYGON[0],
        },
        {
          enable: "1",
          name: "InvadeDetect JobType",
          unit: "",
          type: "emVT_I4",
          lVal: "1",
        },
        {
          enable: "1",
          name: "sensitivity",
          unit: "",
          type: "emVT_R4",
          fVal: option.fVal,
        },
      ],
    }],
    //攀高检测
    '6C448FAA-83E1-49AD-B06D-397D267BD80B': [
      {
        "name": "Climb Higher",
        "type": "0",
        "clsid": "6C448FAA-83E1-49AD-B06D-397D267BD80B",
        "abilityterm": [
          {
            "enable": "1",
            "name": "Detect Area",
            "unit": "unit",
            "type": "emVT_POLYGON",
            "points": option.points.POLYGON[0],
          },
          {
            "enable": "1",
            "name": "sensitivity",
            "unit": "",
            "type": "emVT_R4",
            "fVal": option.fVal,
          }
        ]
      }
    ],
    //人脸识别(win版)
    "B6A27D32-5274-A1C3-2DA7-8F827B1C8622": [
      {
        "name": "ExtractionDetect Filter",
        "type": "0",
        "clsid": "B6A27D32-5274-A1C3-2DA7-8F827B1C8622",
        "abilityterm": [
          {
            "enable": "1",
            "name": "ExtractionDetect Mask Polygon",
            "unit": "unit",
            "type": "emVT_RECTANGLE",
            "x": 0,
            "y": 0,
            "cx": 0,
            "cy": 0
          },
          {
            "enable": "1",
            "name": "ExtractionDetect fps",
            "unit": "f/s",
            "type": "emVT_I4",
            "lVal": "25"
          },
          {
            "enable": "1",
            "name": "ExtractionDetect DeviceId",
            "unit": "",
            "type": "emVT_LPSTR",
            "strVal": "dcf7e33b-c368-40a8-9f04-2f25f3bcc06a"
          },
          {
            "enable": "1",
            "name": "ExtractionDetect Weight",
            "unit": "",
            "type": "emVT_I4",
            "lVal": option.faceWeightwin || 7 //人脸质量
          },
          {
            "enable": "1",
            "name": "ExtractionDetect Tilt",
            "unit": "",
            "type": "emVT_R4",
            "fVal": "0.5"
          },
          {
            "enable": "1",
            "name": "ExtractionDetect Angle",
            "unit": "",
            "type": "emVT_R4",
            "fVal": "10"
          },
          {
            "enable": "1",
            "name": "ExtractionDetect Frame interval",
            "unit": "ms",
            "type": "emVT_I4",
            "lVal": option.frameInterval || "400" //人脸检测间隔（毫秒）
          },
          {
            "enable": "1",
            "name": "ExtractionDetect Detect interval",
            "unit": "ms",
            "type": "emVT_I4",
            "lVal": "400"
          },
          {
            "enable": "1",
            "name": "Mask Threshold",
            "unit": "ms",
            "type": "emVT_R4",
            "fVal": "0.9"
          }
        ]
      }
    ],
    //人脸识别
    'B7A27D32-5274-A1C3-2DA7-8F827B1C8644': [{
      "clsid": "B7A27D32-5274-A1C3-2DA7-8F827B1C8644",
      "abilityterm": [{
        "lVal": "0",
        "type": "emVT_I4",
        "unit": "",
        "enable": "1",
        "name": "Enable face"
      }, {
        "lVal": "0",
        "type": "emVT_I4",
        "unit": "",
        "enable": "1",
        "name": "face TaskId"
      }, {
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0],
        "unit": "unit",
        "enable": "1",
        "name": "face DetectRect"
      },
      {
        "fVal": option.fVal,
        "type": "emVT_R4",
        "unit": "",
        "enable": "1",
        "name": "sensitivity"
      },
      {
        "lVal": 0,
        "type": "emVT_I4",
        "unit": "",
        "enable": "1",
        "name": "type"
      }, {
        "strVal": option.faceGroupList ? option.faceGroupList.join(',') : "",
        "type": "emVT_LPSTR",
        "unit": "",
        "enable": "1",
        "name": "facelibid"
      }, {
        "strVal": "",
        "type": "emVT_LPSTR",
        "unit": "",
        "enable": "1",
        "name": "Time face"
      }],
      "type": "0",
      "name": "face"
    }],


    //安全帽
    '7F954CB2-B29C-48B9-9A78-8FECF957A290': [
      {
        "name": "Cross Line",
        "type": "0",
        "clsid": "7F954CB2-B29C-48B9-9A78-8FECF957A290",
        "abilityterm": [
          {
            "enable": "1",
            "name": "Detect Area",
            "unit": "unit",
            "type": "emVT_POLYGON",
            "points": option.points.POLYGON[0],
          },
          {
            "enable": "1",
            "name": "sensitivity",
            "unit": "",
            "type": "emVT_R4",
            "fVal": option.fVal
          }, {
            "type": "emVT_I4",
            "unit": "",
            "lVal": option.anquanmao,
            "enable": "1",
            "name": "alarm type"
          }, {
            "enable": "1",
            "name": "AlarmInterval",
            "unit": "",
            "type": "emVT_R4",
            "fVal": "60"
          }, {
            "enable": "1",
            "name": "MLLM",
            "unit": "",
            "type": "emVT_I4",
            "lVal": option.mllm || "0"
          }, {
            "enable": "1",
            "name": "Time safetyHat",
            "unit": "",
            "type": "emVT_LPSTR",
            "strVal": ""
          }
        ]
      }
    ],
    //电动车入户
    '3864E531-F909-4E37-A544-B557A8490D80': [
      {
        "name": "Cross Line",
        "type": "0",
        "clsid": "3864E531-F909-4E37-A544-B557A8490D80",
        "abilityterm": [
          {
            "enable": "1",
            "name": "Detect Area",
            "unit": "unit",
            "type": "emVT_POLYGON",
            "points": option.points.POLYGON[0],
          },
          {
            "enable": "1",
            "name": "MLLM",
            "unit": "",
            "type": "emVT_I4",
            "lVal": option.mllm || "0"
          },
          {
            "enable": "1",
            "name": "sensitivity",
            "unit": "",
            "type": "emVT_R4",
            "fVal": option.fVal
          }
        ]
      }
    ],
    //烟火检测
    '7DCD8C8C-FCDC-47EE-80A9-B648CE558FF5': [
      {
        "name": "SmokerFire",
        "type": "0",
        "clsid": "7DCD8C8C-FCDC-47EE-80A9-B648CE558FF5",
        "abilityterm": [
          {
            "enable": "1",
            "name": "Enable SmokerFire",
            "unit": "",
            "type": "emVT_I4",
            "lVal": "0"
          },
          {
            "enable": "1",
            "name": "SmokerFire TaskId",
            "unit": "",
            "type": "emVT_I4",
            "lVal": "0"
          },
          {
            "enable": "1",
            "name": "SmokerFire DetectRect",
            "unit": "unit",
            "type": "emVT_POLYGON",
            "points": option.points.POLYGON[0],
          },
          {
            "enable": "1",
            "name": "sensitivity",
            "unit": "",
            "type": "emVT_R4",
            "fVal": option.fVal
          },
          {
            "enable": "1",
            "name": "MLLM",
            "unit": "",
            "type": "emVT_I4",
            "lVal": option.mllm || "0"
          },
          {
            "enable": "1",
            "name": "Time SmokerFire",
            "unit": "",
            "type": "emVT_LPSTR",
            "strVal": ""
          }
        ]
      }
    ],
    //抽烟检测
    '118D34A0-4FEB-4906-A622-C7974AB3C637': [
      {
        "name": "Enable Smoking",
        "type": "0",
        "clsid": "118D34A0-4FEB-4906-A622-C7974AB3C637",
        "abilityterm": [
          {
            "enable": "1",
            "name": "Enable Smoking",
            "unit": "",
            "type": "emVT_I4",
            "fVal": "0"
          },
          {
            "enable": "1",
            "name": "Smoking TaskId",
            "unit": "",
            "type": "emVT_I4",
            "fVal": "0"
          },
          {
            "enable": "1",
            "name": "Smoking DetectRect",
            "unit": "unit",
            "type": "emVT_POLYGON",
            "points": option.points.POLYGON[0],
          },
          {
            "enable": "1",
            "name": "sensitivity",
            "unit": "",
            "type": "emVT_R4",
            "fVal": option.fVal//灵敏度
          },
          {
            "enable": "1",
            "name": "SmokingDetect Pattern",
            "unit": "",
            "type": "emVT_R4",
            "fVal": '1'//0:远处识别不检测烟，只识别姿势1:近处要检测烟，同时识别姿势
          },
          {
            "enable": "1",
            "name": "MLLM",
            "unit": "",
            "type": "emVT_I4",
            "lVal": option.mllm || "0"
          },
          {
            "enable": "1",
            "name": "Time Smoking",
            "unit": "",
            "type": "emVT_LPSTR"
          }
        ]
      }
    ],
    //违规停车
    'ED32D74B-BDAC-49E2-BDA0-CB906D28E14F': [
      {
        "name": "Cross Line",
        "type": "0",
        "clsid": "ED32D74B-BDAC-49E2-BDA0-CB906D28E14F",
        "abilityterm": [
          {
            "enable": "1",
            "name": "congest Area",
            "unit": "unit",
            "type": "emVT_POLYGON",
            "points": option.points.POLYGON[0],
          }
          , {
            "enable": "1",
            "name": "sensitivity",
            "unit": "",
            "type": "emVT_R4",
            "fVal": option.fVal//灵敏度
          }, {
            "enable": "1",
            "name": "IllegalParking Timeout",
            "unit": "",
            "type": "emVT_I4",
            "lVal": option.MaxCount  //拥堵报警时间秒
          }, {
            "enable": "1",
            "name": "AlarmInterval",
            "unit": "",
            "type": "emVT_R4",
            "fVal": "30"
          }, {
            "enable": "1",
            "name": "Time Dangerous",
            "unit": "",
            "type": "emVT_LPSTR",
            "strVal": ""
          }
        ]
      }
    ],
    //玩手机
    '28E4800E-01AF-4647-8F9B-966497DBE20B': [
      {
        "name": "PalyPhone",
        "type": "0",
        "clsid": "28E4800E-01AF-4647-8F9B-966497DBE20B",
        "abilityterm": [
          {
            "enable": "1",
            "name": "Enable PalyPhone",
            "unit": "",
            "type": "emVT_I4",
            "lVal": "0"
          },
          {
            "enable": "1",
            "name": "PalyPhone TaskId",
            "unit": "",
            "type": "emVT_I4",
            "lVal": "0"
          },
          {
            "enable": "1",
            "name": "PalyPhone DetectRect",
            "unit": "unit",
            "type": "emVT_POLYGON",
            "points": option.points.POLYGON[0],
          },
          {
            "enable": "1",
            "name": "sensitivity",
            "unit": "",
            "type": "emVT_R4",
            "fVal": option.fVal//灵敏度
          },
          {
            "enable": "1",
            "name": "PalyPhone Time",
            "unit": "",
            "type": "emVT_I4",
            "lVal": option.lVal//时间分钟
          },
          {
            "enable": "1",
            "name": "MLLM",
            "unit": "",
            "type": "emVT_I4",
            "lVal": option.mllm || "0"
          },
          {
            "enable": "1",
            "name": "Time IllegalBuilt",
            "unit": "",
            "type": "emVT_LPSTR",
            "strVal": ""
          }
        ]
      }
    ],
    //违规加油
    'D2985710-425A-4DC9-AD61-C876FA5F5E9D': [
      {
        "name": "GasStationViolator",
        "type": "0",
        "clsid": "D2985710-425A-4DC9-AD61-C876FA5F5E9D",
        "abilityterm": [
          {
            "enable": "1",
            "name": "Enable GasStationViolator",
            "unit": "",
            "type": "emVT_I4",
            "lVal": "0"
          },
          {
            "enable": "1",
            "name": "GasStationViolator TaskId",
            "unit": "",
            "type": "emVT_I4",
            "lVal": "0"
          },
          {
            "enable": "1",
            "name": "GasStationViolator DetectRect",
            "unit": "unit",
            "type": "emVT_POLYGON",
            "pointsize": "8",
            "points": option.points.POLYGON[0]
          },
          {
            "enable": "1",
            "name": "GasStationViolator DetectRect",
            "unit": "unit",
            "type": "emVT_POLYGON",
            "pointsize": "8",
            "points": option.points.POLYGON[1] || [
              { x: 0, y: 0 },
              { x: 0, y: 0 },
              { x: 0, y: 0 },
              { x: 0, y: 0 },
              { x: 0, y: 0 },
              { x: 0, y: 0 },
              { x: 0, y: 0 },
              { x: 0, y: 0 },
            ]
          },
          {
            "enable": "1",
            "name": "GasStationViolator DetectRect",
            "unit": "unit",
            "type": "emVT_POLYGON",
            "pointsize": "8",
            "points": option.points.POLYGON[2] || [
              { x: 0, y: 0 },
              { x: 0, y: 0 },
              { x: 0, y: 0 },
              { x: 0, y: 0 },
              { x: 0, y: 0 },
              { x: 0, y: 0 },
              { x: 0, y: 0 },
              { x: 0, y: 0 },
            ]
          },
          {
            "enable": "1",
            "name": "sensitivity",
            "unit": "",
            "type": "emVT_R4",
            "fVal": option.fVal//灵敏度
          },
          {
            "enable": "1",
            "name": "Detect Distance",
            "unit": "",
            "type": "emVT_R4",
            "fVal": option.distance//油桶跟人员距离
          },
          {
            "enable": "1",
            "name": "Time GasStationViolator",
            "unit": "",
            "type": "emVT_LPSTR",
            "strVal": ""
          }
        ]
      }],

    //加油站检测
    '1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F24d': [
      {
        "name": "AnGasStation",
        "type": "0",
        "clsid": "1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F24d",
        "abilityterm": [{
          "enable": "1",
          "name": "Enable AnGasStation",
          "unit": "",
          "type": "emVT_I4",
          "lVal": "0"
        }, {
          "enable": "1",
          "name": "AnGasStation TaskId",
          "unit": "",
          "type": "emVT_I4",
          "lVal": "0"
        }, {
          "enable": "1",
          "name": "HelmetDetect DetectRect",
          "unit": "unit",
          "type": "emVT_POLYGON",
          "points": option.points.POLYGON[0] || [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
          ]
        }, {
          "enable": "1",
          "name": "StaffIdentification DetectRect",
          "unit": "unit",
          "type": "emVT_POLYGON",
          "points": option.points.POLYGON[1] || [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
          ]
        }, {
          "enable": "1",
          "name": "tanker DetectRect",
          "unit": "unit",
          "type": "emVT_POLYGON",
          "points": option.points.POLYGON[2] || [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
          ]
        }, {
          "enable": "1",
          "name": "staticele DetectRect",
          "unit": "unit",
          "type": "emVT_POLYGON",
          "points": option.points.POLYGON[3] || [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
          ]
        }, {
          "enable": "1",
          "name": "FireEx DetectRect",
          "unit": "unit",
          "type": "emVT_POLYGON",
          "points": option.points.POLYGON[4] || [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
          ]
        }, {
          "enable": "1",
          "name": "Tankerstat DetectRect",
          "unit": "unit",
          "type": "emVT_POLYGON",
          "points": option.points.POLYGON[5] || [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
          ]
        }, {
          "type": "emVT_R4",
          "unit": "",
          "fVal": option.helmetthresh,
          "enable": "1",
          "name": "Helmet thresh"
        }, {
          "type": "emVT_R4",
          "unit": "",
          "fVal": option.personthresh,
          "enable": "1",
          "name": "person thresh"
        }, {
          "type": "emVT_R4",
          "unit": "",
          "fVal": option.staffidentithresh,
          "enable": "1",
          "name": "StaffIdenti thresh"
        }, {
          "type": "emVT_R4",
          "unit": "",
          "fVal": 0.7,
          "enable": "1",
          "name": "staticele thresh"
        }, {
          "type": "emVT_R4",
          "unit": "",
          "fVal": option.tanker,
          "enable": "1",
          "name": "tanker thresh"
        }, {
          "type": "emVT_R4",
          "unit": "",
          "fVal": option.fireex,
          "enable": "1",
          "name": "fireex thresh"
        }, {
          "type": "emVT_R4",
          "unit": "",
          "fVal": option.tankerstat,
          "enable": "1",
          "name": "tankerstat thresh"
        }, {
          "enable": "1",
          "name": "AlarmInterval",
          "unit": "",
          "type": "emVT_R4",
          "fVal": "10"
        }, {
          "enable": "1",
          "name": "staticele AlarmInterval",
          "unit": "",
          "type": "emVT_R4",
          "fVal": option.staticeleAlarmInterval
        }, {
          "enable": "1",
          "name": "fireex AlarmInterval",
          "unit": "",
          "type": "emVT_R4",
          "fVal": option.fireexAlarmInterval
        },
        {
          "enable": "1",
          "name": "Time AnGasStation",
          "unit": "",
          "type": "emVT_LPSTR",
          "strVal": ""
        }]
      }],


    //足球进球
    "49D6CA47-73F2-4748-A488-CF3A2CF73D05": [
      {
        "name": "ScoreClip",
        "type": "0",
        "clsid": "49D6CA47-73F2-4748-A488-CF3A2CF73D05",
        "abilityterm": [
          {
            "enable": "1",
            "name": "Enable ScoreClip",
            "unit": "",
            "type": "emVT_I4",
            "lVal": "1"
          },
          {
            "enable": "1",
            "name": "ScoreClip TaskId",
            "unit": "",
            "type": "emVT_I4",
            "lVal": "0"
          },
          {
            "enable": "1",
            "name": "ScoreClip DetectRect",
            "unit": "unit",
            "type": "emVT_POLYGON",
            "points": option.points.POLYGON[0],
          },
          {
            "enable": "1",
            "name": "sensitivity",
            "unit": "",
            "type": "emVT_R4",
            "fVal": option.fVal
          },
          {
            "enable": "1",
            "name": "Time ScoreClip", //执行时间
            "unit": "",
            "type": "emVT_LPSTR",
            "strVal": ""
          }
        ]
      },


    ],//动物识别
    "A8261BAE-3EB5-4636-A9CC-5637782EE189": [
      {
        "name": "Animal",
        "type": "0",
        "clsid": "A8261BAE-3EB5-4636-A9CC-5637782EE189",
        "abilityterm": [{
          "enable": "1",
          "name": "Enable Animal",
          "unit": "",
          "type": "emVT_I4",
          "lVal": "0"
        }, {
          "enable": "1",
          "name": "Animal TaskId",
          "unit": "",
          "type": "emVT_I4",
          "lVal": "0"
        }, {
          "enable": "1",
          "name": "Animal DetectRect",
          "unit": "unit",
          "type": "emVT_POLYGON",
          "points": option.points.POLYGON[0],
        }, {
          "enable": "1",
          "name": "sensitivity",
          "unit": "",
          "type": "emVT_R4",
          "fVal": option.fVal
        }, {
          "enable": "1",
          "name": "Time Animal",
          "unit": "",
          "type": "emVT_LPSTR",
          "strVal": ""
        }
        ]
      }
    ],
    //刀枪检测
    "99BB561E-EA54-4F13-A7E6-A11DE5C7F142": [{
      "name": "Dangerous",
      "type": "0",
      "clsid": "99BB561E-EA54-4F13-A7E6-A11DE5C7F142",
      "abilityterm": [
        {
          "enable": "1",
          "name": "Enable Dangerous",
          "unit": "",
          "type": "emVT_I4",
          "lVal": "0"
        }, {
          "enable": "1",
          "name": "Dangerous TaskId",
          "unit": "",
          "type": "emVT_I4",
          "lVal": "0"
        }, {
          "enable": "1",
          "name": "Dangerous DetectRect",
          "unit": "unit",
          "type": "emVT_POLYGON",
          "points": option.points.POLYGON[0],
        }, {
          "enable": "1",
          "name": "sensitivity",
          "unit": "",
          "type": "emVT_R4",
          "fVal": option.fVal
        }, {
          "enable": "1",
          "name": "AlarmInterval",
          "unit": "",
          "type": "emVT_R4",
          "fVal": "30"
        }, {
          "enable": "1",
          "name": "MLLM",
          "unit": "",
          "type": "emVT_I4",
          "lVal": option.mllm || "0"
        }, {
          "enable": "1",
          "name": "Time Dangerous",
          "unit": "",
          "type": "emVT_LPSTR",
          "strVal": ""
        }
      ]
    }],
    //巴基斯坦车牌识别
    "BED2D84A-BDAC-49E2-BDA0-AB909D26E11F": [{
      "name": "PlateRecognition",
      "type": "0",
      "clsid": "BED2D84A-BDAC-49E2-BDA0-AB909D26E11F",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable PlateRecognition",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "PlateRecognitionTaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "PlateRecognition DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0],
      }, {
        "enable": "1",
        "name": "sensitivity",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.fVal
      }, {
        "enable": "1",
        "name": "PlateRecognitionThreshold",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.fVal
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "30"
      }, {
        "enable": "1",
        "name": "Time PlateRecognition",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    //泰国进店人数统计
    "374CA9D-0200-4FE5-9793-859741E689D1": [{
      "name": "TaiEntryStatistics",
      "type": "0",
      "clsid": "374CA9D-0200-4FE5-9793-859741E689D1",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable TaiEntryStatistics",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "TaiEntryStatistics TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "pass DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0],
      }, {
        "enable": "1",
        "name": "pass line1",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.LINE[0]
      }, {
        "enable": "1",
        "name": "pass line2",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.LINE[1]
      }, {
        "enable": "1",
        "name": "enter DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[1],
      }, {
        "enable": "1",
        "name": "enter line1",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.LINE[2]
      }, {
        "enable": "1",
        "name": "enter line2",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.LINE[3]
      }, {
        "type": "emVT_R4",
        "unit": "",
        "fVal": option.passThresh, //经过阈值
        "enable": "1",
        "name": "pass thresh"
      }, {
        "type": "emVT_R4",
        "unit": "",
        "fVal": option.enterThresh,  //进店阈值
        "enable": "1",
        "name": "enter thresh"
      }, {
        "type": "emVT_R4",
        "unit": "",
        "fVal": 0.7,
        "enable": "1",
        "name": "extend thresh1"
      }, {
        "type": "emVT_R4",
        "unit": "",
        "fVal": 0.7,
        "enable": "1",
        "name": "extend thresh2"
      }, {
        "enable": "1",
        "name": "cameraIP",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": option.cameraIP
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "0"
      }, {
        "enable": "1",
        "name": "Time TaiEntryStatistics",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    //人车统计
    "1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F25F": [{
      "name": "AnGasStCount",
      "type": "0",
      "clsid": "1EFA1DB9-DC3E-49ED-B0CC-A2AEA1F9F25F",
      "abilityterm": [{
        "enable": "1",
        "name": "Enable AnGasStCount",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "AnGasStCount TaskId",
        "unit": "",
        "type": "emVT_I4",
        "lVal": "0"
      }, {
        "enable": "1",
        "name": "vehicle DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[0],
      }, {
        "enable": "1",
        "name": "vehicle line1",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.LINE[0]
      }, {
        "enable": "1",
        "name": "vehicle line2",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.LINE[1]
      }, {
        "enable": "1",
        "name": "person DetectRect",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.POLYGON[1],
      }, {
        "enable": "1",
        "name": "person line1",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.LINE[2]
      }, {
        "enable": "1",
        "name": "person line2",
        "unit": "unit",
        "type": "emVT_POLYGON",
        "points": option.points.LINE[3]
      }, {
        "type": "emVT_R4",
        "unit": "",
        "fVal": option.vehicleThresh,
        "enable": "1",
        "name": "vehicle thresh"
      }, {
        "type": "emVT_R4",
        "unit": "",
        "fVal": option.personThresh,
        "enable": "1",
        "name": "person thresh"
      }, {
        "type": "emVT_R4",
        "unit": "",
        "fVal": 0.7,
        "enable": "1",
        "name": "extend thresh1"
      }, {
        "type": "emVT_R4",
        "unit": "",
        "fVal": 0.7,
        "enable": "1",
        "name": "extend thresh2"
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "10"
      }, {
        "enable": "1",
        "name": "Time AnGasStCount",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],

  }
  console.log(datajson[name])
  return datajson[name]
}