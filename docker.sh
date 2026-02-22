#!/bin/bash

# Scripts de ayuda para Docker Compose

case "$1" in
    "build")
        echo "🔨 Construyendo la aplicación Next.js..."
        docker-compose build mackyna-app
        ;;
    "dev")
        echo "🚀 Iniciando en modo desarrollo (solo app)..."
        docker-compose up mackyna-app
        ;;
    "prod")
        echo "🌟 Iniciando en modo producción (solo app)..."
        docker-compose up -d mackyna-app
        ;;
    "with-db")
        echo "🗄️ Iniciando con MongoDB dockerizado..."
        docker-compose --profile database up -d
        ;;
    "stop")
        echo "🛑 Deteniendo todos los contenedores..."
        docker-compose down
        ;;
    "logs")
        echo "📋 Mostrando logs de la aplicación..."
        docker-compose logs -f mackyna-app
        ;;
    "clean")
        echo "🧹 Limpiando contenedores y volúmenes..."
        docker-compose down -v
        docker system prune -f
        ;;
    "shell")
        echo "🐚 Accediendo al contenedor de la app..."
        docker-compose exec mackyna-app sh
        ;;
    *)
        echo "📖 Uso: ./docker.sh [comando]"
        echo ""
        echo "Comandos disponibles:"
        echo "  build     - Construir la imagen de la aplicación"
        echo "  dev       - Iniciar en desarrollo (solo app)"
        echo "  prod      - Iniciar en producción (solo app)"
        echo "  with-db   - Iniciar con MongoDB dockerizado"
        echo "  stop      - Detener todos los contenedores"
        echo "  logs      - Ver logs de la aplicación"
        echo "  clean     - Limpiar contenedores y volúmenes"
        echo "  shell     - Acceder al contenedor de la app"
        echo ""
        echo "Ejemplos:"
        echo "  ./docker.sh build"
        echo "  ./docker.sh prod"
        echo "  ./docker.sh with-db"
        ;;
esac