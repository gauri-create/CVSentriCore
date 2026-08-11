FROM python:3.11

WORKDIR /app

# Install system dependencies for OpenCV and face_recognition
# These are required for dlib/face-recognition compilation
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    git \
    python3-dev \
    libopenblas-dev \
    liblapack-dev \
    libatlas-base-dev \
    gfortran \
    libx11-dev \
    libx11-6 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgtk-3-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Upgrade pip and setuptools to latest versions
RUN pip install --upgrade pip setuptools wheel

# Copy requirements
COPY requirements.txt .

# Pre-install numpy separately (helps with dlib compilation)
RUN pip install --no-cache-dir numpy==1.26.0

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:5001')" || exit 1

# Run with gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5001", "--timeout", "120", "app:app"]
