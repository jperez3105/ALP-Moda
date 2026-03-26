let productos = JSON.parse(localStorage.getItem("productos")) || [];

// GUARDAR
function guardar() {
  localStorage.setItem("productos", JSON.stringify(productos));
}

// MOSTRAR TIENDA
function mostrarProductos() {
  let contenedor = document.getElementById("productos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  productos.forEach((p, index) => {
    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${p.imagen1}">
      <div class="info">
        <h3>${p.nombre}</h3>
        ${p.etiqueta ? `<p class="etiqueta">${p.etiqueta}</p>` : ""}
        <p>$${p.precio}</p>
        ${p.descripcion ? `<p>${p.descripcion}</p>` : ""}
        <button onclick="comprar('${p.nombre}', ${p.precio})">
          Pedir por WhatsApp
        </button>
      </div>
    `;

    contenedor.appendChild(card);
  });
}

// WHATSAPP (YA CON TU NÚMERO)
function comprar(nombre, precio) {
  let mensaje = `Hola, me interesa ${nombre} de $${precio}`;
  let url = `https://wa.me/5215564982086?text=${encodeURIComponent(mensaje)}`;
  window.open(url);
}

// AGREGAR PRODUCTO (CON 2 IMÁGENES)
function agregarProducto() {
  let nombre = document.getElementById("nombre").value;
  let precio = document.getElementById("precio").value;
  let descripcion = document.getElementById("descripcion").value;
  let etiqueta = document.getElementById("etiqueta").value;

  let img1 = document.getElementById("imagen1").files[0];
  let img2 = document.getElementById("imagen2").files[0];

  if (!img1) {
    alert("Debes subir al menos una imagen");
    return;
  }

  let reader1 = new FileReader();
  let reader2 = new FileReader();

  reader1.onload = function(e1) {
    if (img2) {
      reader2.onload = function(e2) {
        guardarProducto(e1.target.result, e2.target.result);
      };
      reader2.readAsDataURL(img2);
    } else {
      guardarProducto(e1.target.result, "");
    }
  };

  reader1.readAsDataURL(img1);

  function guardarProducto(imagen1, imagen2) {
    let producto = {
      nombre,
      precio,
      descripcion,
      etiqueta,
      imagen1,
      imagen2
    };

    productos.push(producto);
    guardar();
    mostrarAdmin();
    alert("Producto agregado");
  }
}

// MOSTRAR ADMIN
function mostrarAdmin() {
  let lista = document.getElementById("listaAdmin");
  if (!lista) return;

  lista.innerHTML = "";

  productos.forEach((p, index) => {
    let div = document.createElement("div");

    div.innerHTML = `
      <p>${p.nombre} - $${p.precio}</p>
      <button onclick="eliminar(${index})">Eliminar</button>
      <hr>
    `;

    lista.appendChild(div);
  });
}

// ELIMINAR
function eliminar(index) {
  productos.splice(index, 1);
  guardar();
  mostrarAdmin();
}

// BUSCADOR
let buscador = document.getElementById("buscador");
if (buscador) {
  buscador.addEventListener("input", function() {
    let texto = buscador.value.toLowerCase();

    let filtrados = productos.filter(p =>
      p.nombre.toLowerCase().includes(texto)
    );

    let contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    filtrados.forEach(p => {
      let card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${p.imagen1}">
        <div class="info">
          <h3>${p.nombre}</h3>
          <p>$${p.precio}</p>
          <button onclick="comprar('${p.nombre}', ${p.precio})">
            Pedir por WhatsApp
          </button>
        </div>
      `;

      contenedor.appendChild(card);
    });
  });
}

// INICIAR
mostrarProductos();
mostrarAdmin();