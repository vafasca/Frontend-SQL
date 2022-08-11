/**
 * Variables del sistema
 * @table Tabla titulo de contactos
 * @form contenedor formulario
 * @title titulo del sistema
 * @template template dinamico que se incrementa segun la lista de BD
 * @fragment clona y almacena temporalmente el resultado para luego mandar al tbody
 * 
 */
var table = document.querySelector(".crud_table");
var form = document.querySelector(".crud_form");
var title = document.querySelector(".crud_title");
var template = document.getElementById("crud_template").content;
var fragment = document.createDocumentFragment();

/**
 * Lista los contoctos almacenados
 */
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
      template.querySelector(".delete_l").dataset.id = el.id;

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

document.addEventListener("submit", async e => {
  if (e.target === form) {
    e.preventDefault();
    /**
     * Metodo POST para crear un nuevo contacto
     */
    if (!e.target.id.value) {
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
        let message = err.statusText || "Error";
        form.insertAdjacentHTML(
          "afterend",
          `<p><b>Error ${err.status}: ${message}</b></p>`
        );
      }
    } else {
      /**
       * Metodo PUT actualiza a un contacto
       */
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

/**
 * Evento al hacer click en update envia los valores de los datos
 */
document.addEventListener("click", async e => {
  if (e.target.matches(".update")) {
    title.textContent = "Actualizar Contacto";
    form.id.value = e.target.dataset.id;
    form.nombre.value = e.target.dataset.name;
    form.email.value = e.target.dataset.email;
    form.fecha_nacimiento.value = e.target.dataset.fecha_nacimiento;
    form.telefono.value = e.target.dataset.telefono;
  }

  /**
   * Borrado fisico
   */
  if (e.target.matches(".delete_p")) {
    console.log(form.nombre.value);
    let isDelete = confirm(`Eliminar contacto`);

    if (isDelete) {
      try {
        let options = {
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=utf-8"
          }
        },
          res = await fetch(`http://localhost:9090/api/v1/contact/physicalDelete/${e.target.dataset.id}`, options),
          json = await res.json();
        if (!res.ok) throw { status: res.status, statusText: res.statusText };
        location.reload();
      } catch (err) {
        let message = err.statusText || "Error";
        alert(`Error ${err.status}: ${message}`);
      }
    }
  }

  /**
  * Borrado logico
  */
  if (e.target.matches(".delete_l")) {
    console.log(form.nombre.value);
    let isDelete = confirm(`Eliminar contacto logicamente`);

    if (isDelete) {
      try {
        let options = {
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=utf-8"
          }
        },
          res = await fetch(`http://localhost:9090/api/v1/contact/logicDelete/${e.target.dataset.id}`, options),
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