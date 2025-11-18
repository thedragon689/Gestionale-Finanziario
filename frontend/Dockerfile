# Dockerfile per Frontend React
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copia file di configurazione
COPY package*.json ./

# Installa dipendenze
RUN npm ci

# Copia codice sorgente
COPY . .

# Variabili d'ambiente per build (default per sviluppo)
ARG REACT_APP_API_URL=http://localhost:3001
ARG REACT_APP_CORE_BANKING_URL=http://localhost:3001
ARG REACT_APP_CRYPTO_URL=http://localhost:3002
ARG REACT_APP_ENVIRONMENT=production

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_CORE_BANKING_URL=$REACT_APP_CORE_BANKING_URL
ENV REACT_APP_CRYPTO_URL=$REACT_APP_CRYPTO_URL
ENV REACT_APP_ENVIRONMENT=$REACT_APP_ENVIRONMENT

# Build applicazione
RUN npm run build

# Production stage
FROM nginx:alpine

# Copia build da builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copia configurazione nginx personalizzata (opzionale)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Esponi porta
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Avvia nginx
CMD ["nginx", "-g", "daemon off;"]

