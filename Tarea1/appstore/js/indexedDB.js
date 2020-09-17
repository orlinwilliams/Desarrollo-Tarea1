
let db;
const createDB = (name,store,data) => {
    
    const indexedDB = window.indexedDB;
    const request = indexedDB.open(name, 1);    
    //console.log('ESTA ES LA DATA A INGRESAR',data)
       
    request.onsuccess = () => {
        db = request.result;
        console.log('DATA BASE CREATE');
        getDataAll(store)
        //console.log(dataAll)
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

        //LLENA LA BASE DE DATOS 
        store1.transaction.oncomplete= function(event){
            let categorias = db.transaction(store, "readwrite").objectStore(store);
            data.forEach(element => {
                categorias.add(element)    
            });
            
        }
        
    };
            
}


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
        let containerCard = document.querySelector('#containerCard');
        
        //LLeno las categorias
        data.forEach((element,indice) => {
            select.innerHTML += `<option value =${indice}>${element.nombreCategoria}</option>` 
            
        });
        
        //Se cargar el home, todas las aplicaciones 
        data.forEach((element,indice)=>{
            console.log(element.aplicaciones)
            element.aplicaciones.forEach(element1=>{
                let estrellas='';
                
                for(let i=0; i<element1.calificacion;i++){
                    console.log(element1.calificacion);
                    estrellas+=`<i class="fas fa-star"></i>`;
                    
                }
                //Generar estrellas vacias
                for(let i=0; i<(5-element1.calificacion);i++){
                    estrellas+=`<i class="far fa-star"></i>`;
                    
                }
                containerCard.innerHTML+= 
                `<div class="col-lg-2 col-md-3 col-6">
                    <div class="card card-mouse" data-target="#staticBackdrop" onclick="modalItem(${element1.codigo})">
                        <img src="${element1.icono}" class="card-img-top" alt="...">
                    
                        <h5>${element1.nombre}</h5>
                        <p>Desarrollador</p>
                        <div id="calificacion">
                           ${estrellas}
                        </div>
                        <div id="precioApp"> 
                            <h5>$${element1.precio}</h5>
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
                    
                    containerCard.innerHTML+= `<div class="col-lg-2 col-md-3 col-6">
                    <div class="card">
                        <img src="${element.icono}" class="card-img-top" alt="...">
                        <div class="card-body">
                        <h5 class="card-title">${element.nombre}</h5>
                        <p class="card-text">Desarrollador</p>
                            <div>
                                <i class="fas fa-star"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                            </div>
                            </div>
                        </div>   
                    </div>`
                })    
            }
            else{
                containerCard.innerHTML='';
                console.log(selectValue)
                //Se cargar el home, todas las aplicaciones 
                data.forEach((element,indice)=>{
                    console.log(element.aplicaciones)
                    element.aplicaciones.forEach(element1=>{
                        containerCard.innerHTML+= `<div class="col-lg-2 col-md-3 col-6">
                        <div class="card">
                            <img src="${element1.icono}" class="card-img-top" alt="...">
                            <div class="card-body">
                            <h5 class="card-title">${element1.nombre}</h5>
                            <p class="card-text">Desarrollador</p>
                                <div>
                                    <i class="fas fa-star"></i>
                                    <i class="far fa-star"></i>
                                    <i class="far fa-star"></i>
                                    <i class="far fa-star"></i>
                                    <i class="far fa-star"></i>
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
const modalItem = (codigo)=>{
    $('#staticBackdrop').modal('show');
    //console.log(modalShow)
    let store = 'categorias'
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
    console.log(codigo)
}


const getData = (data)=>{
    
    const transaction = db.transaction();
    const objectStore = transaction.objectStore(this.store);
    const request = objectStore.get(data);
    
    request.onsuccess = (event) => {
    //console.log(request.result);
        return request.result 
    };
}

/*FUNCION CON EVENTO PARA AGREGAR A LA BASE DE DATOS
const addData = (data,store) =>{
    let request1 = db.result;
    const transaction = request1.transaction([store],'readwrite');
    const objectStore = transaction.objectStore(store);
    const add = objectStore.add(data);

    transaction.onerror = (error) => {
        console.log('ERRORN EN ADDDATA ',error)
    }

}*/



