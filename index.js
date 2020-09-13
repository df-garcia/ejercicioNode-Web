const axios = require("axios");
const http = require("http");
const fs = require("fs");
const url = require("url");

const URL_providers =
  "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";

const URL_customers =
  "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";

const readClientsFile = (callback) => {
  fs.readFile("./src/clientes.html", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let pageContent = data.toString();
      let textReplacement = "";
      axios
        .get(URL_customers)
        .then((response) => {
          response.data.forEach((element) => {
            textReplacement += `<tr>
                <th>${element.idCliente}</th>
                <td>${element.NombreCompania}</td>
                <td>${element.NombreContacto}</td>
            </tr>`;
          });
        })
        .then(() => {
          pageContent = pageContent.replace(
            "{{clientes_replace}}",
            textReplacement
          );
          callback(pageContent);
        });
    }
  });
};

const readProvidersFile = (callback) => {
    fs.readFile("./src/proveedores.html", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        let pageContent = data.toString();
        let textReplacement = "";
        axios
          .get(URL_providers)
          .then((response) => {
            response.data.forEach((element) => {
              textReplacement += `<tr>
                  <th>${element.idproveedor}</th>
                  <td>${element.nombrecompania}</td>
                  <td>${element.nombrecontacto}</td>
              </tr>`;
            });
          })
          .then(() => {
            pageContent = pageContent.replace(
              "{{proveedores_replace}}",
              textReplacement
            );
            callback(pageContent);
          });
      }
    });
  };

http
  .createServer((req, res) => {
    var pathname = url.parse(req.url).pathname;
    if (pathname == "/clientes") {
      readClientsFile((data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data.toString());
      });
    } else if (pathname == "/proveedores") {
      readProvidersFile((data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data.toString());
      });
    }
  })
  .listen(8081);
