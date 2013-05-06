var config = {
	"id": "myEditor",
	//编辑器的按钮存放的base dom id 或者dom
	"toolBase": 'testSaveButtons',
	"initType": {
		"name": "initFromStatic",
		"args": {
			"parent": document.getElementById('frame')
		}
	},
	//可选
	"filter": {
		"name": "pasteFilter",
		"args": {
			"tagName": "SCRIPT|INPUT|IFRAME|TEXTAREA|SELECT|BUTTON",
			"noFlashExchange": false,
			"attribute": "id"
		}
	},
	"editorName": 'SinaEditor._.entyimpl.normalEditor',
	"styles": "body {margin:0px;padding:0px;width:100%;height:100%;}.biaoqing {width:22px;height:22px;}",
	"styleLinks": ['/sinaEditor/style/css/contents.css'],
	"plugns": [{
		"name": "addContent"
	},
	{
		"name": "link"
	},{
		"name": "backcolor"
	},
	{
		"name": "forecolor"
	}, {
		"name": "underline"
	},{
		"name": "italic"
	}, {
		"name": "bold"
	}, {
		"name": "linkBubble"
	}, {
		"name": "imgBubble"
	}, {
		"name": "flashBubble"
	}, {
		"name": "redoManager"
	}, {
		"name": "fontFamily"
	}, {
		"name": "fontSize"
	}, {
		"name": "markList"
	}, {
		"name": "numberList"
	}, {
		"name": "indent"
	}, {
		"name": "outdent"
	}, {
		"name": "justifyright"
	}, {
		"name": "justifycenter"
	}, {
		"name": "justifyleft"
	}, {
		"name": "imgUI"
	}, {
		"name": "flashUI"
	}, {
		"name": "tableUI"
	}, {
		"name": "faceUI"
	},{
		"name": "historyUI",
		"args" : {
			"id" : 1
		}
	},{
		"name": "showSource",
		"args": {
			"entyArea": document.getElementById('frameToText')
		}
	}]
};