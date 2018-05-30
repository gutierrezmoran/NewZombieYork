var game = (function() {

    // Variables globales.
    var window = this.window, document = this.document, canvas, ctx, buffer, bufferCtx, background, keyboard, zombie, obstacles = [], coins = [], nodoMusica, record, nodoVelocidad, nodoObstaculos, nodoCoin, nodoCentesimas, nodoSegundos, nodoMinutos, nodoHoras, nodoCentesimasRecord, nodoSegundosRecord, nodoMinutosRecord, nodoHorasRecord, speed, speedPlayer, pass, coin, centesimas = 0, segundos = 0, minutos = 0, horas = 0, intervalCronometro, intervalSpeed, detenerAnim = false, objectGenerator, nodoModal, nodoReiniciarPartida, nodoIrMenu, nodoBotonInstrucciones, nodoInstrucciones, nodoCerrarInstrucciones;

    // Almacena los nodos en variables (es llamada antes del retorno de game).
    function getNodes() {
        nodoMusica = document.getElementById("musica");
        nodoVelocidad = document.getElementById("valorVelocidad");
        nodoObstaculos = document.getElementById("valorObstaculos");
        nodoCoin = document.getElementById("cantidadMonedas");
        nodoCentesimas = document.getElementById("Centesimas");
        nodoSegundos = document.getElementById("Segundos");
        nodoMinutos = document.getElementById("Minutos");
        nodoHoras = document.getElementById("Horas");
        nodoCentesimasRecord = document.getElementById("CentesimasRecord");
        nodoSegundosRecord = document.getElementById("SegundosRecord");
        nodoMinutosRecord = document.getElementById("MinutosRecord");
        nodoHorasRecord = document.getElementById("HorasRecord");
        nodoModal = document.getElementById("modal");
        nodoReiniciarPartida = document.getElementById("botonReiniciar");
        nodoIrMenu = document.getElementById("botonIrMenu");
        nodoBotonInstrucciones = document.getElementById("instrucciones");
        nodoInstrucciones = document.getElementById("cajaInstrucciones");
        nodoCerrarInstrucciones = document.getElementById("cerrarInstrucciones");
    }

    /*
    *   Esta función comprueba si el valor de iteraciones almacenada en la cookie es menor
    *   a la actual de la partida, de ser así, significa que hemos conseguido un record.
    */
    function isRecord() {
        return window.localStorage.getItem('record') < record;
    }

    /*
    *   Estas son funciones getters que obtienen el valor de cada cookie del cronómetro.
    */
    function getSegundoRecord() {
        return window.localStorage.getItem('segundos');
    }

    function getMinutoRecord() {
        return window.localStorage.getItem('minutos');
    }

    function getHoraRecord() {
        return window.localStorage.getItem('horas');
    }

    /*
    *   Esta función se encarga de representar en los nodos HTML la información de las cookies del cronometro.
    *   Las diferentes condicionales se encargan de comprobar que dichas cookies nunca han sido utilizadas, porque
    *   de ser así es necesario representar el valor junto a un 0 para completar la doble cifra. En cambio, si
    *   la cookie ya ha sido utilizada, su valor vendrá con doble cifra y solo será necesario adjuntar los
    *   dos puntos de separación.
    *
    *   El motivo de realizar una comprobación del número 0 como String, es que los valores que nos devuelven
    *   las cookies son de tipo String.
    *
    *   En el caso de las centésimas no nos molesta debido a su velocidad.
    */
    function updateRecordNode() {

        nodoCentesimasRecord.innerHTML = ":" + window.localStorage.getItem('centesimas');

        if (getSegundoRecord() === "0") {
            nodoSegundosRecord.innerHTML = ":0" + window.localStorage.getItem('segundos');
        } else {
            nodoSegundosRecord.innerHTML = ":" + window.localStorage.getItem('segundos');
        }

        if (getMinutoRecord() === "0") {
            nodoMinutosRecord.innerHTML = ":0" + window.localStorage.getItem('minutos');
        } else {
            nodoMinutosRecord.innerHTML = ":" + window.localStorage.getItem('minutos');
        }

        if (getHoraRecord() === "0") {
            nodoHorasRecord.innerHTML = "0" + window.localStorage.getItem('horas');
        } else {
            nodoHorasRecord.innerHTML = window.localStorage.getItem('horas');
        }

    }

    /*
    *   Esta función actualiza las cookies encargadas de guardar el record de la partida.
    *
    *   La cookie "record" guarda el número de iteraciones que se realizan de la función
    *   cronómetro, es a través de esta por la cual sabemos si se ha realizado un record.
    *
    *   El resto de cookies no hace falta explicarlas. Las condicionales comprueban si el
    *   estado de las variables es -1, porque de ser así, significa que realmente hay que
    *   representar el último valor, cada cual en cada caso, pues el siguiente al -1 es el
    *   cero. De no cumplirse la condición, sabremos que no estamos en el límite final y
    *   se guardará en la cookie el valor que marque la variable. (Me costó entender el
    *   funcionamiento de esta parte, pero lo logré).
    */
    function updateRecord() {
        window.localStorage.setItem('record', record);

        if (centesimas === -1) {
            window.localStorage.setItem('centesimas', 99);
        } else {
            window.localStorage.setItem('centesimas', centesimas);
        }

        if (segundos === -1) {
            window.localStorage.setItem('segundos', 59);
        } else {
            window.localStorage.setItem('segundos', segundos);
        }

        if (minutos === -1) {
            window.localStorage.setItem('minutos', 59);
        } else {
            window.localStorage.setItem('minutos', minutos);
        }

        window.localStorage.setItem('horas', horas);
    }

    // Establece el número de iteraciones por partida a 0.
    function initRecord() {
        record = 0;
    }

    /*
    *   Funciones del sistema de cronometraje
    */
    function cronometro() {
        if (centesimas < 99) {
            centesimas++;
            if (centesimas < 10) {
                centesimas = "0" + centesimas;
            }
            nodoCentesimas.innerHTML = ":" + centesimas;
        }

        if (centesimas == 99) {
            centesimas = -1;
        }

        if (centesimas == 0) {
            segundos ++;
            if (segundos < 10) {
                segundos = "0" + segundos;
            }
            nodoSegundos.innerHTML = ":" + segundos;
        }

        if (segundos == 59) {
            segundos = -1;
        }

        if ( (centesimas == 0) && (segundos == 0) ) {
            minutos++;
            if (minutos < 10) {
                minutos = "0" + minutos;
            }
            nodoMinutos.innerHTML = ":" + minutos;
        }

        if (minutos == 59) {
            minutos = -1;
        }

        if ( (centesimas == 0) && (segundos == 0) && (minutos == 0) ) {
            horas ++;
            if (horas < 10) { horas = "0" + horas }
            nodoHoras.innerHTML = horas;
        }

        record++;

        if(isRecord()) {
            updateRecord();
        }

        updateRecordNode();
    }

    function initChronometer() {
        intervalCronometro = window.setInterval(cronometro, 10);
    }

    function stopChronometer() {
        window.clearInterval(intervalCronometro);
    }

    function resetChronometer() {
        stopChronometer();
        centesimas = 0;
        segundos = 0;
        minutos = 0;
        horas = 0;

        nodoCentesimas.innerHTML = ":00";
        nodoSegundos.innerHTML = ":00";
        nodoMinutos.innerHTML = ":00";
        nodoHoras.innerHTML = "00";
    }

    /*
    *   Funciones encargadas de iniciar, actualizar y comprobar los obstáculos superados.
    */
    function initPass() {
        pass = 0;
    }

    function updatePass() {
        nodoObstaculos.innerHTML = pass / 2; // Entre dos porque cuenta el par
    }

    /*
    *   Comprueba si la esquina superior izquierda del jugador es mayor al extremo derecho del obstaculo.
    *   De ser así, significa que el obstáculo está mas a la izquierda y por lo tanto el jugador a pasado
    *   el obstáculo. Tambien se comprueba que el obstáculo que se está comprobando se encuentra en la
    *   posición de la colección que marca la variable pass, de esta manera siempre se hace referencia al
    *   objeto más próximo, posteriormente, se incrementa la variable pass.
    */
    function checkPass(point, object, indexObject) {
        var pointPass = object.getX() + object.getWidth();

        if (pointPass < point[0] && indexObject == pass) {
            pass++;
        }
    }

    /*
    *   Funciones encargadas de iniciar, reiniciar y actualizar la velocidad del juego.
    */
    function resumeSpeed() {
        var increment = .5;

        intervalSpeed = window.setInterval(function() {
            speed += increment;
            speedPlayer = speed;
        }, 10000);
    }

    function initSpeed() {
        speed = 5;
        speedPlayer = speed;
        resumeSpeed();
    }

    function stopSpeed() {
        window.clearInterval(intervalSpeed);
    }

    function resetSpeed() {
        speed = 5;
    }

    function updateSpeed() {
        nodoVelocidad.innerHTML = (Math.round(speed * 10));
    }

    // Reproduce el audio del juego.
    function playAudio() {
        nodoMusica.play();
    }

    /*
    *   Oculta el nodo encargado de iniciar la partida.
    */
    function hideIniciador() {
        var iniciador = document.getElementById("iniciador");
        iniciador.style.display = "none";
    }

    /*
    *   Funciones encargadas de administrar las monedas recogidas
    */
    function initCoin() {
        coin = 0;
    }

    function updateCoin() {
        nodoCoin.innerHTML = coin;
    }

    function addCoin() {
        coin++;
    }

    function startObjectGenerator() {
        objectGenerator = window.setInterval(function(){

            var middle = canvas.height / 2  + ((Math.random() - 0.5) * canvas.height * 3 / 4);

            var heightObstacleDown = canvas.height - middle - 100;

            obstacles.push(new Obstacle(heightObstacleDown));

            var heightObstacleUp = canvas.height - heightObstacleDown - ((Math.random() * 150) + 190);

            obstacles.push(new Obstacle(heightObstacleUp, true));

            var heightCoin = heightObstacleDown + 50;

            coins.push(new Coin(heightCoin));

        }, 1500);
    }

    function stopObjectGenerator() {
        window.clearInterval(objectGenerator);
    }

    function showModal() {
        nodoModal.style.display = "block";
    }

    function hideModal() {
        nodoModal.style.display = "none";
    }

    function reloadPage() {
        window.location.reload();
    }

    /*
    *   Esta función llama a diferentes funciones que aportan un estado inicial a la partida.
    *   (es llamada desde init).
    */
    function startInitialState() {
        hideIniciador();
        detenerAnim = false;
        playAudio();
        initSpeed();
        initPass();
        initCoin();
        initRecord();
        initChronometer();
        updateSpeed();
        hideModal();
    }

    /*
    *   Esta función llama a diferentes funciones que reinician los valores iniciales de la partida.
    */
    function resetInitialState() {
        resetSpeed();
        initPass();
        updatePass();
        initCoin();
        updateCoin();
        resetChronometer();
        initRecord();
    }

    // Redimensiona el canvas a partir de un porcentaje establecido.
    function resizeCanvas () {
        var scaleCanvas = 1;

        if(!detenerAnim) {
            canvas.width = window.innerWidth * scaleCanvas;
            canvas.height = window.innerHeight * scaleCanvas;
            buffer.width = canvas.width;
            buffer.height = canvas.height;
        }
    }

    /**
     * Background System Manager es el encargado de administrar el canvas.
     */
    function BackgroundSystem (readyCallBack) {
        var time = 0;
        var backgrounds = [];
        var capas = 8;

        var done = function(){
            var count = 0;
            return function (){
                count++;
                if(count === backgrounds.length){
                    backgrounds[1].height = canvas.height;
                    backgrounds[2].height = canvas.height;
                    backgrounds[3].height = canvas.height;
                    backgrounds[4].height = canvas.height;
                    backgrounds[5].height = canvas.height;
                    backgrounds[6].height = canvas.height;
                    backgrounds[7].height = canvas.height;

                    backgrounds[0].posY = 0;
                    backgrounds[1].posY = canvas.height - backgrounds[1].height - 80;
                    backgrounds[2].posY = canvas.height - backgrounds[2].height - 100;
                    backgrounds[3].posY = canvas.height - backgrounds[3].height;
                    backgrounds[4].posY = 0;
                    backgrounds[5].posY = canvas.height - backgrounds[5].height - 200;
                    backgrounds[6].posY = canvas.height - backgrounds[6].height;
                    backgrounds[7].posY = canvas.height - backgrounds[7].height;

                    readyCallBack(); // anim();
                }
            }
        }(); // fin done

        for(var i = 0; i < capas; i++) {
            backgrounds[i] = new window.Image();
            backgrounds[i].onload = done;
        }

        backgrounds[0].src = 'images/lunaFull.png';
        backgrounds[0].speed = 15;

        backgrounds[1].src = 'images/nubes.png';
        backgrounds[1].speed = 25;

        backgrounds[2].src = 'images/nubes2.png';
        backgrounds[2].speed = 40;

        backgrounds[3].src = 'images/niebla.png';
        backgrounds[3].speed = 70;

        backgrounds[4].src = 'images/ciudad.png';
        backgrounds[4].posY = 0;
        backgrounds[4].speed = 90;

        backgrounds[5].src = 'images/nubes.png';
        backgrounds[5].speed = 105;

        backgrounds[6].src = 'images/niebla.png';
        backgrounds[6].speed = 140;

        backgrounds[7].src = 'images/niebla2.png';
        backgrounds[7].speed = 260;

        return {
                render : function() {
                    time += .02;
                    var xPos, layer, numImages;
                    for(var i = 0; i < backgrounds.length; i++){
                        layer = backgrounds[i];
                        xPos = time * layer.speed % layer.width;
                        numImages = Math.ceil(canvas.width / layer.width) + 1;
                        bufferCtx.save();
                        bufferCtx.translate(-xPos, 0);
                        for (var j = 0; j < numImages; j++) {
                            bufferCtx.drawImage(layer, j *layer.width, layer.posY, layer.width, layer.height);
                        }
                        bufferCtx.restore();
                    }
                }
            };
        } // fin Background System Manager

    /**
     * Keyboard sytem
     */
    function keyboardSystem(keyConfig) {
        // declaramos teclas
        var config = {
            up: keyConfig.up || 38,
            down: keyConfig.down || 40,
            left: keyConfig.left || 37,
            right: keyConfig.right || 38
        };
        // estado de las teclas
        var virtualKeyboard = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        // Cual es la Tecla pulsada?
        var switchKey = function (key, status) {
            switch (key) {
                case config.left:
                    virtualKeyboard.left = status;
                    break;
                case config.right:
                    virtualKeyboard.right = status;
                    break;
                case config.up:
                    virtualKeyboard.up = status;
                    break;
                case config.down:
                    virtualKeyboard.down = status;
                    break;
            }
        };
        // Pulsamos tecla
        var enableButton = function (event) {
            event = event || window.event;
            event.preventDefault();
            switchKey(event.keyCode, true);
        };
        // dejamos de pulsar tecla
        var disableButton = function (event) {
            event = event || window.event;
            switchKey(event.keyCode, false);
        };
        // Estudiar el estado del conmutador
        var update = function(){
            if(virtualKeyboard.up) {
                zombie.up();
            }
            if(virtualKeyboard.down) {
                zombie.down();
            }
            if(virtualKeyboard.left) {
                zombie.left();
            }
            if(virtualKeyboard.right) {
                zombie.right();
            }
        };
        // todas las teclas en estado false
        var reset = function(){
            for(var i in virtualKeyboard) {
                virtualKeyboard[i] = false;
            }
        };

        //Bind events
        document.onkeydown = enableButton;
        document.onkeyup = disableButton;

        return {
            update : update,
            reset : reset
        }
    }

    // Player definimos su ubicacion y renderizamos en el double buffering
    function Player(){
        var sprites = [];
        var cantidadSprites = 5;

        for(var i = 0; i <= cantidadSprites; i++) {
            sprites[i] = new window.Image();
            sprites[i].src = 'images/zombie/' + i + '.gif';
            sprites[i].width = 104;
            sprites[i].height = 145;
        }

        var posX = 150, time = 0;
        var API = {};
        var posY = canvas.height / 2;

        API.up = function(){
            posY -= speedPlayer;
            time += .5;
        };
        API.down = function(){
            posY += speedPlayer;
            time -= .1;
        };
        API.left = function(){
            posX -= speedPlayer;
        };
        API.right = function(){
            posX += speedPlayer;
            time += .5;
        };

        API.render = function(){
            time += .3;
            bufferCtx.drawImage(sprites[ Math.floor(time % sprites.length)], posX, posY, this.getWidth(), this.getHeight());
            // bufferCtx.strokeRect(posX,posY, this.getWidth(), this.getHeight()); // Dibuja un border alrededor del personaje
        };

        API.getX = function(){
            return posX;
        };

        API.setX = function(x){
            posX = x;
        };

        API.getY = function(){
            return posY;
        };

        API.setY = function(y){
            posY = y;
        };

        API.getHeight = function(){
            return 145;
        };

        API.getWidth = function(){
            return 104;
        };

        return API;
    }

    // Coin crea las monedas.
    function Coin(height) {
        var image = new window.Image();
        image.src = 'images/coin.gif';
        image.height = 50;
        image.width = 50;

        var posX = canvas.width + 100 + 35;
        var posY = canvas.height - height;

        this.update = function(){
            posX -= speed - .1;
        };

        this.render = function() {
            bufferCtx.save();
            bufferCtx.drawImage(image, posX, posY, image.width, image.height);
            //bufferCtx.strokeRect(posX,posY, this.getWidth(), this.getHeight());
            bufferCtx.restore();
        }

        this.getX = function(){
            return posX;
        };

        this.getY = function(){
            return posY;
        };

        this.getHeight = function(){
            return image.height;
        };

        this.getWidth = function(){
            return image.width;
        };
    }

    // Obstacle crea los obstáculos
    function Obstacle(height, invert){
        var image = new window.Image();
        var posX = canvas.width + 100;
        var posY = invert ? - height : canvas.height - height;

        updateSpeed(speed);

        image.src = 'images/pipe.png';
        image.height = height;
        image.width = 120;

        this.update = function(){
            posX -= speed - .1;
        };

        this.render = function(){
            bufferCtx.save();
            if(invert){
                bufferCtx.scale(1, -1);
            }
            bufferCtx.drawImage(image, posX, posY, image.width, image.height);
            bufferCtx.strokeRect(posX,posY, image.width, image.height);
            bufferCtx.restore();
        };

        this.getX = function(){
            return posX;
        };

        this.getY = function(){
            return invert ? 0 :  posY;
        };

        this.getHeight = function(){
            return image.height;
        };

        this.getWidth = function(){
            return image.width;
        };
    }

    // Controla los limites de la ventana para el jugador, actor, heroe, etc.
    function checkPlayerBounds() {
        if(zombie.getY() < 0)
            zombie.setY(0);
        if(zombie.getY() + zombie.getHeight() > canvas.height)
            zombie.setY(canvas.height - zombie.getHeight());
        if(zombie.getX() < 0 )
            zombie.setX(0);
        if(zombie.getX() + zombie.getWidth() > canvas.width)
            zombie.setX(canvas.width - zombie.getWidth());
    }
    function checkObstablesBounds() {
        //TODO
    }
    // llama al controlador de limites
    function checkBounds(){
        checkPlayerBounds();
        checkObstablesBounds();
    }

    /*
    *   Comprueba si alguno de los puntos delimitantes del jugador se encuentra entre los puntos
    *   delimitantes del objeto, esto quiere decir que ha habido una colisión.
    */
    function inside(point, object){
        // Punto superior-izquierdo
        var posXIzquierda = object.getX();
        var posYSuperior = object.getY();

        // Punto inferior-derecho
        var posXDerecha = posXIzquierda + object.getWidth();
        var posYAbajo = posYSuperior + object.getHeight();

        return (posXIzquierda < point[0] && posYSuperior < point[1]) &&
            (posXDerecha > point[0] && posYAbajo > point[1]);
    }

    function getPoints(object){
        var points = [];

        points[0] = [object.getX(), object.getY()];
        points[1] = [object.getX() + object.getWidth(), object.getY()];
        points[2] = [object.getX() + object.getWidth(), object.getY() + object.getHeight()];
        points[3] = [object.getX(), object.getY() + object.getHeight()];

        return points;
    }

    function resetKeyboard() {
        keyboard.reset();
    }

    function resetObstacles() {
        obstacles = [];
    }

    function resetCoins() {
        coins = [];
    }

    function checkCollisions(point, obstacle) {
        if(inside(point, obstacle)) {
            detenerAnim = true;
            stopObjectGenerator();
            stopSpeed();
            stopChronometer();
            showModal();
            return true;
        }
    }

    function checkCollisionsCoin() {
        var points = getPoints(zombie);
        var coinRemove;

        if (coins.length > 0) {
            for (var i = 0; i < coins.length; i++) {
                coinRemove = false;
                for(var j = 0; j < points.length; j++) {
                    if(inside(points[j], coins[i])) {
                        coinRemove = true;
                    }
                }
                if(coinRemove) {
                    coins.splice(i, 1);
                    addCoin();
                    updateCoin();
                }
            }
        }
    }

    /*
    *   Esta función comprueba el estado de la partida, comprueba si ha habido una colisión
    *   y si no, comprueba si se ha superado un obstáculo.
    */
    function checkGameStatus(){
        var points = getPoints(zombie);

        for(var i = 0; i < obstacles.length; i++){
            for(var j = 0; j < points.length; j++){
                if(checkCollisions(points[j], obstacles[i])) {
                    return;
                } else {
                    checkPass(points[1], obstacles[i], i);
                }
            }
        }
    }

    function draw () {
        ctx.drawImage(buffer, 0, 0);
    }

    // Llamada por fotograma
    function update () {
        // Elimina el fotograma de la pantalla convirtiéndolo en negro.
        bufferCtx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

         // Update positions
        keyboard.update();
        // Actualizamos el fondo
        background.render();
        // update obstacles   movemos los tubos
        for(var i = 0; i < obstacles.length; i++){
            obstacles[i].update();
        }

        for(i = 0; i < coins.length; i++) {
            coins[i].update();
        }
        // Corregimos los limites
        checkBounds();

        // Colision
        checkGameStatus();
        checkCollisionsCoin();

        //Actualiza la cantidad de objetos de colisión superados
        updatePass();

        // render obstacles
        for(i = 0; i < obstacles.length; i++){
            obstacles[i].render();
        }

        for(i = 0; i < coins.length; i++){
            coins[i].render();
        }

        // Actualizamos en player, heroe, etc
        zombie.render();

        // Pintamos o pasamos el fotograma por el foco de luz
        draw();
    }

    function init() {
        startInitialState();

        // Canvas & Buffering
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext('2d');
        buffer = document.createElement('canvas');
        bufferCtx = buffer.getContext('2d');
        resizeCanvas();

        // Gameloop
        var anim = function () {
            update();
            if (detenerAnim) {
                return;
            }
            window.requestAnimFrame(anim);
        };

        // 1. declaramos teclas y su interfaz
        keyboard = keyboardSystem({up: 38, down: 40, left: 37, right: 39});
        // 2. Creamos el jugador, actor, heroe, etc
        zombie = Player();
        background = BackgroundSystem(anim);
        window.addListener(window, 'resize', resizeCanvas);
        startObjectGenerator();
    }

    getNodes();

    nodoReiniciarPartida.onclick = function() {
        resetKeyboard();
        resetObstacles();
        resetCoins();
        resetInitialState();
        init();
    }
    nodoIrMenu.onclick = function() {
        reloadPage();
    }

    nodoBotonInstrucciones.onclick = function() {
        nodoInstrucciones.style.display = "block";
    }

    nodoCerrarInstrucciones.onclick = function() {
        nodoInstrucciones.style.display = "none";
    }

    // Public Methods API
    return {
        init: init,
        updateRecordNode: updateRecordNode
    };

}) ();
