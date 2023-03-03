import { buscaminas } from "./buscaminas.js";
document.addEventListener("DOMContentLoaded", function () {
    let dificultad = document.getElementById("dificultad");
    let tablero = document.getElementById("tablero");
    buscaminas.init("easy");
    buscaminas.mostrar();

    for (let i = 0; i < buscaminas.getTableroVista().length; i++) {
        let fila = document.createElement("tr");
        tablero.appendChild(fila);
        for (let j = 0; j < buscaminas.getTableroVista()[0].length; j++) {
            let celda = document.createElement("td");
            celda.innerHTML = buscaminas.getTableroVista()[i][j];
            celda.dataset.fila = i;
            celda.dataset.columna = j;
            fila.appendChild(celda);
        }
    }

    dificultad.addEventListener("change", function () {
        buscaminas.init(dificultad.value);
        buscaminas.mostrar();
        tablero.innerHTML = "";

        for (let i = 0; i < buscaminas.getTableroVista().length; i++) {
            let fila = document.createElement("tr");
            tablero.appendChild(fila);
            for (let j = 0; j < buscaminas.getTableroVista()[0].length; j++) {
                let celda = document.createElement("td");
                celda.innerHTML = buscaminas.getTableroVista()[i][j];
                celda.dataset.fila = i;
                celda.dataset.columna = j;
                fila.appendChild(celda);
            }
        }
    });

    tablero.addEventListener("click", function (e) {
        if (e.target.tagName == "TD") {
            if (e.target.innerHTML == "🚩") return;
            let resultado = buscaminas.picar(parseInt(e.target.dataset.fila), parseInt(e.target.dataset.columna));
            switch (resultado) {
                case "Perdiste":
                    pintarTablero();
                    console.log("Has perdido");
                    break;
                case "Victoria":
                    pintarTablero();
                    console.log("Has ganado");
                    break;
                case "El juego ha terminado":
                    console.log("El juego ha terminado");
                    break;
                default:
                    pintarTablero();
                    console.log(resultado);
                    break;
            }
        }
    });

    function pintarTablero() {
        for (let i = 0; i < buscaminas.getTableroVista().length; i++) {
            for (let j = 0; j < buscaminas.getTableroVista()[0].length; j++) {
                tablero.children[i].children[j].innerHTML = buscaminas.getTableroVista()[i][j];
                if (buscaminas.getTableroVista()[i][j] != "" || buscaminas.getTableroVista()[i][j] == "0" && buscaminas.getTableroVista()[i][j] != "🚩") {
                    tablero.children[i].children[j].classList.add("picada");
                }
            }
        }
    }

    tablero.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        if (e.target.tagName == "TD") {
            if (e.target.innerHTML == "0") return;
            buscaminas.marcar(e.target.dataset.fila, e.target.dataset.columna);
            e.target.innerHTML = buscaminas.getTableroVista()[e.target.dataset.fila][e.target.dataset.columna];
        }
    });

    tablero.addEventListener("click", function (e) {
        if (e.buttons == 3) {
            if (e.target.tagName == "TD") {
                buscaminas.despejar(parseInt(e.target.dataset.fila), parseInt(e.target.dataset.columna));
                buscaminas.mostrar();
                e.target.innerHTML = buscaminas.getTableroVista()[e.target.dataset.fila][e.target.dataset.columna];
                e.target.classList.add("picada");
            }
        }
    });
});