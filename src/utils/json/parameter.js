export function getJson(name, option) {
  const datajson = {
    //University of Hong Kong UWB display
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
			"fVal": option.personCheckThreshold || 0.6 //Personnel check threshold
		}, {
			"enable": "1",
			"name": "floorId",
			"unit": "",
			"type": "emVT_I4",
			"lVal": option.floorId || ""  //floorid
		}, {
			"enable": "1",
			"name": "distance",
			"unit": "",
			"type": "emVT_I4",
			"lVal": option.personCoordinateDistance || 500 //Personnel coordinate distance
		},{
			"enable": "1",
			"name": "person interval",
			"unit": "",
			"type": "emVT_I4",
			"lVal": option.coordinateUpdateInterval || 1000  //Coordinate update interval
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
    //Mask and earphone detection
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
			"fVal": option.earphoneThresh || 0.6 //Headphone threshold
		},
		{
			"enable": "1",
			"name": "faceMaskThresh",
			"unit": "",
			"type": "emVT_R4",
			"fVal": option.faceMaskThresh || 0.6 //Mask threshold
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
			"lVal": option.maskEarphoneFrameInterval || 1000 //Detect frame rate interval（millisecond）
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
    //vehicle statistics
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
			"name": "car thresh"   //car threshold
		},{
			"type": "emVT_R4",
			"unit": "",
			"fVal": option.vehicleMotorcycleThresh || 0.6,
			"enable": "1",
			"name": "motorcycle thresh" //motorcycle threshold
		},{
			"type": "emVT_I4",
			"unit": "",
			"lVal": option.vehicleFrameInterval || 200,
			"enable": "1",
			"name": "FrameInterval"  //Detect frame rate
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
    //Charging gun detection
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
    //Gloves, headgear and mask identification
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
    //Glove and shoe cover testing
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
        "fVal": option.glovesPersonThresh || "0.6"//personnel threshold
      }, {
        "enable": "1",
        "name": "Glove Threshold",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.glovesThresh || "0.6" //Gloves and Shoe Covers Threshold
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
    //Non-employee intrusion detection
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
        "fVal": option.intrusionPersonThresh || "0.5"  //Personnel check threshold
      }, {
        "enable": "1",
        "name": "Front pic path",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": option.intrusionFrontPic || ""  //front of clothesImageaddress
      }, {
        "enable": "1",
        "name": "Back pic path",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": option.intrusionBackPic || ""  //back of clothesImageaddress
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
    //Fence detection
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
        "fVal": option.fenceThresh || 0.6  //fence threshold
      }, {
        "enable": "1",
        "name": "person Threshold",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.fencePersonThresh || 0.6  //Human detection threshold
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
    //Gesture recognition for playing with mobile phone
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
        "name": "person Threshold",   //Human detection threshold
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
    //Headgear recognition
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
        "name": "person Threshold",  //Human detection threshold
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

    // Motor vehicle illegal parking identification
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
        "lVal": option.IllegalParkingTimeout || 0  //Violation of parking time limit
      },
      {
        "enable": "1",
        "name": "type",
        "unit": "",
        "type": "emVT_I4",
        "lVal": option.IllegalParkingtype || 0  //type
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
    //Age and gender identification
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
        "lVal": '0'  //type
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
    // Door status detection
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
        "fVal": option.Threshold1 || 0.5   //Reserved fields1
      }, {
        "enable": "1",
        "name": "Threshold2",
        "unit": "",
        "type": "emVT_I4",
        "lVal": option.Threshold2 || 0    //Reserved fields2
      }, {
        "enable": "1",
        "name": "AlarmInterval",
        "unit": "",
        "type": "emVT_R4",
        "fVal": "30"   //Alarm interval
      }, {
        "enable": "1",
        "name": "Time ThaiLicensePlate",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    //Thailand license plate recognition
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
        "fVal": option.vehicleThreshs || 0.6  //vehicle recognition threshold
      }, {
        "enable": "1",
        "name": "license Threshold",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.licenseThreshs || 0.6  //License plate recognition threshold
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


    //Expression detection
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
    //Garbage overflow detection
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
        // Loop option.points.POLYGON Insert object
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
        "fVal": option.fVal//Garbage detection threshold
      },
      {
        "enable": "1",
        "name": "type",
        "unit": "",
        "type": "emVT_R4",
        "lVal": option.garbageType || 2    //type  0: Trash can overflowing 1: littering  2:   metropolitan newspaper
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
    //Mask testing
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
        "lVal": option.types || 0  //0Not too mask alarm 1Wear a mask and call the police
      }, {
        "enable": "1",
        "name": "faceColor",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.faceColor || 0.55  //human facecolorthreshold
      }, {
        "enable": "1",
        "name": "faceWeight",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.faceWeight || 0.83  //Face quality weight
      }, {
        "enable": "1",
        "name": "maskScore",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.maskScore || 0.6  //Mask threshold
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
    // Platform water detection
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
        "fVal": option.waterThresh || 0.5, //water accumulation threshold
        "enable": "1",
        "name": "Waterlogging thresh"
      }, {
        "type": "emVT_R4",
        "unit": "",
        "fVal": option.scaleThresh || 0.5, //ruler threshold
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
    //Motorcycle helmet inspection
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
        "fVal": option.personThresh || 0.60  //personnel threshold
      }, {
        "enable": "1",
        "name": "helmetThresh Pattern",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.helmetThresh || 0.6  //Hard hat threshold
      }, {
        "enable": "1",
        "name": "motorcycleThresh Pattern",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.motorcycleThresh || 0.6  //motorcycle threshold
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
    //In-store customer detection
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
        // Loop option.points.POLYGON Insert object
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
        "fVal": option.fValperson//Person detection threshold
      }, {
        "enable": "1",
        "name": "Assistant Threshold",
        "unit": "",
        "type": "emVT_R4",
        "fVal": option.fValassistant//Store clerk detection threshold
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
        "lVal": option.retentionTime || 60 //Guest stay start time
      }, {
        "enable": "1",
        "name": "conversation time",
        "unit": "",
        "type": "emVT_I4",
        "lVal": option.conversationTime || 5 //Start time of conversation between customer and store clerk
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
    //Statistics of people entering the store
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
        "fVal": option.fVal,//Sensitivity
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
    //Vehicle driving in reverse direction (tracking)
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
        "fVal": option.fVal,//Sensitivity
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



    //fight
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
        "fVal": option.fVal,//Sensitivity
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
    //vessel identification
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
        "fVal": option.fVal,//Sensitivity
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
    //helmet color
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
        "fVal": option.fVal,//Sensitivity
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

    //Sleeping duty test
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
        "fVal": option.fVal,//Sensitivity
      }, {
        "enable": "1",
        "name": "PalyPhone Time",
        "unit": "",
        "type": "emVT_I4",
        "lVal": option.sleeptimeOut   //time Second
      }, {
        "enable": "1",
        "name": "Time IllegalBuilt",
        "unit": "",
        "type": "emVT_LPSTR",
        "strVal": ""
      }]
    }],
    //Reflective clothing
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
          "fVal": option.fVal,//Sensitivity
          "enable": "1"
        }
      ]
    }],
    //fall
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
       "fVal": option.fVal,//Sensitivity
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
      //     "fVal": option.fVal,//Sensitivity
      //     "enable": "1"
      //   }
      // ]

    }],
    //stay
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
          "lVal": option.timeOut,  //Residence time seconds
          "enable": "1"
        }
      ]
    }],
    //Vehicle traveling in the wrong direction
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
            "fVal": option.fVal//Sensitivity
          },
          {
            "enable": "1",
            "name": "type",
            "unit": "",
            "type": "emVT_R4",
            "fVal": option.type //0Vehicle alarm detected  1Rear alarm detected
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


    //legacy
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
            "lVal": option.DelayTime //Remaining time in seconds
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


    //Off-duty testing
    'F7581B40-A9F9-498E-A510-14F40009C545': [{
      "name": "Leave Post",
      "type": "0",
      "clsid": "F7581B40-A9F9-498E-A510-14F40009C545",
      abilityterm: [
        {
          "enable": "1",
          "name": "Detect Area", //Detection position
          "unit": "unit",
          "type": "emVT_POLYGON",
          "points": option.points.POLYGON[0],
        },
        {
          "enable": "1",
          "name": "sensitivity",
          "unit": "",
          "type": "emVT_R4",
          "fVal": option.fVal//Sensitivity
        },
        {
          "enable": "1",
          "name": "LeavePost TimeOut", //Off duty time
          "unit": "",
          "type": "emVT_I4",
          "lVal": option.tuotime || 30 //default30minute
        }
      ]
    }],

    //Density detection
    'F7581B40-A9F9-498E-A510-14F40010C545': [{
      "name": "Density",
      "type": "0",
      "clsid": "F7581B40-A9F9-498E-A510-14F40010C545",
      "abilityterm": [
        {
          "enable": "1",
          "name": "DensityDetect DeviceId",//Streaming equipmentID
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
          "fVal": option.userNum//Number of people
        },
        {
          "enable": "1",
          "name": "sensitivity",
          "unit": "",
          "type": "emVT_R4",
          "fVal": option.fVal//Sensitivity
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
          "lVal": option.alarmType//Alarm type
        }
      ]
    }],
    //Intrusion detection
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
    //Climb high detection
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
    //Face recognition (win version)
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
            "lVal": option.faceWeightwin || 7 //face quality
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
            "lVal": option.frameInterval || "400" //Face detection interval（millisecond）
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
    //face recognition
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


    //helmet
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
    //Electric vehicles entering the home
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
    //Pyrotechnic detection
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
    //Smoking test
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
            "fVal": option.fVal//Sensitivity
          },
          {
            "enable": "1",
            "name": "SmokingDetect Pattern",
            "unit": "",
            "type": "emVT_R4",
            "fVal": '1'//0:Remote recognition does not detect smoke，Only recognize gestures1:Detect smoke nearby，Recognize gestures simultaneously
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
    //Illegal parking
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
            "fVal": option.fVal//Sensitivity
          }, {
            "enable": "1",
            "name": "IllegalParking Timeout",
            "unit": "",
            "type": "emVT_I4",
            "lVal": option.MaxCount  //Congestion alarm time in seconds
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
    //Play with mobile phone
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
            "fVal": option.fVal//Sensitivity
          },
          {
            "enable": "1",
            "name": "PalyPhone Time",
            "unit": "",
            "type": "emVT_I4",
            "lVal": option.lVal//time minutes
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
    //Illegal refueling
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
            "fVal": option.fVal//Sensitivity
          },
          {
            "enable": "1",
            "name": "Detect Distance",
            "unit": "",
            "type": "emVT_R4",
            "fVal": option.distance//The distance between oil barrels and people
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

    //Gas station inspection
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


    //soccer goal
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
            "name": "Time ScoreClip", //Execution time
            "unit": "",
            "type": "emVT_LPSTR",
            "strVal": ""
          }
        ]
      },


    ],//animal identification
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
    //Knife and gun detection
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
    //Pakistani license plate recognition
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
    //Statistics of people entering stores in Thailand
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
        "fVal": option.passThresh, //Passed threshold
        "enable": "1",
        "name": "pass thresh"
      }, {
        "type": "emVT_R4",
        "unit": "",
        "fVal": option.enterThresh,  //Store entry threshold
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
    //Statistics of people and vehicles
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