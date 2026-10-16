FROM public.ecr.aws/docker/library/python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src ./src
COPY data ./data
COPY docs ./docs
COPY scripts ./scripts
COPY README.md technical_report.md Makefile ./
RUN mkdir -p /app/runtime
ENV PYTHONPATH=/app/src
EXPOSE 8000
CMD ["sh","-c","uvicorn mirror_ai.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
