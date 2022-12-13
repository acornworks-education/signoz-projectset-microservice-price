'use strict'
const process = require('process');
const opentelemetry = require('@opentelemetry/sdk-node');
const {
    BasicTracerProvider,
    SimpleSpanProcessor
} = require('@opentelemetry/tracing');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { WinstonInstrumentation } = require('@opentelemetry/instrumentation-winston');
const { logger } = require('./processors/logger');

require('dotenv').config();   
const traceExporter = new OTLPTraceExporter({});

const provider = new BasicTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME || 'price'
    })
});

provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
provider.register();

const sdk = new opentelemetry.NodeSDK({
   traceExporter: traceExporter,
   instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new WinstonInstrumentation()
   ]
});

sdk.start()
    .then(() => logger.info('Tracing initialized'))
    .catch((error) => logger.error('Error initializing tracing', error));

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
    sdk.shutdown()
        .then(() => logger.info('Tracing terminated'))
        .catch((error) => logger.error('Error terminating tracing', error))
        .finally(() => process.exit(0));
 });
