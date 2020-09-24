
var db;
const indexedDB = window.indexedDB;

//se crea la basde de datos
const request = indexedDB.open('appstore', 1);
const formulario = document.getElementById('formularioNuevaApp')

//se crea la tienda/store  
const createDB = (store,data) => {
    
    //Si se crea el store correctamente se lanza este metodo
    request.onsuccess = () => {
        
        db = request.result;
        console.log('DATA BASE CREATE');
        getDataAll(store)
        
        //SE LLENA EL SELECT PARA LAS IMAGENES EN EL MODAL DE NUEVA APP
        for(let i = 1; i<=20;i++){
            let listaImagenes = document.getElementById('listaImagenes');
            listaImagenes.innerHTML += `<option value="img/app-icons/${i}.webp">${i} </option>`;
        }
        
    };

    request.onerror = (error) => {
    console.log("ERROR :", error);
    };

    //Actualizaciones de la base
    request.onupgradeneeded = () => {
        db = request.result; 
        const store1 = db.createObjectStore(store, {
            autoIncrement: true
        });
        console.log('STORE CREATE');

        //LLENA LA BASE DE DATOS CON EL ARRAY DE APP
        store1.transaction.oncomplete= function(event){
            let categorias = db.transaction(store, "readwrite").objectStore(store);
            data.forEach(element => {
                categorias.add(element)    
            });
            
        }
        
    };
            
}

