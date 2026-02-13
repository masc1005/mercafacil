import { Kafka, logLevel } from 'kafkajs'

const kafka = new Kafka({
  clientId: 'mercafacil',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  retry: {
    initialRetryTime: 1000,
    retries: 20,
    maxRetryTime: 30000,
  },
  logLevel: logLevel.ERROR,
})

export { kafka }
