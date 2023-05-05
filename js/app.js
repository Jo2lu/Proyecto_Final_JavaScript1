//valores predeterminados
var presupuesto=0;
var porcentajeEgreso=0;

let ingresos=[
    new Ingreso('Salario', 20000),
    new Ingreso('Venta auto', 50000),
    new Ingreso('YT', 1500)
];
let egresos = [
    new Egreso('Renta', 4000),
    new Egreso('Ropa', 800),
    new Egreso('Luz', 400)
];
// Recolección de datos para el CABECERO
const cargarCabecero=()=>{
    presupuesto=totalIngresos()-totalEgresos();
    porcentajeEgreso=totalEgresos()/totalIngresos();
    document.getElementById('presupuestoo').innerHTML = formatoMoneda(presupuesto);
    document.getElementById('porcentaje').innerHTML= formatoPorcentaje(porcentajeEgreso);
    document.getElementById('ingresos').innerHTML= formatoMoneda(totalIngresos());
    document.getElementById('egresos').innerHTML= formatoMoneda(totalEgresos());
}
// Ingresos totales dentro del CABECERO
const totalIngresos=()=>{
    let totalIngreso=0;
    for (let ingreso of ingresos){
        totalIngreso += parseFloat(ingreso.valor);
    }
    return totalIngreso;  
};
// Egresos totales dentro del CABECERO
const totalEgresos=()=>{
    let totalEgreso=0;
    for (let egreso of egresos) {
        totalEgreso += parseFloat(egreso.valor);
    }  
    return totalEgreso;
};
/*Asigna un valor monetario para que sea fácil entender que el valor se trata de monedas
depende de la configuración región...es-MX 15485432 -> $15,485,432
currency es para cualquier código de moneda
Se agregó el + MXN porque no aparecía pese a ser moneda mexicana, razón,
se puede confundir con los dólares*/
const formatoMoneda=(numero)=>{
    numero = (numero.toLocaleString('es-MX', {style: 'currency',currency: 'MXN', minimumFractionDigits: 2}))+' MXN';
    return numero;
}
/*style; 'percent'; asigna una apariencia según el estilo
las opciones son (decimal/percent/currency)
decimal da una apariencia de porcentaje multiplica un valor x *100,
además espera un número en el rango de [0, 1] que luego tendría un formato entre 0% y 100%*/