//Aqui se obtiene toda la informacion y se visualizara en el home
const getDataAll = (store)=> {
    
    let data=[];
    const transaction = db.transaction([store],'readonly');
    const objectStore = transaction.objectStore(store);
    const request = objectStore.openCursor(); //se habre el cursor
    
    request.onsuccess = (e) => {
    const cursor = e.target.result;
        if(cursor){
            //console.log(cursor.value);
            data.push(cursor.value)
            cursor.continue();
        }
    };
    
    transaction.oncomplete = () =>{
        
        let select = document.getElementById('selectCategoria');
        let categoriaApp = document.getElementById('categoriaApp');
        let containerCard = document.querySelector('#containerCard');

        //LLeno las categorias
        data.forEach((element,indice) => {
            select.innerHTML += `<option value =${indice}>${element.nombreCategoria}</option>` ;
            categoriaApp.innerHTML += `<option value =${indice}>${element.nombreCategoria}</option>` ;
            
        });
        
        //Se cargar el home, todas las aplicaciones 
        data.forEach((element,indice)=>{
            
            element.aplicaciones.forEach(element1=>{
                let estrellas='';
                
                for(let i=0; i<element1.calificacion;i++){
                    
                    estrellas+=`<i class="fas fa-star color-star"></i>`;
                    
                }
                //Generar estrellas vacias
                for(let i=0; i<(5-element1.calificacion);i++){
                    estrellas+=`<i class="far fa-star color-star"></i>`;
                    
                }
                containerCard.innerHTML+= 
                `<div class="col-lg-2 col-md-3 col-6">
                    <div class="card card-mouse fondo-card-orange shadow p-3 mb-5 bg-white rounded" data-target="#staticBackdrop" >
                        <img src="${element1.icono}" class="card-img-top" onclick="modalItem(${element1.codigo})">
                    
                        <h5 onclick="modalItem(${element1.codigo})">${element1.nombre}</h5>
                        <p onclick="modalItem(${element1.codigo})">Desarrollador</p>
                        <div id="calificacion" onclick="modalItem(${element1.codigo})">
                           ${estrellas}
                        </div>
                        
                            <div class="row justify-content-between">
                                <div class="col-6 col-md-6 col-lg-6">
                                    <h5 id="precioApp">$${element1.precio}</h5>
                            
                                </div>
                                <div class="col-4 col-md-4 col-lg-4 ">
                                    <i onclick="deleteData(${element1.codigo})" class="fas fa-trash-alt icon-delete"></i>
                                </div>
                            </div>
                            
                        
                    </div>
                    
                </div>`
            })
            
        })

        //evento cambio en el select 
        select.addEventListener('change',() =>{
            let dataSelect=[];
            let appSelect = [];
            //Valor seleccionado
            let selectValue = document.getElementById('selectCategoria').value;
            
            if(selectValue!='Categoria'){
                //Escoger el arreglo de la categoria seleccionada
                data.forEach((element,indice) =>{
                    if(selectValue == indice){
                        //console.log(element)
                        dataSelect.push(element)
                    }
                })

                //Escoger el arreglo de App de la categoria seleccionada
                
                dataSelect.forEach(element =>{
                    appSelect.push(element.aplicaciones) 
                })
                    
                containerCard.innerHTML='';
                
                
                //recorre el arreglo de app
                appSelect[0].forEach((element,indice) =>{
                    let estrellas='';
                
                    for(let i=0; i<element.calificacion;i++){
                        
                        estrellas+=`<i class="fas fa-star color-star"></i>`;
                        
                    }
                    //Generar estrellas vacias
                    for(let i=0; i<(5-element.calificacion);i++){
                        estrellas+=`<i class="far fa-star color-star"></i>`;
                        
                    }
                    
                    containerCard.innerHTML+= 
                    `<div class="col-lg-2 col-md-3 col-6">
                        <div class="card card-mouse fondo-card-orange shadow p-3 mb-5 bg-white rounded" data-target="#staticBackdrop">
                            <img src="${element.icono}" class="card-img-top" onclick="modalItem(${element.codigo})">
                        
                            <h5 onclick="modalItem(${element.codigo})">${element.nombre}</h5>
                            <p>Desarrollador</p>
                            <div id="calificacion">
                            ${estrellas}
                            </div>
                            <div class="row justify-content-between">
                                <div onclick="modalItem(${element.codigo})" class="col-6 col-md-6 col-lg-6">
                                    <h5 id="precioApp">$${element.precio}</h5>
                            
                                </div>
                                <div class="col-4 col-md-4 col-lg-4 ">
                                    <i onclick="deleteData(${element.codigo})" class="fas fa-trash-alt icon-delete"></i>
                                </div>
                            </div>
                        </div>
                        
                    </div>`
                })    
            }
            else{
                containerCard.innerHTML='';
                //console.log(selectValue)
                //Se cargar el home, todas las aplicaciones 
                data.forEach((element,indice)=>{
                    //console.log(element.aplicaciones)
                    element.aplicaciones.forEach(element1=>{
                        let estrellas='';
                
                        for(let i=0; i<element1.calificacion;i++){
                            estrellas+=`<i class="fas fa-star color-star"></i>`;
                        }

                        
                        for(let i=0; i<(5-element1.calificacion);i++){
                            estrellas+=`<i class="far fa-star color-star"></i>`; 
                        }

                        containerCard.innerHTML+= 
                        `<div class="col-lg-2 col-md-3 col-6">
                            <div class="card card-mouse fondo-card-orange shadow p-3 mb-5 bg-white rounded" data-target="#staticBackdrop">
                                <img src="${element1.icono}" class="card-img-top" onclick="modalItem(${element1.codigo})">
                            
                                <h5 onclick="modalItem(${element1.codigo})">${element1.nombre}</h5>
                                <p onclick="modalItem(${element1.codigo})">Desarrollador</p>
                                <div id="calificacion">
                                ${estrellas}
                                </div>
                                <div class="row justify-content-between">
                                <div onclick="modalItem(${element1.codigo})" class="col-6 col-md-6 col-lg-6">
                                    <h5 id="precioApp">$${element1.precio}</h5>
                            
                                </div>
                                <div class="col-4 col-md-4 col-lg-4 ">
                                    <i onclick="deleteData(${element1.codigo})" class="fas fa-trash-alt icon-delete"></i>
                                </div>
                            </div>
                            </div>    
                        </div>`
                    })
                    
                })
            }
               
            
        })
        
        
    }
    
    
    
}

