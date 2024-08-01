const puppeteer = require('puppeteer');
const notifier = require('node-notifier');

// Configura las características deseadas del piso
const desiredFeatures = {
  location: 'Barcelona',
  priceMax: 500,
  roomsMin: 2
};

// URL de búsqueda en Idealista (ajusta los parámetros según sea necesario)
const searchURL = 'https://www.idealista.com/venta-viviendas/barcelona-barcelona/';

// Función para verificar si un piso cumple con las características deseadas
function checkFeatures(piso) {
  const locationMatches = piso.location.includes(desiredFeatures.location);
  const priceMatches = piso.price <= desiredFeatures.priceMax;
  const roomsMatches = piso.rooms >= desiredFeatures.roomsMin;
  return locationMatches && priceMatches && roomsMatches;
}

// Función para realizar la consulta y verificar los pisos
async function checkNewListings() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(searchURL, { waitUntil: 'networkidle2' });

  // Extraer la información de los pisos (esto puede variar según la estructura de la página)
  const pisos = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.item-info-container'));
    return items.map((item,i) => {
      const price = parseInt(item.querySelector('.item-price')?.innerText.replace(/[^0-9]/g, '') || 0);
      const location = item.querySelector('.item-location')?.innerText.trim() || '';
      const rooms = parseInt(item.querySelector('.item-rooms')?.innerText.replace(/[^0-9]/g, '') || 0);
      return { price, location, rooms };
    });
  });

  await browser.close();

  // Verificar si hay algún piso que cumpla con las características deseadas
  const matchingPisos = pisos.filter(checkFeatures);

  if (matchingPisos.length > 0) {
    notifier.notify({
      title: 'Nuevo piso encontrado',
      message: `Se encontraron ${matchingPisos.length} pisos que cumplen con tus características.`,
      sound: true
    });
    console.log(`Se encontraron ${matchingPisos.length} pisos que cumplen con tus características.`);
  } else {
    console.log('No se encontraron pisos que cumplan con tus características.');
  }
}

// Ejecutar la función cada 5 minutos
setInterval(checkNewListings, 300000);

// Ejecutar la función por primera vez inmediatamente
checkNewListings();
