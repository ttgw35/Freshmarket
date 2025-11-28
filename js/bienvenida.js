
// bienvenida.js
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("welcome-popup");
  const closeBtn = document.getElementById("close-popup");
  const message = document.getElementById("welcome-message");

  const mensajeMostrado = sessionStorage.getItem("mensajeBienvenidaMostrado");

  if (!mensajeMostrado) {
    // Obtener la hora actual
    const hora = new Date().getHours();
    let saludo = "";

    if (hora >= 5 && hora < 12) {
      saludo = "¡Buenos días!";
    } else if (hora >= 12 && hora < 18) {
      saludo = "¡Buenas tardes!";
    } else {
      saludo = "¡Buenas noches!";
    }

    message.textContent = `${saludo} Bienvenido a freshMarket. ¡Disfruta de tu experiencia de compra!`;

    // Mostrar el popup con retraso breve
    setTimeout(() => {
      popup.classList.add("show");
    }, 1000);

    // Cerrar el popup al hacer clic en la X
    closeBtn.addEventListener("click", () => {
      popup.classList.remove("show");
      // Guardar en sessionStorage que ya se mostró
      sessionStorage.setItem("mensajeBienvenidaMostrado", "true");
    });
  }
});
