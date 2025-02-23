# Prueba técnica sistema de depredación
Este pequeño proyecto pretende servir como medio de agilización para encontrar las relaciones de depredación entre las especies que
componen el ecosistema siendo simulado a modo de juego.
![In-game screenshot](/imgs/inGameScreenshot.png)

## Contexto
Este proyecto es sólo un componente de un juego más grande (*no digital, sino más bien físico/presencial*). La base subyacente de este programa
es un juego de simulación de un ecosistema (*simplificado*) integrado por **consumidores primarios** (*hervíboros*) y **consumidores secundarios** (*carnívoros*).
Cada jugador parte con una cantidad de *unidades de biomasa* representada en forma de garbanzos (o lo que tú establezcas como unidades de biomasa). Esta
cantidad de partida varía según la especie: para los **consumidores primarios** (*a los que llamaré **C1s** a partir de ahora*) es de *15 uds* mientras que
para los consumidores secundarios (***C2s** a partir de ahora*) es de *18 uds*. El objetivo último del juego es permanecer vivo a lo largo de los **ciclos** en los
que se desarrolla, es decir, a lo largo de cada partida. Sobrevivir en este contexto implica **mantener** tus **unidades de biomasa** (*si las pierdes mueres, por
lo menos de forma momentánea*).

Antes de pasar a explicar cómo se desarrolla un **ciclo**, primero debes familiarizarte con las cartas que componen el juego. Existen cartas que afectan
al nivel de los C1s, al de los C2 y cartas que afectan directamente al ecosistema. A las cartas que afectan a los niveles tróficos (*a los C1s y C2s*),
las llamaremos **factores bióticos**, esto es, aquellas condiciones que **limitan** o **mejoran** la **condición de vida** de un C1 o un C2. Por ejemplo,
la carta de *Huida rápida* en los C1s aumenta tu velocidad en 6 unidades (*más información sobre la dinámica de velocidades más adelante, paciencia*) mientras
que la carta de *Herida* en los C1s y C2s reduce tu velocidad en 2 o 3 unidades, respectivamente. Por otro lado, a las cartas que afectan al **ecosistema** las
llamaremos **factores abióticos**, en este caso porque no están relacionados con los seres que lo habitan sino por sus **condiciones meteorológicas**, que
condicionarán la **comida disponible** en cada ciclo. Para que podamos comprender el papel fundamental que desempeña la comida (*que podrán convertirse en unidades
de biomasa una vez la consuma*), vamos a ver paso a paso como se desarrolla un ciclo/partida:

1. Una persona que esté a cargo de gestionar el juego (*en nuestro caso, el profesor*), saca de una bolsa que contiene todos los **factores abióticos** una carta.
2. 
