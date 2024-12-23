// este script es para el formulario, sacado de la página de formspree

var form = document.getElementById("form-contacto");
  
async function handleSubmit(event) {
   event.preventDefault();
   var status = document.getElementById("form-contacto-status");
   var data = new FormData(event.target);
   if (data.get("nombre") === "" || data.get("correo") === "" || data.get("mensaje") === "") {
     status.innerHTML = "Por favor complete todos los campos";
     console.log("falta completar campos")
     return;
   }
   fetch(event.target.action, {
     method: form.method,
     body: data,
     headers: {
         'Accept': 'application/json'
     }
   }).then(response => {
     if (response.ok) {
       status.innerHTML = "Muchas gracias por su mensaje! Nos pondremos en contacto a la brevedad";
       form.reset()
     } else {
       response.json().then(data => {
         if (Object.hasOwn(data, 'errors')) {
           status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
         } else {
           status.innerHTML = "Oops! Hubo un problema al enviar el formulario"
         }
       })
     }
   }).catch(error => {
     status.innerHTML = "Oops! Hubo un problema al enviar el formulario"
   });
 }
 form.addEventListener("submit", handleSubmit)