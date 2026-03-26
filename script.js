// 🔐 LOGIN ADMIN
if (window.location.href.includes("admin.html")) {
  let usuario = prompt("Usuario:");
  let contraseña = prompt("Contraseña:");

  if (usuario !== "ALP-ADMIN" || contraseña !== "OSIMIA") {
    alert("Acceso denegado");
    window.location.href = "index.html";
  }
}

const db = firebase.firestore();

// 👉 MOSTRAR PRODUCTOS (TIEMPO REAL)
function mostrarProductos() {
  let contenedor = document.getElementById("productos");
  if (!contenedor) return;

  db.collection("productos").onSnapshot(snapshot => {
    contenedor.innerHTML = "";

    snapshot.forEach(doc => {
      let p = doc.data();

      let card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${p.imagen1}">
        ${p.imagen2 ? `<img src="${p.imagen2}">` : ""}
        <div class="info">
          <h3>${p.nombre}</h3>
          <p class="precio">$${p.precio}</p>
          ${p.descripcion ? `<p>${p.descripcion}</p>` : ""}
          <button onclick="comprar('${p.nombre}', ${p.precio})">
            Comprar por WhatsApp 💬
          </button>
        </div>
      `;

      contenedor.appendChild(card);
    });
  });
}

// 👉 AGREGAR PRODUCTO
function agregarProducto() {
  let nombre = document.getElementById("nombre").value;
  let precio = document.getElementById("precio").value;
  let descripcion = document.getElementById("descripcion").value;
  let etiqueta = document.getElementById("etiqueta").value;

  let img1 = document.getElementById("imagen1").files[0];
  let img2 = document.getElementById("imagen2").files[0];

  if (!img1) {
    alert("Sube una imagen");
    return;
  }

  let reader1 = new FileReader();
  let reader2 = new FileReader();

  reader1.onload = function(e1) {
    if (img2) {
      reader2.onload = function(e2) {
        guardarFirebase(e1.target.result, e2.target.result);
      };
      reader2.readAsDataURL(img2);
    } else {
      guardarFirebase(e1.target.result, "");
    }
  };

  reader1.readAsDataURL(img1);

  function guardarFirebase(imagen1, imagen2) {
    db.collection("productos").add({
      nombre,
      precio,
      descripcion,
      etiqueta,
      imagen1,
      imagen2
    });

    alert("Producto agregado");
  }
}

// 👉 MOSTRAR ADMIN + ELIMINAR
function mostrarAdmin() {
  let lista = document.getElementById("listaAdmin");
  if (!lista) return;

  db.collection("productos").onSnapshot(snapshot => {
    lista.innerHTML = "";

    snapshot.forEach(doc => {
      let p = doc.data();

      let div = document.createElement("div");

      div.innerHTML = `
        <p><strong>${p.nombre}</strong> - $${p.precio}</p>
        <button onclick="eliminar('${doc.id}')">Eliminar</button>
        <hr>
      `;

      lista.appendChild(div);
    });
  });
}

function eliminar(id) {
  db.collection("productos").doc(id).delete();
}

// 👉 WHATSAPP
function comprar(nombre, precio) {
  let mensaje = `Hola, me interesa ${nombre} de $${precio}`;
  window.open(`https://wa.me/5215564982086?text=${encodeURIComponent(mensaje)}`);
}

// INICIAR
mostrarProductos();
mostrarAdmin();