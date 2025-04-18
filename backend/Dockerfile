# backend/Dockerfile
FROM python:3.9-slim-buster

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

# Install OpenGL and GTK-related libraries
RUN apt-get update && \
    apt-get install -y libgl1 libgtk-3-0 libgconf-2-4


COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]