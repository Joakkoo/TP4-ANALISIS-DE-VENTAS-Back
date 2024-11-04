const pdf = require('pdf-parse');
const PDF = require('../models/pdfs');
const OpenAI = require('openai');  // Importa el paquete completo
const Venta = require('../models/sales');
const Recomendacion = require('../models/recommendation');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

exports.uploadAndRecommend = async (req, res) => {
    if (!req.files || !req.files.pdfFile) {
        return res.status(400).send('No se subió ningún archivo.');
    }

    const pdfFile = req.files.pdfFile;
    const dataBuffer = pdfFile.data;

    try {

        //PDF
        const nuevoPDF = new PDF({ nombre: pdfFile.name });
        await nuevoPDF.save();

        const data = await pdf(dataBuffer);
        const textoPDF = data.text;

        // Respuesta Ia
        const messages = [
            {
                role: "system",
                content:`Analiza el archivo PDF de historial de ventas proporcionado para ofrecer recomendaciones personalizadas sobre promociones, sugerencias de productos, y análisis de ventas.
                Debes interpretar la información del PDF para encontrar patrones de compra, identificar el producto más vendido, sugerir qué productos promocionar y recomendar ofertas que se alineen con las tendencias observadas.`,
            },
            {
                role: "user",
                content: `Este es un historial de ventas: ${textoPDF}. ¿Qué productos recomendarías como complementarios?`
            }
        ];

        // Recomendaciones
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: messages,
            max_tokens: 1000
        });
        console.log('Respuesta de OpenAI:', response.choices[0].message.content.trim());

        let nuevaRecomendacion; 

        if (response && response.choices && response.choices.length > 0) {
            // Guardado de recomendaciones en base de datos
            nuevaRecomendacion = new Recomendacion({
                pdfId: nuevoPDF._id,
                recomendaciones: response.choices[0].message.content.trim()
            });
            await nuevaRecomendacion.save();
        } else {
            console.error('Error en la respuesta de OpenAI:', response);
            return res.status(500).send('Error al obtener recomendaciones.');
        }

        // Relacionar recomendacion con PDF
        nuevoPDF.recomendaciones.push(nuevaRecomendacion._id);
        await nuevoPDF.save();

        // return de recomendaciones
        res.json({ recomendaciones: nuevaRecomendacion.recomendaciones });
    } catch (error) {
        console.error('Error procesando el PDF o generando recomendaciones:', error);
        res.status(500).send('Error al procesar el PDF o generar recomendaciones.');
    }
};
