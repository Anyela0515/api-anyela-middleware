# api-anyela

API realizada con Express y TypeScript
Se configuro el proyecto con modulos ES y se agregaron dos middlewares. El primero registra las peticiones que llegan al servidor y el segundo valida el header x-api-key.

# Instalacion
npm install
# Ejecutar el servidor
npm run dev

El servidor se levanta en el puerto 3000.

http://localhost:3000
# API Key

La clave usada para las pruebas fue:

secreto-demo

Se envia en el header:

x-api-key: secreto-demo

# Pruebas
1. Sin API key

Comando:

curl http://localhost:3000/health

Salida:

curl : {"code":401,"error":"API key inválida o ausente"}

No se envio la clave, por eso la respuesta fue 401.

2. Con API key valida

Comando:

curl.exe -H "x-api-key: secreto-demo" http://localhost:3000/health

Salida:

{"code":200,"status":"API saludable","timestamp":"2026-06-12T02:21:54.076Z"}

Con la clave correcta la ruta /health responde con codigo 200.

3. Ruta inexistente

Comando:

curl.exe -H "x-api-key: secreto-demo" http://localhost:3000/noexiste

Salida:

{"code":404,"error":"Ruta no encontrada"}

La clave era valida, pero la ruta no existe, por eso responde 404.

# Verificacion
npx tsc --noEmit

El comando se ejecuto sin errores.



En esta parte del PE-2.1 agregue pruebas unitarias con Jest para comprobar que los middlewares funcionen correctamente sin levantar el servidor.

Para esto cree y configure los archivos necesarios para las pruebas:

jest.config.ts
src/middlewares/auth.test.ts
src/middlewares/logger.test.ts

Tambien modifique el package.json para agregar el script:

"test": "jest"

Las pruebas realizadas fueron para el middleware de autenticacion y para el logger. En auth.test.ts se valido que la API key sea obligatoria y que solo permita continuar cuando la clave sea correcta. En logger.test.ts se comprobo que el middleware registre la peticion y continue con next().

Para ejecutar las pruebas use el comando:

npm test

Resultado obtenido:

PS C:\Users\User\Downloads\api-anyela\api-anyela> npm test

> api-anyela@1.0.0 test
> jest

 PASS  src/middlewares/auth.test.ts
 PASS  src/middlewares/logger.test.ts

Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        2.63 s, estimated 3 s
Ran all test suites.



## Documentacion del endpoint

En esta practica se documento el endpoint `POST /v2/inscripciones` bueno sta ruta sirve para registrar una inscripcion, enviando el id del estudiante, las materias, el periodo y el metodo de pago.

Para usar este endpoint se debe enviar el header `x-api-key: secreto-demo`, ya que la API tiene autenticacion por clave.

Ejemplo de body correcto:

```json
{
  "estudianteId": 1150154639,
  "materias": [
    "Programacion de Middleware",
    "Gestion de Servicios Cloud"
  ],
  "periodoId": 2,
  "metodo_pago": "Efectivo"
}
```

Si los datos estan completos, la API responde con `201 Created`.

```json
{
  "version": "v2",
  "message": {
    "estudianteId": 1150154639,
    "materias": [
      "Programacion de Middleware",
      "Gestion de Servicios Cloud"
    ],
    "periodoId": 2,
    "metodo_pago": "Efectivo"
  }
}
```

Si falta un campo obligatorio o el metodo de pago no es valido, la API responde con `400 Bad Request`.

```json
{
  "error": "Campos requeridos del estudianteId, materias, periodoId"
}
```

```json
{
  "error": "El metodo de pago insertado debe ser: Efectivo, Debito, Credito o Transferencia"
}
```

## Contrato OpenAPI 3.1

Se agrego el archivo `openapi.yaml` en la raiz del repositorio en este archivo se documentaron las rutas `/health`, `/v1/inscripciones` y `/v2/inscripciones`, junto con sus datos de entrada, respuestas y errores posibles.

El contrato se valido con:

```bash
npx @redocly/cli lint openapi.yaml
```

Tambien se comprobo que el proyecto siga funcionando con:

```bash
npx tsc --noEmit
npm test
```

## Pruebas en Postman

Las pruebas se realizaron con el servidor en `http://localhost:3000` y usando el header `x-api-key: secreto-demo`.

### Escenario 1: inscripcion v1 correcta

La ruta `POST /v1/inscripciones` respondio con `201 Created`.

![Prueba v1 correcta](docs/screenshots/01-v1-201.png)

### Escenario 2: inscripcion v2 correcta

La ruta `POST /v2/inscripciones` respondio con `201 Created` al enviar el metodo de pago.

![Prueba v2 correcta](docs/screenshots/02-v2-201.png)

### Escenario 3: v2 sin metodo_pago

Al no enviar `metodo_pago`, la API respondio con `400 Bad Request`.

![Prueba v2 sin metodo_pago](docs/screenshots/03-v2-400-faltante.png)

### Escenario 4: v2 con metodo_pago invalido

Al enviar `Cheque` como metodo de pago, la API respondio con `400 Bad Request`.

![Prueba v2 con metodo_pago invalido](docs/screenshots/04-v2-400-invalido.png)

## Versionado

Un cambio compatible seria agregar un campo opcional como `observacion`, porque los clientes actuales podrian seguir enviando los mismos datos y la API seguiria funcionando.

Un cambio que romperia la compatibilidad seria cambiar `metodo_pago` por `forma_pago`, porque los clientes que ya usan `metodo_pago` empezarian a recibir error `400 Bad Request`.


- TA-2.2 Documento OpenAPI refinado

Resultado de la validacion del contrato OpenAPI:

![Lint OpenAPI sin errores](docs/screenshots/05-lint-openapi.png)


## Reflexion

Si otro equipo empezara a consumir mi API mañana, lo primero que cambiaria en el contrato seria hacerlo mas completo y facil de entender para otras personas. Agregaria ejemplos claros de como enviar los datos, las respuestas que puede devolver la API y los errores que podrian aparecer cuando falte algun campo o cuando un dato no sea valido. Tambien cuidaria no cambiar de golpe los nombres de los campos que ya existen, porque eso podria afectar a quienes ya esten usando la API. Si necesito agregar algo nuevo, lo haria como campo opcional o en una nueva version para que el otro equipo pueda adaptarse sin problemas en si