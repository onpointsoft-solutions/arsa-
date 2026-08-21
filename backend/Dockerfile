FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy lockfile and package manifest first (layer cache)
COPY package.json pnpm-lock.yaml ./
COPY .npmrc ./

# Install all dependencies (including tsx which runs the app)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p public/uploads

# Expose the port the app runs on
EXPOSE 5000

# Start with tsx (no compile step needed)
CMD ["pnpm", "start"]
