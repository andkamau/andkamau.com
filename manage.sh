#!/bin/bash

# Port to serve on
PORT=8000

function serve() {
    echo "Starting local server at http://127.0.0.1:$PORT"
    if command -v python3 &>/dev/null; then
        python3 -m http.server "$PORT" --bind 127.0.0.1
    else
        echo "Error: Python not found. Please install Python to use the server."
        exit 1
    fi
}

function help() {
    echo "Usage: ./manage.sh [command]"
    echo ""
    echo "Commands:"
    echo "  serve   Start a local development server"
    echo "  help    Show this help message"
}

# Main execution
case "$1" in
    serve)
        serve
        ;;
    *)
        help
        ;;
esac
