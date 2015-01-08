dataCenter.factory("protocolService", function() {
	var moduleProtocol = {
		root: {
			digest: 'text',
			fn: 'text',
			sessionId: 'text',
			success: ['true', 'false'],
			tid: 'text',
			tv: 'text',
			cmd: 'object'
		},
		parameter: {
			name: 'text',
			display: ['true', 'false'],
			params: 'object',
			progressBar: 'object',
			form: 'object'
		},
		params: {
			channelType: ['balance'],
			sessionId: 'text'
		},
		progressBar: {
			needCover: ['true', 'false'],
			text: 'text'
		},
		cmd: {
			cancel: 'text',
			load: 'text',
			ner: 'text',
			netTryCount: 'num',
			ok: 'text',
			retry: 'text',
			ser: 'text',
			up2g: ['T', 'F'],
			upLog: ['T', 'F'],
			wCookie: ['T', 'F']
		},
		form: {
			oneTime: ['true', 'false'],
			actionBar: 'object',
			onback: 'object',
			wapintercept: 'object',
			scroll: ['true', 'false'],
			syncScrollState: 'text',
			type: ['fullscreen', 'popupwin']
		},
		blocks: {
			type: ["block", "component", "button", "checkbox", "label", "img", "icon", "link", "line", "expandableSelector", "spassword"],
			block: ['width','height', 'align', 'vertical-align', 'margin', 'padding',
						'image', 'filter', 'css', 'display', 'content'],
			component: ['width','height', 'align', 'vertical-align', 'margin', 'padding',
						'image', 'filter', 'css', 'display', 'content'],
			button: ['action', 'width','height', 'align', 'vertical-align', 'margin', 'padding', 'color', 'size',
						'image', 'text', 'filter', 'css', 'display', 'submit', 'checkInput'],
			label: ['width','height', 'align', 'vertical-align', 'margin', 'padding', 'color', 'size',
						'image', 'text', 'text-align', 'filter', 'html', 'underline', 'css', 'display'],
			img: ['width','height', 'align', 'vertical-align', 'margin', 'padding', 'color',
						'image', 'css', 'display'],
			icon: ['width','height', 'align', 'vertical-align', 'margin', 'padding', 'color',
						'image', 'css', 'display'],
			link: ['action', 'width','height', 'align', 'vertical-align', 'margin', 'padding', 'color', 'size',
						'image', 'text', 'text-align', 'filter', 'html', 'underline', 'css', 'display'],
			line: ['width','height', 'align', 'vertical-align', 'margin', 'padding', 'color', 'size',
						'image', 'text', 'text-align', 'filter', 'html', 'underline', 'css', 'display'],
			input: ['width','height', 'align', 'vertical-align', 'margin', 'padding', 'display', 'imeAct',
						'hint', 'empty_msg', 'keyboard'],
			checkbox: ['width','height', 'align', 'vertical-align', 'margin', 'padding', 'display',
						'format_msg', 'must'],
			password: ['width','height', 'align', 'vertical-align', 'margin', 'padding', 'display', 'imeAct',
						'hint', 'empty_msg', 'keyboard'],
			expandableSelector: ['width','height', 'align', 'vertical-align', 'margin', 'padding', 'color', 'size',
						'image', 'text', 'text-align', 'filter', 'html', 'underline', 'css', 'display'],
			spassword: ['width','height', 'align', 'vertical-align', 'margin', 'padding',
						'css', 'display', 'cursor', 'auto', 'keyboard', 'action']
		},
		actionBar: {
			title: 'text',
			left: 'text'
		},
		onback: {
			allowBack: ['true', 'false'],
			backDialog: 'text',
			disableBack: ['true', 'false'],
			name: 'text'
		},
		wapintercept: {
			value: 'list'
		},
		wapinterceptvalue: {
			name: ['pc', 'mobile'],
			exitOnBack: 'text',
			whitelist: 'array'
		}
	};
	var moduleProtocolValues = {
		width: 'text',
		height: 'text',
		align: ['left', 'center', 'right'],
		'vertical-align': ['top', 'middle', 'bottom'],
		margin: 'text',
		padding: 'text',
		color: 'color',
		size: 'text',
		image: 'color',
		text: 'text',
		'text-align': ['left', 'center', 'right'],
		filter: 'text',
		html: 'text',
		underline: ['true', 'false'],
		css: 'text',
		display: ['true', 'false'],
		content: ['bottomView'],
		action: 'text',
		imeAct: ['next', 'done'],
		hint: 'text',
		empty_msg: 'text',
		keyboard: ['en', 'cn', 'num'],
		auto: ['true', 'false'],
		cursor: ['true', 'false'],
		must: ['true', 'false'],
		format_msg: 'text',
		submit: ['true', 'false'],
		checkInput: ['true', 'false']
	};

	return {
		isModuleProperty: function(name) {
			return name in moduleProtocol;
		},
		getProtocol: function(sector) {
			return moduleProtocol[sector];
		},
		getProtocolValue: function(protocol) {
			return moduleProtocolValues[protocol];
		},
		getProtocolDefaultValue: function(protocol) {
            if (name === 'align' || name === 'text-align') {
                return 'left';
            } else if (name === 'width') {
                return -1;
            } else if (name === 'height') {
                return -2;
            } else if (name === 'vertical-align') {
                return 'top';
            } else if (name === 'display') {
                return 'true';
            } else if (name === 'content') {
                return 'bottomView';
            } else {
            	return '';
            }
		},
		getDefaultModule: function(type) {
        	var module = {};
			module.type = type;
			if (type === "block" || type === "component") {
				module.width = -1;
				module.height = -2;
			} else if (type === "button") {
				module.width = -2;
				module.height = -2;
				module.text = 'Button';
				module.size = 34;
				module.image = "local:normal;local:hover;local:disable";
			} else if (type === "label" || type === 'link') {
				module.width = -2;
				module.height = -2;
				module.text = type;
				module.textAlign = "left";
				module.size = 34;
				if (type === 'link') {
					module.underline = 'true';
				}
			} else if (type === "img") {
				module.width = -2;
				module.height = -2;
				module.src = '';
			} else if (type === "line") {
				module.width = -1;
				module.height = 1;
				module.image = 'rgb(255, 0, 0)';
			}

			return module;
		},
		parseBackground: function(imageCode) {
			if (imageCode === 'local:middle_line') {
				return '#C0C0C0';
			} else if (imageCode === 'local:normal;local:hover;local:disable') {
				return 'rgb(214,15,15)';
			} else if (imageCode === 'local:normal;local:disable;local:hover') {
				return 'rgb(163, 163, 163)';
			} else if (imageCode === 'local:normal_second;local:hover_second;local:disable_second') {
				return 'rgb(255, 255, 255)';
			} else if (imageCode.slice(0, 6) === 'local:') {
				return 'url(res/' + imageCode.slice(6) + '.png) no-repeat';
			} else {
				return imageCode;
			}
		},
		generateUuid: function() {
    		return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
		}
	};
});