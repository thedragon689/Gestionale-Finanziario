# Dockerfile per Core Banking Service
FROM node:18-alpine

# Imposta directory di lavoro
WORKDIR /app

# Copia file di configurazione
COPY package*.json ./

# Installa dipendenze
RUN npm ci --only=production

# Copia codice sorgente
COPY . .

# Crea directory per i log
RUN mkdir -p logs

# Esponi porta
EXPOSE 3001

# Variabili d'ambiente di default
ENV NODE_ENV=production
ENV CORE_BANKING_PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Avvia applicazione
CMD ["node", "src/server.js"]