//aqui se visualizara el modal con la informacion de la app
const modalItem = (codigo)=>{

    let store = 'categorias'
    let data=[];
    let appList=[]; 
    const transaction = db.transaction([store],'readonly');
    const objectStore = transaction.objectStore(store);
    const request = objectStore.openCursor(); //se habre el cursor
    
    request.onsuccess = (e) => {
        const cursor = e.target.result;
        if(cursor){
            //console.log(cursor.value);
            data.push(cursor.value)
            cursor.continue();
        }
    };
    transaction.oncomplete = ()=>{
        data.forEach(element=>{
            //appList.push(element.aplicaciones)
            //console.log(element)
            element.aplicaciones.forEach(element=>{
                //console.log(element)
                appList.push(element)
            })
        })

        let app = appList.filter((element)=>{
            return element.codigo == codigo
        });
        let appFinal = app[0];
        console.log(appFinal)

        let imagenes=`<div class="carousel-item active">
        <img src="${appFinal.imagenes[0]}" class="d-block w-100" alt="...">
        </div>`;
        
        for(let i=1;i<appFinal.imagenes.length;i++ ){
            imagenes+=`<div class="carousel-item">
            <img src="${appFinal.imagenes[i]}" class="d-block w-100" alt="...">
            </div>`;
        }

        let estrellas='';
        let comentarios='';              
        for(let i=0; i<appFinal.calificacion;i++){
            estrellas+=`<i class="fas fa-star"></i>`;
        }

        
        for(let i=0; i<(5-appFinal.calificacion);i++){
            estrellas+=`<i class="far fa-star"></i>`; 
        }
        
        appFinal.comentarios.forEach(element =>{
            comentarios += `<li class="list-group-item">
            <div class="row">
                    <div class="col-2 col-md-2 col-lg-2">
                        <img src="img/user.webp">
                    </div>
                    <div class="col-10 col-md-10 col-lg-10">
                        <p>${element.comentario}</p>
                    </div>
                </div> 
            </li>`;
            
        })

        if(appFinal.calificacion>=3){
            //console.log(appFinal.calificacion)
            let colorStarGreen = document.querySelector('#modalEstrellas');
            colorStarGreen.classList.remove('color-star-red');
            colorStarGreen.classList.add('color-star-green');
            
        }
        else if(appFinal.calificacion<=2){
            let colorStarGreen = document.querySelector('#modalEstrellas');
            colorStarGreen.classList.remove('color-star-green');
            colorStarGreen.classList.add('color-star-red');
        }


        if(appFinal.instalada === false){
            let buttonInstalar = document.querySelector('#buttonInstalar');
            buttonInstalar.removeAttribute('style');
        }
        else if(appFinal.instalada === true){
            let buttonInstalar = document.querySelector('#buttonInstalar');
            buttonInstalar.style.display='none'
        }

        document.querySelector('#modalImages').innerHTML=`${imagenes}`;
        document.querySelector('#modalIcono').innerHTML=`<img src="${appFinal.icono}" class="card-img" alt="...">`;
        document.querySelector('#modalEstrellas').innerHTML=`${estrellas}`;
        document.querySelector('#modalTitulo').innerHTML=`${appFinal.nombre}`;
        document.querySelector('#modalDesarrollador').innerHTML=`${appFinal.desarrollador}`;
        document.querySelector('#modalPrecio').innerHTML=`<h6>$${appFinal.precio}</h6>`;
        document.querySelector('#modalDescripcion').innerHTML=`${appFinal.descripcion}`;
        document.querySelector('#modalComentarios').innerHTML=`${comentarios}`;
        
        $('#modalApp').modal('show');

    }
        
}

