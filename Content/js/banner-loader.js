   fetch("/pages/banner.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("inicio").innerHTML = html;
        })
        .catch(error => console.error("Error cargando el banner:", error));