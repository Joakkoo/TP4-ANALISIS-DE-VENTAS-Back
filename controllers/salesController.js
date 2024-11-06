const pdf = require('pdf-parse');
const PDF = require('../models/pdfs');
const OpenAI = require('openai');  // Importa el paquete completo
const Recomendacion = require('../models/recommendation');
const User = require('../models/user');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


exports.getUserPdfs = async (req, res) => {
    try {

        const user = await User.findById(req.userId)
            .populate({
                path: 'pdfs',  // Recupera los PDFs
                populate: {
                    path: 'recomendaciones',  
                    model: 'Recomendacion'    
                }
            });

        if (!user || !user.pdfs) {
            return res.status(404).json({ message: 'No se encontraron PDFs para este usuario' });
        }

        // Mapea los PDFs con sus recomendaciones
        const pdfsWithRecommendations = user.pdfs.map(pdf => ({
            id: pdf._id,
            nombre: pdf.nombre,
            recomendaciones: pdf.recomendaciones.map(recommendation => recommendation.recomendaciones) // Extrae solo el texto de las recomendaciones
        }));

        res.json({ pdfs: pdfsWithRecommendations });

    } catch (error) {
        console.error('Error al obtener PDFs del usuario:', error);
        res.status(500).json({ message: 'Error al obtener PDFs del usuario' });
    }
};




exports.uploadAndRecommend = async (req, res) => {
    if (!req.files || !req.files.pdfFile) {
        return res.status(400).send('No se subió ningún archivo.');
    }

    const pdfFile = req.files.pdfFile;
    const dataBuffer = pdfFile.data;

    try {
        // Obtén el usuario actual
        const user = await User.findById(req.userId);

        // Crear y guardar el PDF
        const nuevoPDF = new PDF({ nombre: pdfFile.name });
        await nuevoPDF.save();


        const data = await pdf(dataBuffer);
        const textoPDF = data.text;

        const messages = [
            {
                role: "system",
                content: `Analiza el historial o lista de ventas proporcionado para ofrecer recomendaciones personalizadas sobre promociones, sugerencias de productos, y análisis de ventas.
                Debes interpretar la información del PDF para encontrar patrones de compra, identificar el producto más vendido, sugerir qué productos promocionar y recomendar ofertas que se alineen con las tendencias observadas.`
            },
            {
                role: "user",
                content: `Este es un historial de ventas: ${textoPDF}. ¿Qué productos recomendarías como complementarios?`
            },
            {
                role: "user",
                content: `Con base en el historial de ventas, proporciona ideas de publicaciones para redes sociales que puedan captar la atención de nuestros clientes y destacar los productos recomendados.`
            }
        ];

        // Obtener recomendaciones
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: messages,
            max_tokens: 1000
        });


        let nuevaRecomendacion; 

        if (response && response.choices && response.choices.length > 0) {
            nuevaRecomendacion = new Recomendacion({
                pdfId: nuevoPDF._id,
                recomendaciones: response.choices[0].message.content.trim()
            });
            await nuevaRecomendacion.save();
        } else {
            console.error('Error en la respuesta de OpenAI:', response);
            return res.status(500).send('Error al obtener recomendaciones.');
        }

        // Relacion de pdf con recomendacion
        nuevoPDF.recomendaciones.push(nuevaRecomendacion._id);
        user.pdfs.push(nuevoPDF._id);
        
        await nuevoPDF.save();
        await user.save();

        res.json({ recomendaciones: nuevaRecomendacion.recomendaciones });
    } catch (error) {
        console.error('Error procesando el PDF o generando recomendaciones:', error);
        res.status(500).send('Error al procesar el PDF o generar recomendaciones.');
    }
};
