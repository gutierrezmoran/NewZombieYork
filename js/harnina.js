var DAM = DAM || {};

DAM.namespace = function(ns_string) {
    var parts = ns_string.split('.'),
        parent = DAM,
        i;
    if (parts[0] === "DAM") {
        parts = parts.slice(1); // El método slice() devuelve una copia de una parte del array dentro de un nuevo array empezando por inicio hasta fin (fin no incluido). El array original no se modificará. Aqui si.

        for (i = 0; i < parts.length; i += 1) {

            if (typeof parent[parts[i]] === "undefined") {
                // Ventana['tamanoVentana'] === Ventana.tamanoVentana
                parent[parts[i]] = {}; // Ventana['tamanoVentana'] = {}
            }
            parent = parent[parts[i]];
        }
     return parent;
 }
    return "otro Universo";
};

//- ---------------------------------DAM.Ventana -------------------
//var Ventana = Ventana || {}; Ya no se hace asi
DAM.namespace('DAM.Ventana');

DAM.Ventana = (function () {
	'use strict';
    var API = {};

  API.Calcular = function () {
        var dimension = [2];
        if( typeof( window.innerWidth ) == 'number' ) {
		    //No-IE
		    dimension[0] = window.innerWidth;
		    dimension[1] = window.innerHeight;

		  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
			    //IE 6+
			    dimension[0] = document.documentElement.clientWidth;
			    dimension[1] = document.documentElement.clientHeight;

					  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
								    //IE 4 compatible
						dimension[0] = document.body.clientWidth;
						dimension[1] = document.body.clientHeight;
					    		}
	    API.Ancho = dimension[0];
        API.Alto = dimension[1];

    };
    API.Navegador = function(){

             var ie = navigator.userAgent.toLowerCase().indexOf('msie') != -1;
             console.log(navigator.userAgent);

             if(ie) return true;
                else return false;
    };

return API;

}());

//------------- funciones Matematicas  ----------------
DAM.namespace('DAM.GenerarNumero');
DAM.GenerarNumero = function (max, min) {
          return parseInt((Math.random() * (max - min + 1) + min));
        };
//------------ Simbolo para document.getElementById -------
var $ = function(id) {
       return document.getElementById(id);
   }
// ------   requestAnimFrame    -------------------------------
window.requestAnimFrame = ( function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function ( /*function */callback, /* DOMElement*/element ) {
            window.setTimeout( callback, 1000 / 60 );
        };
} ) ();
/**
 * CrossBrowser implementation for a Event Listener
 */
function addListener ( element, type, expression, bubbling ) {
    bubbling = bubbling || false;

    if ( window.addEventListener ) { // Standard
        element.addEventListener( type, expression, bubbling );
    } else if ( window.attachEvent ) { // IE
        element.attachEvent( 'on' + type, expression );
    } else {
        return false;
    }
}

//-------------------- Calcular ancho alto left top de un elemento -----


DAM.namespace ("DAM.getAncho");
DAM.getAncho = function(elemento){
    if(elemento.offsetWidth+"px"){
        return elemento.offsetWidth;
    }
    else{
        return elemento.style.pixelWidth;
    }
}

DAM.namespace ("DAM.getAlto");
DAM.getAlto = function(elemento){
    if(elemento.offsetHeight+"px"){
        return elemento.offsetHeight;
    }
    else{
        return elemento.style.pixelHeigth;
    }
}

DAM.namespace ("DAM.getLeft");
DAM.getLeft = function(elemento){
    if(elemento.offsetLeft+"px"){
        return elemento.offsetLeft;
    }
    else{
        return elemento.style.pixelLeft;
    }
}

DAM.namespace ("DAM.getTop");
DAM.getTop = function(elemento){
    if(elemento.offsetTop+"px"){
        return elemento.offsetTop;
    }
    else{
        return elemento.style.pixelTop;
    }
}

//----------------------------------
