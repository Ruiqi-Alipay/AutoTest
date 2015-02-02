device.factory("styleService", function($rootScope, $timeout, dataService, protocolService) {
	var dpiRatio = 2 / 3;

    var createWidget = function(compile, scope, target, append, elementId) {
    	var type = dataService.getModule(elementId).type;
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
   	var branchCreateWidget = function(compile, scope, target, values) {
		if (!values) {
			return;
		}

    	values.forEach(function (value, index) {
    		createWidget(compile, scope, target, true, value.id);
    	});
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
				var value = dataService.getVariable(key);
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

					if (moduleType === 'icon') {
						return width / dpiRatio +'px';
					} else {
						return width * dpiRatio +'px';
					}
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

					if (moduleType === 'icon') {
						return height / dpiRatio +'px';
					} else {
						return height * dpiRatio +'px';
					}
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
	var updateStyle = function(elementId) {
		var style = widgetStyleMap[elementId];
		delete style['regex'];
		var module = dataService.getModule(elementId);

		var hvAlign = processAlign(module.align, module['vertical-align']);
		var parentId = dataService.findParentIdInHierarchy(elementId);
		var parent = dataService.getModule(parentId);
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

		var width = processWidth(module.width, module.type);
		var height = processHeight(module.height, module.type);
		var margin = processPadding(module.margin);
        style['margin-top'] = margin[0];
        style['margin-left'] = margin[1];
        style['margin-bottom']  = margin[2];
        style['margin-right'] = margin[3];

        if (parent && parent.type === 'component' && width === '100%') {
        	delete style['width'];
        	delete style['max-width'];
        	style['flex-grow'] = 2;
        } else {
	        if (width.indexOf('%') > 0) {
	        	var marginLR = parseInt(margin[1].slice(0, margin[1].indexOf('px')))
	        			+ parseInt(margin[3].slice(0, margin[3].indexOf('px')));
	        	width = 'calc(' + width + ' - ' + marginLR + 'px)';
	        }

	        style['width'] = width;
	        style['max-width'] = width;
	        delete style['flex-grow'];
        }

        if (module.type === 'input') {
        	style['font-size'] = module.size;
        } else {
        	style['font-size'] = module.size * dpiRatio;
        }

		style['height'] = height;
		style['max-height'] = height;
		if (module.type === 'img' || module.type === 'icon') {
			style['min-width'] = width;
			style['min-height'] = height;
		}

		var text = processText(module.text);
		if (text) {
			style['text'] = text;
		}
		
		if (module.html === 'true' && module.text) {
			// element.html(module.text);
		}

		if (module.type === 'block' || module.type === 'component'
				|| module.type === 'line' || module.type === 'button') {
			if (module.image) {
				protocolService.parseBackground(style, module.image);	
			} else if (module.color) {
				style['background'] = module.color;
			}
		} else if (module.type === 'img' || module.type === 'icon') {
			if (module.image) {
				if (module.image.slice(0, 6) === 'local:') {
					style['src'] = 'modules/android/res/' + module.image.slice(6) + '.png';
				} else {
					style['src'] = 'modules/android/res/' + module.image + '.png';
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

        if (module.type === 'button') {
        	style['text-align'] = 'center';
        	style['vertical-align'] = 'middle';
        } else if (module.type === 'combox') {
        	if (!style.height) {
        		style.height = processHeight('60', module.type);
        	}
        	style['background-size'] = '78px 40px';
        } else if (module.type === 'img') {
        	if (!style.width && !style.height) {
        		style['-webkit-transform'] = 'scale(0.66)';
        	}
        }

        style['background-size'] = style.width + ' ' + style.height;
	};
	var highlightWidget = function(elementId) {
		if (priviousHighlishtElement) {
			if (elementId === priviousHighlishtElement) {
				return;
			}
			var previousStyle = widgetStyleMap[priviousHighlishtElement];
			previousStyle.border = priviousHighlishtElementBorder;
		}

		var style = widgetStyleMap[elementId];
		priviousHighlishtElement = elementId;
		priviousHighlishtElementBorder = style.border;
		style['border'] = '2px dashed red';
	};
    var newActivityStyle = function(actionBar, popupwin) {
    	var style = {};
        if (popupwin) {
            style['width'] = '80%';
            style['height'] = '';
            style['align-self'] = 'center';
            style['background'] = 'white';
            style['border-radius'] = '4px';
            style['-moz-box-shadow'] = '0 0 5px 5px #C0C0C0';
            style['-webkit-box-shadow'] = '0 0 5px 5px #C0C0C0';
            style['box-shadow'] = '0 0 5px 5px #C0C0C0';
            style['margin'] = 'auto auto';
            style['padding-top'] = '0px';
        } else {
        	if (actionBar) {
        		style['padding-top'] = '48px';
        	}
            style['width'] = '100%';
            style['max-width'] = '100%';
            style['background'] = '#eee';
            style['border-radius'] = '';
            style['-moz-box-shadow'] = '';
            style['-webkit-box-shadow'] = '';
            style['box-shadow'] = '';
            style['margin'] = '';
            style['padding-bottom'] = '';
        }

        return style;
    };

	var widgetStyleMap = {};
	var priviousHighlishtElement;
	var priviousHighlishtElementBorder;

	return {
		refreshActivity: function(compile, scope, target) {
			var actionBar = dataService.getActionbar();
			widgetStyleMap = {'root': newActivityStyle(actionBar, false)};
			var root = dataService.findHierarchyItem('root');
			branchCreateWidget(compile, scope, target, root.childs);
			return widgetStyleMap['root'];
		},
		refreshActionbar: function() {
			var actionbar = dataService.getActionbar();
			if (actionbar) {
				widgetStyleMap['actionbar'] = actionbar;
				return actionbar;
			} else {
				delete widgetStyleMap['actionbar'];
			}
		},
		getWidgetStyle: function(elementId) {
			var style = widgetStyleMap[elementId];
			if (!style) {
				style = {'box-sizing': 'border-box'};
				widgetStyleMap[elementId] = style;
				if (elementId != 'root') {
					updateStyle(elementId);
				}
			}
			return style;
		},
    	branchCreateWidget: function(compile, scope, target, elementId) {
    		var node = dataService.findHierarchyItem(elementId);
    		branchCreateWidget(compile, scope, target, node.childs);
    	},
    	highlightWidget: function(elementId) {
    		highlightWidget(elementId);
    	},
    	setupViewListener: function(compile, scope, element, elementId, type) {
    		scope.$on('display:change:' + elementId, function(event) {
    			updateStyle(elementId);
    			if (elementId === priviousHighlishtElement) {
    				widgetStyleMap[elementId]['border'] = '2px dashed red';
    			}
    		});

            scope.$on('display:delete:' + elementId, function(event) {
                element.remove();
            });

            scope.$on('display:insert:' + elementId, function(event, name) {
                createWidget(compile, scope, element, false, name);
            });

            if (type === "component" || type === "block") {
                scope.$on('display:append:' + elementId, function(event, name) {
                    createWidget(compile, scope, element, true, name);
                });
            } else {
            	scope.$on('display:variable:change', function(event) {
                    updateStyle(elementId);
                });
            }

            element.bind('click', function (event) {
            	event.stopPropagation();
            	scope.$apply(function() {
			    	highlightWidget(elementId);
			    	dataService.onSelectPanel(elementId);
			    });
            });
    	}
	};
});