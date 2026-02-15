# Default recipe: perform all checks and build
default: build

# Start the development server (installs dependencies if missing)
dev: _install
    npm run dev

# Build for production (runs checks first)
build: _install check
    npm run build-only

# Run all quality checks
check: format lint type-check

# Individual tasks
format:
    npm run format

lint:
    npm run lint

type-check:
    npm run type-check

preview: build
    npm run preview

# Internal helper to ensure node_modules exists
_install:
    @if [ ! -d "node_modules" ]; then \
        echo "node_modules not found. Installing..."; \
        npm install; \
    fi
