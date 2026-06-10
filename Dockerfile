FROM nginx:alpine
# Copia todos los archivos del frontend
COPY . /usr/share/nginx/html
# Usa nuestra configuración personalizada (proxy a backend + rutas)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
