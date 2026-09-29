// Función de servidor (Vercel). Recibe la foto, le pregunta a Claude y devuelve el veredicto.
// Necesita dos variables de entorno en Vercel: ANTHROPIC_API_KEY y APP_PASSWORD.

const PLAN = "\n## Desayuno y merienda\nSiempre: Infusión con leche descremada (200 ml). Té, mate o café. Con stevia o amargo.\nHidratos, elegir 1: Pan lactal integral = 1 feta (25 g); Galletas de arroz = 3 unidades; Tostadas secas = 3 unidades; Avena instantánea = 3 cucharadas soperas; Copos de maíz sin azúcar = 3 cucharadas soperas; Granola sin azúcar = 3 cucharadas; Rapiditas integrales = 2 unidades\nProteínas, elegir 1: Huevo = 1 huevo + 3 claras; Port Salut light o ricota magra = 3 fetas o 90 g; Yogur descremado o Kay = 200 g (Siempre natural, sin azúcar.); Atún al agua = 1 lata; Whey protein = 1 scoop\nFrutas, elegir 1: Manzana, naranja, pera o durazno = 1 unidad chica (100 g); Banana = ½ unidad; Mandarina o kiwi = 1 unidad; Frutillas = 1 taza; Ciruelas = 3 unidades; Damascos = 4 unidades; Ananá = 2 rodajas; Sandía o melón = 1 rodaja; Jugo de naranja = ½ vaso; Ensalada de frutas = ½ taza\n\n## Almuerzo\nSiempre: Bebida (Mejor agua). También gaseosa light o agua saborizada sin azúcar.\nHidratos (solo días de entrenamiento, 4 por semana), elegir 1: Fideos integrales = 100 g (½ taza cocida); Papa, batata o boniato = 120 g (1 mediana); Quinoa o cuscús = 100 g (4 cucharadas soperas); Pan integral = 1 feta; Tarta = 1 porción; Rapidita integral = 1 unidad\nProteínas, elegir 1: Carne magra = 230 g en cocido (Lomo, cuadril, peceto, nalga, cuadrada o bola de lomo.); Pollo o pavita sin piel = 230 g en cocido (Mejor pechuga.); Cerdo = 230 g en cocido (Carré o solomillo.); Pescado = 230 g en cocido (Atún al agua, brótola, merluza, bacalao. Salmón, menos seguido.); Huevo = 1 huevo + 4 claras (En omelette, tortilla o revuelto.)\nVegetales, elegir 1: Verduras crudas = 2 tazas (Acelga, ají, berenjena, brócoli, coliflor, espinaca, espárrago, hinojo, lechuga, pepino, repollo, rúcula, tomate, zapallito, alcaucil, cebolla, cebolla de verdeo, brotes de soja, puerro, remolacha, zanahoria.); Verduras cocidas = 1 taza o 200 g (Acelga, ají, berenjena, brócoli, coliflor, espinaca, espárrago, hinojo, lechuga, pepino, repollo, rúcula, tomate, zapallito, alcaucil, cebolla, cebolla de verdeo, brotes de soja, puerro, remolacha, zanahoria. Papa y batata no cuentan acá.)\nGrasas, elegir 1: Aceite = 1 cucharadita (Medido, nunca chorrito de la botella.); Almendras = 5 unidades; Maníes = 10 unidades; Aceitunas = 10 unidades; Palta = 1 cucharada; Castañas de cajú = 5 unidades; Semillas = 2 cucharadas\n\n## Cena\nSiempre: Bebida (Mejor agua). También gaseosa light o agua saborizada sin azúcar.\nHidratos: NO. Sin arroz, fideos, papa, batata, choclo ni pan.\nProteínas, elegir 1: Carne magra = 230 g en cocido (Lomo, cuadril, peceto, nalga, cuadrada o bola de lomo.); Pollo o pavita sin piel = 230 g en cocido (Mejor pechuga.); Cerdo = 230 g en cocido (Carré o solomillo.); Pescado = 230 g en cocido (Atún al agua, brótola, merluza, bacalao. Salmón, menos seguido.); Huevo = 1 huevo + 4 claras (En omelette, tortilla o revuelto.)\nVegetales, elegir 1: Verduras crudas = 2 tazas (Acelga, ají, berenjena, brócoli, coliflor, espinaca, espárrago, hinojo, lechuga, pepino, repollo, rúcula, tomate, zapallito, alcaucil, cebolla, cebolla de verdeo, brotes de soja, puerro, remolacha, zanahoria.); Verduras cocidas = 1 taza o 200 g (Acelga, ají, berenjena, brócoli, coliflor, espinaca, espárrago, hinojo, lechuga, pepino, repollo, rúcula, tomate, zapallito, alcaucil, cebolla, cebolla de verdeo, brotes de soja, puerro, remolacha, zanahoria. Papa y batata no cuentan acá.)\nGrasas, elegir 1: Aceite = 1 cucharadita (Medido, nunca chorrito de la botella.); Almendras = 5 unidades; Maníes = 10 unidades; Aceitunas = 10 unidades; Palta = 1 cucharada; Castañas de cajú = 5 unidades; Semillas = 2 cucharadas\n";

const REGLAS = `Sos un asistente que ayuda a Matías a seguir el plan de alimentación que le dio su nutricionista (objetivo: bajar grasa corporal). No sos nutricionista: usá solo este plan y no inventes reglas nuevas.
Reglas generales del plan: pesar los alimentos en cocido; papa, batata y choclo son hidratos, no verduras; aceite siempre medido; proteína en todas las comidas; evitar frituras y ultraprocesados. Colación media mañana: agua. Colación media tarde: 1 scoop de whey con agua.
PLAN:${PLAN}
Vas a recibir la foto de un producto (etiqueta o paquete). Leé la información nutricional y decidí si entra en el plan, en qué grupo y comida, y cuánto comer según la porción del plan (convertí a unidades del producto: rebanadas, galletas, cucharadas, gramos). Si la foto no se lee bien, decilo en "motivo".
Respondé SOLO con un objeto JSON, sin texto antes ni después:
{"veredicto":"Sí"|"Con cuidado"|"No","producto":"nombre corto","grupo":"Hidratos|Proteínas|Frutas|Vegetales|Grasas|Ninguno","comidas":"en qué comidas va","porcion":"cuánto comer, concreto","motivo":"1 o 2 frases simples","alternativa":"si es No o Con cuidado, qué elegir del plan; si no, vacío"}
Español rioplatense, frases cortas y claras para alguien que no sabe de nutrición.`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Usá POST." });
  if (!process.env.APP_PASSWORD || req.headers["x-clave"] !== process.env.APP_PASSWORD)
    return res.status(401).json({ error: "Contraseña incorrecta." });

  const { imagen, pregunta } = req.body || {};
  if (!imagen || typeof imagen !== "string") return res.status(400).json({ error: "Falta la foto." });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5-5",
        max_tokens: 800,
        system: REGLAS,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imagen } },
            { type: "text", text: pregunta ? `Pregunta de Matías: ${String(pregunta).slice(0, 500)}` : "¿Este producto entra en mi plan?" },
          ],
        }],
      }),
    });
    const d = await r.json();
    if (!r.ok) {
      console.error(d);
      return res.status(502).json({ error: "Claude no pudo responder (" + (d?.error?.message || r.status) + ")." });
    }
    const texto = (d.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    const m = texto.match(/\{[\s\S]*\}/);
    if (!m) return res.status(502).json({ error: "La respuesta salió mal armada. Probá de nuevo." });
    return res.status(200).json(JSON.parse(m[0]));
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Algo falló en el servidor. Probá de nuevo." });
  }
}
