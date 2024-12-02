# Stage 1: Build the Rust application
FROM rust:latest AS builder

WORKDIR /usr/src/app

RUN cargo install sqlx-cli --no-default-features --features postgres

# Cache dependencies
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release

# Copy the application source code and build it
COPY . .
RUN cargo build --release

# Stage 2: Create an image for running
FROM ubuntu:22.04 AS runtime

# Install runtime dependencies
RUN apt-get update && apt-get install -y libssl-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/target/release/typings_actix_postgres .

COPY --from=builder /usr/local/cargo/bin/sqlx /usr/local/bin/sqlx

COPY migrations ./migrations

# Set environment variables if needed
ENV RUST_BACKTRACE=1
ENV ROCKET_ENV=production

# Expose the application port
EXPOSE 8080

# Command to run the application
CMD ["./typings_actix_postgres"]
