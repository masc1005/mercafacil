// Script para inicializar o banco Varejão no MongoDB
db = db.getSiblingDB('varejao');
db.createCollection('contacts');

console.log('✅ Collection criada: contacts');