var Int = parseInt;
var Float = parseFloat;
var enc = encodeURIComponent;

function RenderTemplate(template,obj,obj_name){
	//render [#=something#]
	function __(template,obj,obj_name){
		eval("var "+obj_name+"=obj");
		var m,t = template;
		while(m = t.match(/\[#\=(.*?)#\]/)){
			t = t.replace(m[0],eval(m[1]));
		}
		return t;
	};
	//blablabla
	var m,t = template,frags=[],commands=[],p=0;
	//divide the template
	while(m = t.match(/\[#([^\=].*?)#\]/)){
		frags.push(t.substr(0,t.indexOf(m[0])));
		commands.push(m[1]);
		t = t.substr(t.indexOf(m[0])+m[0].length);
	}
	frags.push(t);
	//combine the frags
	var result="",str="";
	for (var _=0; _ < commands.length; _++) {
		if (frags[_].trim() != "") 
			str+="result+=__('"+frags[_]+"',obj,obj_name);";
		str+=commands[_];
	};
	str+="result+=__('"+frags[_]+"',obj,obj_name);";
	//execute
	eval(str);
	return result;
}
Function.prototype.bind = function(){
    function generateArray(ori){
        var args = [];
        for(var i=0;i<ori.length;++i) args[i] = ori[i];
        return args;
    }
    //if (arguments.length < 2 && typeof(arguments[0]) == "undefined") return this;
    var args = generateArray(arguments);
    var __method = this, object = args.shift();
    return function(){
        var _args = generateArray(arguments);
        return __method.apply(object, args.concat(_args));
    };
};