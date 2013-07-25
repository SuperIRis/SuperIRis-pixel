//class Iris
'use strict';
var SUPERWORLD = function () {
	var Character = function (charName){
		var _name			= charName,
			_domElement		= document.getElementById(charName),
			_that			= this,
			_curDir			= "down",
			_curPos			= {x:0, y:0},
			_speed			= 10,
			_keyseq			= [],
			_keyInterval	= null,
			_hadoukenInterval=null,
			_evaluateKey= function(e){
				//agregamos al array la tecla oprimida
				_keyseq.push(e.keyCode);
				//en este intervalo revisamos cada XXXms si están juntas las tres teclas, en este intervalo también se cortan las guardadas así que si no se junto en XXXms, se interrumpe la acción
				if(!_keyInterval){
					_keyInterval = setInterval(_keyCheck, 800);
				}
				if(e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode ===37){
					_walk(e);
				}
			},
			_keyCheck	= function (){
				if(_keyseq.length==0){
					//eliminar intervalo después de mucho tiempo sin moverse
					clearInterval(_keyInterval);
					_keyInterval = null;
				}
				if(_keyseq.length>=3 && _keyseq[_keyseq.length-1]==80 && _keyseq[_keyseq.length-2]==39 && _keyseq[_keyseq.length-3]==40){
					_that.hadouken();
				}
				_keyseq.length = 0;
				
			},
			_walk		= function(e){
				switch(e.keyCode){
					case 40:
						_curDir = "down";
						break;
					case 38:
						_curDir = "up";
						break;
					case 39:
						_curDir = "right";
						break;
					case 37:
						_curDir = "left";
						break;
					default:
						_curDir	= "none";
						return false;
				}
				if(_curDir != "none"){
					_keepWalking();
				}	
			},
			_stop		= function(){
				_domElement.className = _domElement.className.replace("walk1", "");
				_domElement.className = _domElement.className.replace("walk2", "");
			},
			_walking	= function(){
				switch(_curDir){
					case "down":
						_curPos.y+=_speed;
						break;
					case "up":
						_curPos.y-=_speed;
						break;
					case "right":
						_curPos.x+=_speed;
						break;
					case "left":
						_curPos.x-=_speed;
						break;
					default:
						return false;
				}
				_domElement.style.webkitTransform = "translate("+_curPos.x+"px, "+_curPos.y+"px)";
				_domElement.style.MozTransform = "translate("+_curPos.x+"px, "+_curPos.y+"px)";
				_domElement.style.msTransform = "translate("+_curPos.x+"px, "+_curPos.y+"px)";
				_domElement.style.OTransform = "translate("+_curPos.x+"px, "+_curPos.y+"px)";
				_domElement.style.transform = "translate("+_curPos.x+"px, "+_curPos.y+"px)";
				//cambiar paso (graficamente)
				//eliminar paso en el que estemos
				_domElement.className = _domElement.className.replace("walk1", "");
				_domElement.className = _domElement.className.replace("walk2", "");
				//agregar paso de acuerdo con pixel
				if(_curDir === "up" || _curDir === "down"){
					if(_curPos.y%(_speed*2)===0){
						_domElement.className = _domElement.className+" walk1";
					}
					else{
						_domElement.className = _domElement.className+" walk2";
					}
				}
				else if(_curDir === "left" || _curDir === "right"){
					if(_curPos.x%(_speed*2)===0){
						_domElement.className = _domElement.className+" walk1";
					}
					else{
						_domElement.className = _domElement.className+" walk2";
					}
				}
			},
			_keepWalking = function(){
				if(!UTILS.hasClass(_domElement, _curDir)){
					_domElement.className = _curDir;
				}
				_walking();
			},
			_animationStep = function(){
				this.step++;
				if(this.step > this.limitSteps){
					if(this.step == this.limitSteps+15){
						//mantener la posición unos segundos y regresar a normal
						this.domE.className = this.originalClassName+this.endClassName;	
					}
					if(this.step == this.limitSteps+20 || this.automaticEnd){
						//mantener la posición unos segundos y regresar a normal
						clearInterval(_hadoukenInterval);
						this.domE.className = this.originalClassName;	
					}
				}
				else{
					this.domE.className = this.originalClassName+" hadouken "+this.baseClassName+this.step;
				}
			}
		this.startCharacter = function(){
			document.onkeydown = _evaluateKey;
			document.onkeyup = _stop;
		}
		this.hadouken = function(){
			//console.log("hadouken!");
			if(_hadoukenInterval){
				clearInterval(_hadoukenInterval);
			}
			var hadoukenAnimData = {}
			hadoukenAnimData.step = 0;
			hadoukenAnimData.domE = _domElement;
			hadoukenAnimData.limitSteps = 6;
			hadoukenAnimData.baseClassName = "stepR";
			hadoukenAnimData.originalClassName = "";
			hadoukenAnimData.endClassName = "thumbsup"

			_domElement.className = _domElement.className.replace("walk1", "");
			_domElement.className = _domElement.className.replace("walk2", "");
			_domElement.className = _domElement.className.replace("hadouken", "");
			hadoukenAnimData.originalClassName = _domElement.className;
			var animateSteps = _animationStep.bind(hadoukenAnimData);
			_hadoukenInterval = setInterval(animateSteps, 100);
			
			setTimeout(function(){
				var superHadouken = new Hadouken("hadoukenBalln"+Math.floor(Math.random()*1000), {x:_domElement.getBoundingClientRect().left, y:_domElement.getBoundingClientRect().top});
				superHadouken.blast();

			}, 500);
			
			
		}

	}
	// energy hadouken ball
	var Hadouken = function(id, curPos){
		this.id			= id;
		this.domElement = document.createElement("div");
		this.speed		= 5;
		this.curPos		= curPos;
		this.step		= 0;
		//	
		this.domElement.setAttribute("id", this.id);
		this.domElement.setAttribute("class", "hadoukenBall");
		this.domElement.style.display = "none";
		document.body.appendChild(this.domElement);
	}
	Hadouken.prototype._animate = function(limit, property, loopLimitSteps, loopFramerate, originalClassName, baseClassName){
		var _distanceTolerance 	= 5,
			_realStep			= 0,
			_speed				= limit > this.curPos[property] ? this.speed : this.speed*-1;
		//revisar si el lugar a donde tiene que llegar el hadouken ya se logró 
		if(Math.abs(limit-this.curPos[property]) < _distanceTolerance ){
			//la diferencia entre la meta y lo actual es muy poquita. Romper loop
			clearInterval(this.blastInterval);
			this.die();
			if(this.domElement){
				this.domElement = null;	
			}
			return;
		}
		this.step++;
		_realStep = Math.floor(this.step/this.loopPeriod)+1;
		if(_realStep > loopLimitSteps){
			_realStep =1;
			this.step = 1;
		}
		this.domElement.className = originalClassName+" "+baseClassName+_realStep;
		this.curPos[property] = this.curPos[property]+_speed;
		this.domElement.style.webkitTransform = "translate("+this.curPos.x+"px, "+this.curPos.y+"px)";
		this.domElement.style.MozTransform = "translate("+this.curPos.x+"px, "+this.curPos.y+"px)";
		this.domElement.style.msTransform = "translate("+this.curPos.x+"px, "+this.curPos.y+"px)";
		this.domElement.style.OTransform = "translate("+this.curPos.x+"px, "+this.curPos.y+"px)";
		this.domElement.style.transform = "translate("+this.curPos.x+"px, "+this.curPos.y+"px)";
		if(this.domElement.style.display === "none"){
			this.domElement.style.display = "block";
		}
		
	};
	Hadouken.prototype.blast = function () {
		//animación de lanzar hadouken
		//dos componentes: animación loop de los estados (sprites) y animación para llegar al estado final
		var animateBlast = function(){
			this._animate(document.body.clientWidth+10, "x", 2, 5, "hadoukenBall", "step");
		}
		var animateBinded = animateBlast.bind(this);
		this.blastInterval = setInterval(animateBinded, 50);
		
	}
	Hadouken.prototype.die = function () {
		if(this.domElement && document.getElementById(this.domElement.getAttribute("id"))){
			if(document.getElementById(this.domElement.getAttribute("id")).parentNode == document.body){
				document.body.removeChild(document.getElementById(this.domElement.getAttribute("id")))
			}
		}
	}
	/////// energy hadouken ball END

	var iris = new Character("iris");
	iris.startCharacter();
}();


var UTILS = function(){
	return{
		hasClass:function (element, cls) { return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;}
	}	
}()