# Default recipe: perform all checks and build
default: build

# Start the development server (installs dependencies if missing)
dev: _install
    cd frontend && npm run dev

# Build for production (runs checks first)
build: _install check
    cd frontend && npm run build-only

# Run all quality checks
check: format lint type-check

# Individual tasks
format:
    cd frontend && npm run format

lint:
    cd frontend && npm run lint

type-check:
    cd frontend && npm run type-check

preview: build
    cd frontend && npm run preview

# Internal helper to ensure node_modules exists
_install:
    @if [ ! -d "frontend/node_modules" ]; then \
        echo "node_modules not found. Installing..."; \
        cd frontend && npm install; \
    fi
