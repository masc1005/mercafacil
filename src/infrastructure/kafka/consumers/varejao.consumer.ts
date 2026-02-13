import { kafka } from '../index'
import { VarejaoContactRepository } from '../../repositories/VarejaoContactRepository'
import { Contact } from '../../../domain/entities/Contact'

export async function startVarejaoConsumer(): Promise<void> {
  const consumer = kafka.consumer({ groupId: 'varejao-group' })

  await consumer.connect()
  await consumer.subscribe({ topic: 'varejao-contacts', fromBeginning: true })

  const repository = new VarejaoContactRepository()

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const contact: Omit<Contact, 'id'> = JSON.parse(message.value!.toString())
        console.log(`📥 [Varejao] Mensagem recebida:`, contact)

        await repository.create(contact)
        console.log(`✅ [Varejao] Contato salvo no MongoDB: ${contact.name}`)
      } catch (error) {
        console.error(`❌ [Varejao] Erro ao processar mensagem:`, error)
      }
    },
  })

  console.log('🎧 Varejao Consumer escutando tópico "varejao-contacts"')
}
