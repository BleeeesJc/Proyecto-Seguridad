const cron = require('node-cron');
const { enviarRecordatorios } = require('./api/reservas/reservas.controller'); // Importa tu función

console.log("cron cargado para mandar mensajes automáticos")

// Configurar un cron job que se ejecute cada hora
cron.schedule('0 * * * *', async () => {
    console.log('Iniciando envío de recordatorios...');
    await enviarRecordatorios();
    console.log('Recordatorios enviados.');
});

module.exports = cron;
