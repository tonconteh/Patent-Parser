const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const envFile = path.join(__dirname, '.env');
const envTemplate = 'GEMINI_API_KEY=<ВАШ_API_КЛЮЧ>';

function setup() {
  // 1. Создать папку /data, если ее нет
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
    console.log('✅ Папка "data" успешно создана.');
  } else {
    console.log('ℹ️ Папка "data" уже существует.');
  }

  // 2. Создать файл .env, если его нет
  if (!fs.existsSync(envFile)) {
    fs.writeFileSync(envFile, envTemplate);
    console.log('✅ Файл ".env" успешно создан. Не забудьте добавить в него ваш GEMINI_API_KEY.');
  } else {
    console.log('ℹ️ Файл ".env" уже существует.');
  }
  
  console.log('\n🎉 Настройка завершена! Теперь вы можете запустить проект.');
}

setup();