const formatoPorcentaje=(porcentaje)=>{
    porcentaje = porcentaje.toLocaleString('es-MX', {style: 'percent', minimumFractionDigits: 2});
    return porcentaje;
};
/*Función cargarApp usada por HTML para llamar las funciones contenidas
El programa no funcionará automáticamente sin esto
Otra opción es cargarlo manualmente, pero eso no le interesaría al usuario*/
const cargarApp=()=>{
    cargarCabecero();
    cargarIngresos();
    cargarEgresos();
}
//Carga los Ingresos
const cargarIngresos=()=>{
    let ingresosHTML='';
    for (let ingreso of ingresos) {
        ingresosHTML += crearIngresoHTML(ingreso);
    }
    document.getElementById('lista-ingresos').innerHTML=ingresosHTML;
}
/*Crea nuevos datos de ingresos al insertar el código en su interior
No se activa automáticamente sin el ultimo código*/
const crearIngresoHTML=(ingreso)=>{
    let ingresoHTML = `
    <div class="elemento limpiarEstilos">
        <div class="elemento_descripcion">${ingreso.descripcion}</div>
        <div class="derecha limpiarEstilos">
            <div class="elemento_valor">${formatoMoneda(ingreso.valor)}</div>
            <div class="elemento_eliminar">
                <button class="elemento_eliminar--btn">
                    <ion-icon name="close-circle-outline" onclick="eliminarIngreso(${ingreso.id})"></ion-icon>
                </button>
            </div>
        </div>
    </div>
    `;
    return ingresoHTML;
}
//Carga los Egresos
const cargarEgresos=()=>{
    let egresosHTML='';
    for (let egreso of egresos) {
        egresosHTML += crearEgresoHTML(egreso);
    }
    document.getElementById('lista-egresos').innerHTML=egresosHTML;
}
/*Crea nuevos datos de egresos al insertar el código en su interior
No se activa automáticamente sin el último código*/
const crearEgresoHTML=(egreso)=>{
    let egresoHTML=`
    <div class="elemento limpiarEstilos">
        <div class="elemento_descripcion">${egreso.descripcion}</div>
        <div class="derecha limpiarEstilos">
            <div class="elemento_valor">${formatoMoneda(egreso.valor)}</div>
            <div class="elemento_porcentaje">${formatoPorcentaje(egreso.valor/totalEgresos())}</div>
            <div class="elemento_eliminar">
                <button class="elemento_eliminar--btn">
                    <ion-icon name="close-circle-outline" onclick="eliminarEgreso(${egreso.id})"></ion-icon>
                </button>
            </div>
        </div>
    </div>
    `;
    return egresoHTML;
}
/*Elimina los egresos seleccionados por el usuario
Vinculado directamente con Egresos.js*/
const eliminarEgreso=(id)=>{
    let indiceEliminar = egresos.findIndex(egreso=>egreso.id===id);
    egresos.splice(indiceEliminar, 1);
    cargarCabecero();
    cargarEgresos();
}
//Elimina los ingresos  seleccionados por el usuario
//Vinculado directamente con Ingresos.js
const eliminarIngreso=(id)=>{
    let indiceEliminar=ingresos.findIndex(ingreso=>ingreso.id===id);
    ingresos.splice(indiceEliminar,1);
    cargarCabecero();
    cargarIngresos();
}
/*Función que es activada cuando se aprieta el botón en el formulario
También cuenta con validaciones para evitar que los datos se envíen en caso
de no estar completa la información*/
const agregarDato = () => {
    /*id forma es invocado directamente del documento HTML, de la sección del formulario, 
    y es asignado a la variable forma*/
    const forma = document.getElementById('forma');
    /*Aquí se indica que queremos un dato dentro de forma, que se encuentra en el HTML
    El primer let indica que quiere los valores que están dentro de descripción que está dentro de forma
    y posteriormente lo asigna a una función
    El parseFloat convierte su primer argumento en una cadena, analiza esa cadena como un número decimal 
    literal y luego devuelve un número o NaN*/
    let tipo=forma.tipo.value;
    let descripcion=forma.descripcion.value;
    let valor=parseFloat(forma.valor.value);
    /*Esto es un arreglo, que indica que si descripción es diferente a ''
    y valor es diferente a 0 o menos que 0 y determina si valor es NaN y se usa false para
    cerciorarnos que valor no tiene el valor de NaN
    Hay más información dentro de la liga sobre Expresiones y Operaciones Lógicas
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND
    */
    if(descripcion !== '' && valor !== 0 && valor>0 && isNaN(valor)==false) {
        if(tipo === 'ingreso'){
            /*Push sirve para añadir uno o más elementos al final de un array y regresa una nueva longitud,
            si antes tenias 2 elementos y agregas con push() 5 elementos más, ahora tendrás 7 elementos*/
                ingresos.push (new Ingreso (descripcion,valor));
        }else if(tipo === "egreso") {
                egresos.push (new Egreso (descripcion,valor));                        
        }      
    }else{
        console.log('Si estás viendo esto es seguro que intentaste hacer algo que no debias, Ntp... te estaré vigilando');
        alert('Se te olvido algo, ten más cuidado con lo que haces o se te olvide hacer');
    };
    /*Lo siguiente se ejecuta después del if, después de agregar o no cosas
    Esto nos mostrará el nuevo contenido agregado y las modificaciones hechas*/
    cargarCabecero();
    cargarIngresos();
    cargarEgresos();
    /*Reset o borrado de los datos en forma
    Forma regresa a no contener nada en los espacios gracias a return false*/
    forma.reset();
    return false;
}