//Evento para agregar nueva App
formulario.addEventListener('submit',(e) => {
    const store = 'categorias';
    e.preventDefault();
    let data = [];
    let dataAplicaciones = [];
    let lastCodigo = 0;
    const transaction = db.transaction([store],'readonly');
    const objectStore = transaction.objectStore(store);
    const request = objectStore.openCursor(); //se habre el cursor
    
    request.onsuccess = (e) => {
    const cursor = e.target.result;
        if(cursor){
             
            //console.log(cursor.value);
            data.push(cursor.value)
            //console.log(cursor.value.aplicaciones)
            
            //obtener el ultimo id
            cursor.value.aplicaciones.forEach((element)=>{
                
                if(element.codigo>lastCodigo){
                    lastCodigo = element.codigo;

                }
                
            })

            cursor.continue();
            
        }
        //console.log(lastCodigo);
    };
    
    transaction.oncomplete = () =>{
        

        const nombreApp = document.getElementById('nombreApp').value
        const nombreDesarrollador = document.getElementById('nombreDesarrollador').value
        const precioApp = document.querySelector('#nuevoPrecioApp').value;
        const listaImagenes = document.getElementById('listaImagenes').value
        const calificacionApp = document.getElementById('calificacionApp').value
        const categoriaApp = document.getElementById('categoriaApp').value
        

        const dataApp = {
            app:'app/demo.apk',
            codigo: (lastCodigo + 1),
            calificacion: calificacionApp,
            comentarios: [],
            desarrollador: nombreDesarrollador,
            descargas: 1000,
            descripcion: 'decscripcion prueba daldjajsdljasldjlas',
            icono: listaImagenes,
            imagenes: ["img/app-screenshots/1.webp","img/app-screenshots/2.webp","img/app-screenshots/3.webp"],
            instalada: false,
            nombre: nombreApp,
            precio: precioApp,
        }
        data.forEach((element, index)=>{
            if(categoriaApp == index){
                //console.log(element.aplicaciones);
                element.aplicaciones.push(dataApp);
                dataAplicaciones = element.aplicaciones;

            }
            
        })
        //console.log(dataAplicaiones)

        updateData(dataAplicaciones,categoriaApp,'categorias');
        $('#nuevaApp').modal('hide');
        location.reload();
    }
       
})

//Funcion para agregar una App
const updateData = (data,categoria, store) =>{
    //let request1 = db.result;
    const transaction = db.transaction([store],'readwrite');
    const objectStore = transaction.objectStore(store);

    objectStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if(cursor){
            let keyCategoria = cursor.key - 1
            //console.log(categoria, keyCategoria)
            if(categoria == keyCategoria){
                let valueUpdate = cursor.value;
                valueUpdate.aplicaciones = data;
                const request = cursor.update(valueUpdate);
                request.onsuccess = () =>{
                    console.log('UDDATE SUCCESS')
                }
            }
            //console.log(cursor.key)

            cursor.continue();
        }
        
    }

}

//Funcion para eliminar una App
const deleteData = (codigo) => {
    //$('#modalConfirmarEliminar').modal('show')
    let dataActualApp = [];
    let store = 'categorias';
    if(window.confirm('Esta seguro de eliminar la aplicacion')){
            //console.log('eliminando',codigo)
        const transaction = db.transaction([store],'readwrite');
        const objectStore = transaction.objectStore(store);

        objectStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if(cursor){
                let valueUdate = cursor.value
               
                valueUdate.aplicaciones.forEach( (element, index) =>{
                    //console.log(element.codigo)
                    if(element.codigo == codigo){
                        valueUdate.aplicaciones.splice(index,1)    
                        console.log(valueUdate.aplicaciones);

                        const request = cursor.update(valueUdate);
                        request.onsuccess = () => {
                            console.log('Data eliminate');
                            location.reload();
                        }
                         
                        
                    }
                    
                })
                
                cursor.continue();
            }
        }
                

    }
}





