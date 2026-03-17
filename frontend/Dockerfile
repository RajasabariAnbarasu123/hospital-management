# -------- Build stage --------
FROM node:18-alpine as builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# -------- Production stage --------
FROM node:18-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install serve locally instead of globally
COPY --from=builder /app/package*.json ./
RUN npm install serve

COPY --from=builder /app/build ./build

# Change ownership
RUN chown -R appuser:appgroup /app

# Switch user
USER appuser

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npx", "serve", "-s", "build", "-l", "3000"]
