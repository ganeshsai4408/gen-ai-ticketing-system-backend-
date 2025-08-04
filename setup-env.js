import fs from 'fs';
import path from 'path';

const envContent = `PORT=3000
MONGO_URI=mongodb://localhost:27017/ai-ticket-system
JWT_SECRET=LPT8fVflkij6dPZy
VITE_SERVER_URL=http://localhost:3000/api`;

const envPath = path.join(process.cwd(), '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment file created successfully!');
  console.log('📁 File location:', envPath);
  console.log('\n🔧 Please make sure to:');
  console.log('1. Start MongoDB on your system');
  console.log('2. Install dependencies: npm install');
  console.log('3. Start the server: npm start');
} catch (error) {
  console.error('❌ Error creating environment file:', error.message);
} 