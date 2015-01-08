device.factory("styleService", function($rootScope, $timeout, dataService) {
    var createView = function(compile, scope, target, append, elementId, type) {
		var directive = 'system-widget';
	    if (type === 'expandableSelector') {
	    	directive = 'expandable-selector';
	    }  else if (type === 'combox') {
	    	directive = 'combox-selector';
	    }

		var element = compile("<div " + directive + " element-id='" + elementId + "' type='" + type + "'></div>")(scope);
		if (append) {
            target.append(element);
        } else {
            element.insertBefore(target);
        }
   	};
	var processFilter = function(filter) {
		var result = {};
			if (filter) {
                var start = filter.indexOf('(');
                var end = filter.indexOf(')')
                if (start > 0 && end > start + 1) {
                    var filterName = filter.slice(0, start);
                    var filterValue = filter.slice(start + 1, end);
                    if (filterName === 'corner') {
                    	result[filterName] = filterValue * dpiRatio + 'px';
                    }
                }
            }
        return result;
	};
	var processAlign = function(align, verticlAlign) {
		var result = ['flex-start', 'flex-start'];
		if (align) {
			if (align == 'left') {
				result[0] = 'flex-start';
			} else if (align == 'center') {
				result[0] = 'center';
			} else if (align == 'right') {
				result[0] = 'flex-end';
			}
		}
		if (verticlAlign) {
			if (verticlAlign == 'top') {
				result[1] = 'flex-start';
			} else if (verticlAlign == 'middle') {
				result[1] = 'center';
			} else if (verticlAlign == 'bottom') {
				result[1] = 'flex-end';
			}
		}
		return result;
	};
	var processText = function(text) {
		if (text) {
			var result = '';
			var start = text.indexOf('{{');
			var end = text.indexOf('}}');
			if (start >= 0 && end > start + 2) {
				var key = text.slice(start + 2, end);
				var value = this.getVariable(key);
				if (value) {
					return value;
				} else {
					return text;
				}
			} else {
				return text;
			}
		}
	};
	var processWidth = function(width, moduleType) {
    	if (width) {
			if (width == -1) {
				return "100%";
			} else if (width == -2) {
				return '';
			} else {
				var presentIndex = width.indexOf('%');
				if (presentIndex < 0) {
					var pxIndex = width.indexOf('px');
					if (pxIndex > 0) {
						width = width.slice(0, pxIndex);
					}
					return width * dpiRatio +'px';
				} else {
					return width;
				}
			}
    	} else {
    		if (moduleType === 'block' || moduleType === 'component' || moduleType === 'button') {
    			return '100%';
    		} else {
    			return '';
    		}
    	}
	};
	var processHeight = function(height, moduleType) {
    	if (height) {
			if (height == -1) {
				return "100%";
			} else if (height == -2) {
				return '';
			} else {
				var presentIndex = height.indexOf('%');
				if (presentIndex < 0) {
					var pxIndex = height.indexOf('px');
					if (pxIndex > 0) {
						height = height.slice(0, pxIndex);
					}
					return height * dpiRatio +'px';
				} else {
					return height;
				}
			}
    	} else {
    		return '';
    	}
	};
	var processPadding = function(padding) {
		var result = [];
        if (padding) {
            var margins = padding.split(" ");
            result.push((margins[0] ? margins[0].trim() *2/3 : 0) + 'px');
            result.push((margins[1] ? margins[1].trim() *2/3 : 0) + 'px');
            result.push((margins[2] ? margins[2].trim() *2/3 : 0) + 'px');
            result.push((margins[3] ? margins[3].trim() *2/3 : 0) + 'px');
        } else {
            result.push('0px');
            result.push('0px');
            result.push('0px');
            result.push('0px');
        }
        return result;
	};
	var updateStyle = function(style, elementId) {
		var module = dataService.getModule(elementId);
		var width = processWidth(module.width, module.type);
		var height = processHeight(module.height, module.type);
		var margin = processPadding(module.margin);
        style['margin-top'] = margin[0];
        style['margin-left'] = margin[1];
        style['margin-bottom']  = margin[2];
        style['margin-right'] = margin[3];
        if (width.indexOf('%') > 0) {
        	var marginLR = parseInt(margin[1].slice(0, margin[1].indexOf('px')))
        			+ parseInt(margin[3].slice(0, margin[3].indexOf('px')));
        	width = 'calc(' + width + ' - ' + marginLR + 'px)';
        }

		style['font-size'] = module.size * dpiRatio;
		style['width'] = width;
		style['height'] = height;
		style['max-width'] = width;
		style['max-height'] = height;
		if (module.type === 'img' || module.type === 'icon') {
			style['min-width'] = width;
			style['min-height'] = height;
		}

		var text = processText(module.text);
		if (text) {
			style['text'] = text;
		}

		if (elementId) {
			var hvAlign = processAlign(module.align, module['vertical-align']);
			var parentId = dataService.findhierarchyParentId(loadingHierarchy, elementId);
			var parent = dataService.findHierarchyContent(loadingHierarchy, parentId);
			var parentStyle = widgetStyleMap[parentId];
			if (parentId == 'root' || parent.type === 'block') {
				style['align-self'] = hvAlign[0];
				parentStyle['justify-content'] = hvAlign[1];
			} else if (parent.type === 'component') {
				style['align-self'] = hvAlign[1];
				if ((parentStyle['justify-content'] === 'space-between') || (parentStyle['justify-content'] === 'flex-start' && hvAlign[0] === 'flex-end')
					|| (parentStyle['justify-content'] === 'flex-end' && hvAlign[0] === 'flex-start')) {
					parentStyle['justify-content'] = 'space-between';
				} else {
					parentStyle['justify-content'] = hvAlign[0];
				}
			}
			style['text-align'] = module['text-align'];
		}
		
		if (module.html === 'true' && module.text) {
			// element.html(module.text);
		}

		if (module.type === 'block' || module.type === 'component'
				|| module.type === 'line' || module.type === 'button') {
			if (module.image) {
				style['background'] = parseBackground(module.image);	
			} else if (module.color) {
				style['background'] = module.color;
			}
		} else if (module.type === 'img' || module.type === 'icon') {
			if (module.image) {
				if (module.image.slice(0, 6) === 'local:') {
					style['src'] = 'res/' + module.image.slice(6) + '.png';
				} else {
					style['src'] = 'res/' + module.image + '.png';
				}
			}
		}
		style['color'] = module.color;
		if (module.type === 'label' && !(module.color)) {
			style['color'] = "rgb(0, 0, 0)";
		}

		var padding = processPadding(module.padding);
        style['padding-top'] = padding[0];
        style['padding-left']  = padding[1];
        style['padding-bottom']  = padding[2];
        style['padding-right']  = padding[3];

        if ((module.type === 'input' || module.type === 'password') && style['padding-left'] === '0px') {
        	style['padding-left'] = '8px';
        } else if (module.type === 'button') {
        	if (style['padding-top'] === '0px') {
        		style['padding-top'] = '8px';
        	}
        	if (style['padding-bottom'] === '0px') {
        		style['padding-bottom'] = '8px';
        	}
        }

        var filterMap = processFilter(module.filter);
        if ('corner' in filterMap) {
        	style['border-radius'] = filterMap['corner'];
        }

        if (module.hint) {
        	style['placeholder'] = module.hint;
        }
	};

	var widgetStyleMap = {};

	return {
		refersh: function(loadingHierarchy) {
			widgetStyleMap = {};
		},
		getWidgetStyle: function(elementId) {
			var style = widgetStyleMap[elementId];
			if (!style) {
				style = {
					'box-sizing': 'border-box'
				};
				widgetStyleMap[elementId] = style;
			}
			return style;
		},
		createWidget: function(compile, scope, target, append, elementId, type) {
			createView(compile, scope, target, append, elementId, type);
		},
    	branchCreateWidget: function(compile, scope, target, values) {
    		if (!values) {
    			return;
    		}

	    	values.forEach(function (value, index) {
	    		createView(compile, scope, target, true, value.name, value.type);
	    	});
    	},
    	highlightWidget: function(elementId) {
    		for (var key in widgetStyleMap) {
    			var style = widgetStyleMap[key];
    			if (key === elementId) {
    				style['border'] = '2px dashed red';
                } else {
					style['border'] = '';
                }
    		}
    	}
	};
});