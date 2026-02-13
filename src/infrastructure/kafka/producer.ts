import { Producer } from 'kafkajs'
import { kafka } from './index'

export class KafkaProducerService {
  private producer: Producer
  private isConnected = false

  constructor() {
    this.producer = kafka.producer()
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.producer.connect()
      this.isConnected = true
      console.log('📤 Kafka Producer conectado')
    }
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect()
    this.isConnected = false
  }

  async send(topic: string, message: object): Promise<void> {
    await this.connect()
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    })
    console.log(`📨 Mensagem enviada para o tópico "${topic}"`)
  }
}

export const kafkaProducer = new KafkaProducerService()
