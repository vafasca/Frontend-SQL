var table = document.querySelector(".crud_table");
var form = document.querySelector(".crud_form");
var title = document.querySelector(".crud_title");
var template = document.getElementById("crud_template").content;
var fragment = document.createDocumentFragment();

const getContacts = async () => {
try {
  let res = await fetch("http://localhost:9090/contactos"),
    json = await res.json();

  if (!res.ok) throw { status: res.status, statusText: res.statusText };
  console.log(json);
  json.forEach((el) => {
    template.querySelector(".name").textContent = el.nombre;
    template.querySelector(".email").textContent = el.email;
    template.querySelector(".fecha_nacimiento").textContent = el.fecha_nacimiento;
    template.querySelector(".telefono").textContent = el.telefono;
    template.querySelector(".update").dataset.id = el.id;
    template.querySelector(".update").dataset.name = el.nombre;
    template.querySelector(".update").dataset.email = el.email;
    template.querySelector(".update").dataset.fecha_nacimiento = el.fecha_nacimiento;
    template.querySelector(".update").dataset.telefono = el.telefono;
    template.querySelector(".delete_p").dataset.id = el.id;

    let clone = document.importNode(template, true);
    fragment.appendChild(clone);
  });

  table.querySelector("tbody").appendChild(fragment);

  table.querySelector("tbody").appendChild(fragment);
} catch (err) {
  let message = err.statusText || "Error";
  table.insertAdjacentHTML(
    "afterend",
    `<p><b>Error ${err.status}: ${message}</b></p>`
  );
}
};

document.addEventListener("DOMContentLoaded", getContacts);

//evento submit
document.addEventListener("submit", async e => {
if (e.target === form) {
  e.preventDefault();
  if (!e.target.id.value) {
    //CREATE POST
    try {
      let options = {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            nombre: e.target.nombre.value,
            email: e.target.email.value,
            fecha_nacimiento: e.target.fecha_nacimiento.value,
            telefono: e.target.telefono.value
          }),
        },
        res = await fetch(
          "http://localhost:9090/api/v1/contact",
          options
        ),
        json = await res.json();
      if (!res.ok)
        throw { status: res.status, statusText: res.statusText };
        location.reload();
    } catch (error) {
      let message = err.statusText || "Ocurrió un error";
      form.insertAdjacentHTML(
        "afterend",
        `<p><b>Error ${err.status}: ${message}</b></p>`
      );
    }
  } else {
    //UPDATE POST
    try {
      let options = {
          method: "PUT",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            nombre: e.target.nombre.value,
            email: e.target.email.value,
            fecha_nacimiento: e.target.fecha_nacimiento.value,
            telefono: e.target.telefono.value
          }),
        },
        res = await fetch(
          `http://localhost:9090/api/v1/contact/${e.target.id.value}`,
          options
        ),
        json = await res.json();
      if (!res.ok)
        throw { status: res.status, statusText: res.statusText };
        location.reload();
    } catch (error) {
      let message = err.statusText || "Error";
      form.insertAdjacentHTML(
        "afterend",
        `<p><b>Error ${err.status}: ${message}</b></p>`
      );
    }
  }
}
});
document.addEventListener("click", async e=>{
if (e.target.matches(".update")) {
  title.textContent = "Actualizar Contacto";
  form.id.value = e.target.dataset.id;
  form.nombre.value = e.target.dataset.name;
  form.email.value = e.target.dataset.email;
  form.fecha_nacimiento.value = e.target.dataset.fecha_nacimiento;
  form.telefono.value = e.target.dataset.telefono;
}

if (e.target.matches(".delete_p")) {
    console.log(form.nombre.value);
    let isDelete = confirm(`Eliminar contacto`);

    if (isDelete) {
      //Delete - DELETE
      try {
        let options = {
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=utf-8"
          }
        },
          res = await fetch(`http://localhost:9090/api/v1/contact/${e.target.dataset.id}`, options),
          json = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };
        location.reload();
      } catch (err) {
        let message = err.statusText || "Error";
        alert(`Error ${err.status}: ${message}`);
      }
    }
  }
})