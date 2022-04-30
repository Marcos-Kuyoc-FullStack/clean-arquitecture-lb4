# Documentación Arquitectura de Software

# Introducción

Uno de los problemas principales a la hora de construir software es definir la estructura del código fuente y solventar el problema de la escalabilidad, es por ello que en este documento definiremos la **arquitectura de software** a usar.  La intención es mostrar esas buenas prácticas que han hecho que nuestro código sea más **flexible**, más fácil de **entender** y de **testear** a la hora de construir las diferentes APIs.

## Aprendizaje

El desarrollo de  distintas APIS me llevo a encontrar el camino hacia las arquitecturas limpias(**Clean Arquitecture**), sin embargo en el proceso cometimos varios errores que nos hicieron aprender e ir transitando a este tipos de metodologías, a continuación conoceremos algunos conceptos claves para entender y no cometer los mismos errores.

# Teoría de la arquitectura del código

![https://miro.medium.com/max/700/1*yR4C1B-YfMh5zqpbHzTyag.png](https://miro.medium.com/max/700/1*yR4C1B-YfMh5zqpbHzTyag.png)

![https://xurxodev.com/content/images/2016/07/CleanArchitecture-8b00a9d7e2543fa9ca76b81b05066629.jpg](https://xurxodev.com/content/images/2016/07/CleanArchitecture-8b00a9d7e2543fa9ca76b81b05066629.jpg)

![https://code2read.files.wordpress.com/2015/07/onion-architecture.png?w=700](https://code2read.files.wordpress.com/2015/07/onion-architecture.png?w=700)

*Hexagonal Arquitecture*, *Clean Arquitecture* y *Onion Arquitecture* son los diferentes tipos de arquitecturas mas conocidas y aunque parezcan diferentes cada una de ellas trata de los mismo, organizar el código de la la aplicación de forma que se separe bien la **lógica de negocio** del **código de infraestructura**

Con esta idea en mente podemos plantearnos un caso de uso y comenzar a trabajar en los requerimientos.

### Caso de uso #1  (Crear un nuevo usuario)

1. Comprobar que no haya otro usuario con el mismo email.
2. Validar que la contraseña sea lo suficientemente fuerte.
3. Almacenar o persistir los datos del usuario.
4. Enviar un email de bienvenida.

Todo el código generado para que se cumpla el *caso de uso* se conoce como código de **lógica de negocio** o también llamado del **dominio de la aplicación**, pero todos los detalles de como se persiste los datos del usuario(BD), o cómo se envía el email de bienvenida (Sendgrid, Mandrill, SES, etc) es **código de infraestructura.**

La razón detrás de esta separación está muy clara: Cambiar la forma de enviar los correos o de persistir los usuarios no debe afectar la lógica de nuestra aplicación.

![https://ivanguardado.com/assets/images/domain-infrastructure-1.png](https://ivanguardado.com/assets/images/domain-infrastructure-1.png)

### ¿Cómo se logra el objetivo si quisiéramos cambiar nuestra DB de postgres o mongo?

La solución a este problema es que el código del dominio **exponga interfaces,** de forma que se establece una vía de comunicación con las capas mas externas. El código del dominio extiende solamente de interfaces expuestas, por lo que son las ***clases externas*** las que implementan las interfaces, a estas clases externas se le conoce como ***Adapters(Adaptadores)***.

![https://ivanguardado.com/assets/images/domain-infrastructure-2.png](https://ivanguardado.com/assets/images/domain-infrastructure-2.png)

# El Dominio

Aunque la separación entre el dominio y la infraestructura es la mas natural, dentro de el dominio tenemos que organizar de la mejor forma posible toda la lógica del negocio y para esto usamos los principios SOLID de forma que sea fácil de leer, cambiar y sobre todo testear nuestra aplicación. Dentro del dominio se suelen dividir en diferentes capas, las mas conocidas están: **Objetos del dominio** *(Entity Model)*, **Interfaces de Repositorios** y **Servicios de la Aplicación**.

### Objetos del dominio

Son las clases, objetos, valores, eventos, tipos etc que componen el núcleo del dominio. Uno de los tipos de objeto de dominio más importante son las **entidades**, que son objetos con una identidad única que representan una parte importante del negocio. Por ejemplo los usuarios, roles, clientes, productos, descuentos etc.

### Interfaces de repositorios

Son las diferentes interfaces expuestas que funciona como puente de comunicación con los diferentes adaptadores o clases concretas que implementan dichas interfaces.

## Servicios de la Aplicación

Son los **casos de usos reales** que definen la aplicación y son el punto de entrada desde fuera del framework a nuestra lógica de negocio, si queremos conectar nuestro dominio con un servicio web como express o a través de otro servicio este seria el punto de entrada, nunca por los objetos del dominio o los repositorios.

En el ejemplo de uso de express seria a través de los controladores que llamaríamos a los diferentes servicios de la aplicación.

Para ayudarnos con esta parte y agilizar el proceso de construcción de nuestras apis se usa el framework **Loopback 4** ya que tiene incluido en su core las 3 capas de dominio mencionadas antes y la capa de infraestructura que incluye los controladores y los diferentes adaptadores de base de datos(datasources).

# Regla de dependencia

Ahora que hemos visto las diferentes capas en que debemos dividir nuestro código de dominio, podemos representar su jerarquía como un conjunto de capas concéntricas donde las capas más cercanas al centro representan el modelo de nuestro negocio, y las capas más exteriores representan detalles de la implementación de la infraestructura.

![arquitectura-componente.jpg](Documentacio%CC%81n%20Arquitectura%20de%20Software%205e204d122a404caf872ceb26d25650ce/arquitectura-componente.jpg)

Para mantener todo el código desacoplado necesitamos seguir la regla de dependencia, que dice que **las capas interiores no pueden conocer nada sobre las capas exteriores**. Es decir, una entidad no puede conocer y usar un servicio de aplicación etc., sin embargo el flujo contrario está permitido, por ejemplo, un servicio de aplicación orquesta el flujo de repositorios y/o entidades, o un endpoint del framework llamará a un servicio de aplicación.

En algunos casos podemos necesitar dependencias de infraestructura dentro de nuestro dominio. Eso se soluciona exponiendo interfaces o (puertos) de forma que **invertimos el flujo de dependencia,** cumpliendo con lo que nos dice esta regla. A esta técnica se le conoce como inversión de control(IoC *inversion of Control*)

### Inyección de dependencias(DI)

La inyección de dependencias es un patrón de diseño que nos va a permitir realizar la inversión de control en nuestro código. La idea consiste en qué las **dependencias son especificadas externamente** en lugar de requerirse explícitamente en el código. En otro sentido es un patrón de diseño que se encarga de extraer la responsabilidad de la creación de instancias de un componente para delegar a otro.

Loopback 4 ya integra la Inyección de dependencias(DI) así mismo la inversión de control(IoC) que podemos usar de forma inmediata.

Ejemplos:

Código acoplado con dependencia oculta

```tsx
class UseCase {
	constructor() {
		this.externalService = new ExternalService();
	}

	doSomenthing() {
		this.externalService.doExternalTask();
	}
}

class ExternalService {
	doExternalTask() {
		console.log('Doing task...');
	}
}

const client = new UseCase();
client.doSomenthing();
```

En este caso nos encontramos con un caso de alto acoplamiento, ya que la clase *UseCase* tiene una **dependencia oculta** de la clase *ExternalService.* Si, por algún motivo tuviéramos que cambiar la implementación de la clase ExternalService, la funcionalidad de la clase UseCase podría verse afectada.  ¿Te imaginas la pesadilla que esto supone a nivel de mantenimiento en un proyecto real? para lidiar con esta problemática debemos empezar por aplicar el **patrón de inyección de dependencias**.

Código acoplado, con dependencia visible

```tsx
class UseCase{
	constructor(private externalService: ExternalService) {
	}

	doSomenthing() {
		this.externalService.doExternalTask();
	}
}

class ExternalService {
	doExternalTask() {
		console.log('Doing task...');
	}
}

const externalService = new ExternalService();
const client = new UseCase(externalService);
client.doSomenthing();
```

Ya está, así de sencillo, esto de inyectar la dependencia vía constructor, que también se podría hacer vía método **setter.** Ahora, aunque seguimos teniendo un grado de acoplamiento alto, la dependencia es visible, con lo cual ya nos queda más clara la relación entre las clases.

### Aplicando Inversión de dependencias(DIP)

En nuestro ejemplo seguimos teniendo un grado de acoplamiento alto, ya que la clase *UseCase* hace uso de una implementación concreta de *ExternalService.* Lo ideal aquí es que la clase cliente (*UseCase*) dependa de una abstracción(*interfaz*) que defina el contrato que necesita, en este caso *doExternalTask(),* es decir, la clase menos importante *ExternalService*, debe adaptarse a las necesidades de la clase más importante, *UseCase*.

Código desacoplado, con la dependencia invertida

```tsx
interface IExternalService{
	doExternalTask: () => boolean;
}

class UseCase {
	constructor(private externalService: IExternalService){
	}

	doSomenthing() {
		this.externalService.doExternalTask();
	}
}

class ExternalServiceSendToEmailSendgrid implements IExternalService {
	doExternalTask() {
    // more task
    // sendgrid
		return true;
	}
}

class ExternalServiceSendToEmailMailcheap implements IExternalService {
	doExternalTask() {
    // more task
    // mailcheap | otro servicio de correo
		return true;
	}
}

const externalService1 = new ExternalServiceSendToEmailSendgrid();
const externalService2 = new ExternalServiceSendToEmailMailcheap()
const client = new UseCase(externalService2);
client.doSomenthing();
```

Ahora el código de la clase *UseCase* está totalmente desacoplado de la clase *ExternalService* y tan solo depende de una interfaz creada en base a sus necesidades, con lo cual podemos decir que hemos invertido la dependencia, esta ventaja significativa nos ayuda a tener el código mas entendible y fácil de testear.
