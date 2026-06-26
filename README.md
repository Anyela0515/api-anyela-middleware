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






## PE-2.3: Lab de seguridad de acceso
En esta parte del proyecto se continuo con la API de Express y TypeScript que ya se venia trabajando sea en clases o en casa Ahora se agrego una nueva capa de seguridad usando JWT y tambien un limite de peticiones con rate limiting. Antes la API trabajaba con x-api-key, pero en esta practica se reemplazo esa validacion por un token JWT firmado con HMAC-SHA256.

Para esto se modifico el archivo src/middlewares/auth.ts. En ese archivo se implemento el middleware requireJwt, que revisa si la peticion trae el header Authorization con un Bearer Token. El middleware separa el token en sus tres partes, valida el algoritmo del header, verifica que sea HS256 y rechaza tokens inseguros como alg:none. Tambien recalcula la firma con createHmac y la compara con timingSafeEqual para que la validacion sea mas segura. Ademas se revisan los claims exp y sub, ya que el token debe tener fecha de expiracion y un identificador de usuario.

Tambien se creo el archivo generate-token.mjs en la raiz del proyecto pues este archivo sirve para generar un token JWT de prueba para usarlo en Postman. El token generado incluye los claims sub, iss, aud, scope, exp y jti. Para generar el token use el siguiente comando en PowerShell:

$env:JWT_SECRET="secreto-demo-pe23"; node generate-token.mjs

El resultado es un token largo que luego se copia en Postman en la parte de Authorization como Bearer Token.

Tambien se creo el archivo .env.example para indicar que el proyecto necesita la variable JWT_SECRET. Este archivo no tiene el valor real del secreto, solo deja la variable vacia asi:

JWT_SECRET=

El archivo .env real si contiene el secreto usado para las pruebas, pero no se debe subir a GitHub. Por eso se agrege en .env en el archivo .gitignore 

bueno en la practica se creo el archivo src/middlewares/rateLimiter.ts. Este middleware limita las peticiones en una ventana de 15 minutos y permite maximo 10 peticiones. Si un cliente supera ese limite, la API responde con 429 Too Many Requests. Esto ayuda a evitar demasiadas peticiones seguidas al servidor.

En src/index.ts se agregaron los middlewares en este orden:

express.json() -> logger -> requireJwt -> rateLimiter -> rutas

Este orden es importante porque primero Express lee el body en formato JSON, luego el logger registra la peticion, despues se valida el JWT y finalmente se aplica el limite de peticiones antes de entrar a las rutas.

Para ejecutar el servidor use este comando:

$env:JWT_SECRET="secreto-demo-pe23"; npm run dev

Las pruebas se realizaron en Postman usando la ruta:

POST http://localhost:3000/v2/inscripciones

Prueba 1 token valido
![Prueba 1 token valido](docs/screenshots/PE23_prueba1_201.png)

En la primera prueba se genero un token valido con generate-token.mjs y se uso en Postman como Bearer Token. En el body se envio una inscripcion con los campos estudianteId, materias, periodoId y metodo_pago, usando la misma estructura trabajada en clase.

Body usado:

{
"estudianteId": "uuid-123",
"materias": ["LTI_05A_458"],
"periodoId": "2026-1",
"metodo_pago": "Efectivo"
}

La API respondio con 201 Created, lo que confirma que el token valido fue aceptado y que la ruta v2 funciono correctamente.


Prueba 2 firma invalida
![Prueba 2 firma invalida](docs/screenshots/PE23_prueba2_401.png)
En la segunda prueba se uso un token con firma invalida para comprobar que el servidor rechace tokens alterados.

Token usado:

eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4In0.FIRMA_INVALIDA

La API respondio con 401 Unauthorized y mostro el mensaje Firma invalida. Esto confirma que el middleware esta verificando la firma del token antes de dejar pasar la peticion.

Prueba 3 alg none
![Prueba 3 alg none](docs/screenshots/PE23_prueba3_401.png)

En la tercera prueba se uso un token con alg:none para comprobar que el servidor no acepte tokens sin firma segura.

Token usado:

eyJhbGciOiJub25lIn0.eyJzdWIiOiJ4In0.

La API respondio con 401 Unauthorized y mostro el mensaje Algoritmo no permitido. Esto demuestra que el servidor solo acepta tokens firmados con HS256 y rechaza el ataque alg:none.

Resumen de pruebas

Prueba 1 token valido -> 201 Created
Prueba 2 firma invalida -> 401 Unauthorized
Prueba 3 alg none -> 401 Unauthorized

Los archivos creados o modificados en esta practica fueron src/middlewares/auth.ts, src/middlewares/rateLimiter.ts, src/index.ts, generate-token.mjs, .env.example, .gitignore y README.md.

Como conclusion, en esta practica la API quedo mas segura porque ya no depende solo de una API Key simple. Ahora usa JWT firmado con HMAC-SHA256, valida la firma del token, bloquea tokens con alg:none y tambien controla demasiadas peticiones con rate limiting. Las pruebas en Postman confirmaron que el acceso con token valido funciona y que los tokens invalidos son rechazados correctamente.