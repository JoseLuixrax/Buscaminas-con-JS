let tablero = [];
let tableroVista = [];
let filas = 0;
let columnas = 0;
let minas = 0;
let estado = "Jugando";

const buscaminas = {
    init: function (difficulty) {
        estado = "Jugando";
        tablero = [];
        tableroVista = [];
        switch (difficulty) {
            case "test":
                filas = 3;
                columnas = 3;
                minas = 1;
                break;
            case "easy":
                filas = 9;
                columnas = 9;
                minas = 10;
                break;
            case "medium":
                filas = 16;
                columnas = 16;
                minas = 40;
                break;
            case "hard":
                filas = 30;
                columnas = 16;
                minas = 99;
                break;
        }
        this.crearTablero();
        this.colocarMinas();
        this.rellenarTablero();
    },

    crearTablero: function () {
        for (let i = 0; i < filas; i++) {
            tablero[i] = [];
            tableroVista[i] = [];
            for (let j = 0; j < columnas; j++) {
                tablero[i][j] = 0;
                tableroVista[i][j] = "";
            }
        }
    },

    colocarMinas: function () {
        let minasColocadas = 0;
        while (minasColocadas < minas) {
            let fila = Math.floor(Math.random() * filas);
            let columna = Math.floor(Math.random() * columnas);
            if (tablero[fila][columna] != 9) {
                tablero[fila][columna] = 9;
                minasColocadas++;
            }
        }
    },

    rellenarTablero: function () {
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                if (tablero[i][j] != 9) {
                    tablero[i][j] = this.contarMinasAlrededor(i, j);
                }
            }
        }
    },

    contarMinasAlrededor: function (f, c) {
        let minasAlrededor = 0;
        for (let i = f - 1; i <= f + 1; i++) {
            for (let j = c - 1; j <= c + 1; j++) {
                if (i >= 0 && i < filas && j >= 0 && j < columnas) {
                    if (tablero[i][j] == 9) {
                        minasAlrededor++;
                    }
                }
            }
        }
        return minasAlrededor;
    },

    mostrar: function () {
        console.log("Tablero de juego:");
        console.log(tablero);
        console.log("Tablero de vista:");
        console.log(tableroVista);
    },

    getTableroVista: function () {
        return tableroVista;
    },

    picar: function (f, c) {
        if (tablero[f][c] == -1) return;
        if (estado == "Jugando") {
            if (tablero[f][c] == 9) {
                estado = "Perdido";
                for (let i = 0; i < filas; i++) {
                    for (let j = 0; j < columnas; j++) {
                        if (tablero[i][j] == 9) {
                            tableroVista[i][j] = "💣";
                        }
                    }
                }
                return "Perdiste";
            } else if (tablero[f][c] == 0) {
                tableroVista[f][c] = 0;
                tablero[f][c] = -1;
                this.descubrirCasillasAlrededor(f, c);
                if (this.comprobarVictoria()) {
                    estado = "Ganado";
                    return "Victoria";
                }
                return tableroVista;
            } else if(tablero[f][c] != -1){
                tableroVista[f][c] = tablero[f][c];
                tablero[f][c] = -1;
                if (this.comprobarVictoria()) {
                    estado = "Ganado";
                    return "Victoria";
                }
                return tableroVista;
            }
        } else {
            return "El juego ha terminado";
        }
                    
    },

    descubrirCasillasAlrededor: function (f, c) {
        for (let i = f - 1; i <= f + 1; i++) {
            for (let j = c - 1; j <= c + 1; j++) {
                if (i >= 0 && i < filas && j >= 0 && j < columnas) {
                    if (tablero[i][j] == 0 && tableroVista[i][j] == "") {
                        tableroVista[i][j] = 0;
                        tablero[i][j] = -1;
                        this.descubrirCasillasAlrededor(i, j);
                    } else if (tablero[i][j] != 9 && tablero[i][j] != -1 && tableroVista[i][j] == "") {
                        tableroVista[i][j] = tablero[i][j];  //Algo falla Pone un -1 en el tablero de vista
                        tablero[i][j] = -1;
                    }
                }
            }
        }
    },

    comprobarVictoria: function () {
        let casillasSinMinas = filas * columnas - minas;
        let casillasDescubiertas = 0;
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                if (tablero[i][j] == -1) {
                    casillasDescubiertas++;
                }
            }
        }
        return casillasSinMinas == casillasDescubiertas;
    },

    marcar: function (f, c) {
        if (estado == "Jugando") {
        if (tableroVista[f][c] == -1) return;
            if (tableroVista[f][c] == "") {
                tableroVista[f][c] = "🚩";
                return tableroVista;
            } else if (tableroVista[f][c] == "🚩") {
                tableroVista[f][c] = "";
                return tableroVista;
            } else {    
                return "No se puede colocar una bandera en esa casilla";
            }
        } else {
            return "El juego ha terminado";
        }
    },
    
    contarBanderasAlreadedor: function(f,c){
        let banderasAlrededor = 0;
        for (let i = f - 1; i <= f + 1; i++) {
            for (let j = c - 1; j <= c + 1; j++) {
                if (i >= 0 && i < filas && j >= 0 && j < columnas) {
                    if (tableroVista[i][j] == "🚩") {
                        banderasAlrededor++;
                    }
                }
            }
        }
        return banderasAlrededor;
    },

    despejar: function (f, c) {
        if(estado != "Jugando") return;

        if(tableroVista[f][c]=="🚩"){
            return "No se puede despejar una casilla marcada";
        }

        if(this.contarMinasAlrededor() == this.contarBanderasAlreadedor()){
            this.descubrirCasillasAlrededor(f,c);
        }
    },

    getNumeroBanderas: function(){
        let numeroBanderas = 0;
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                if (tableroVista[i][j] == "🚩") {
                    numeroBanderas++;
                }
            }
        }
        return numeroBanderas;
    },

    getNumeroMinas: function(){
        return minas;
    }
}

export { buscaminas };
