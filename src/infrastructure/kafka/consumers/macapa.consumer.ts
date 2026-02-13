import { kafka } from '../index'
import { MacapaContactRepository } from '../../repositories/MacapaContactRepository'
import { AppDataSource } from '../../database/mysql'
import { MacapaContactEntity } from '../../database/entities'
import { Contact } from '../../../domain/entities/Contact'

export async function startMacapaConsumer(): Promise<void> {
  const consumer = kafka.consumer({ groupId: 'macapa-group' })

  await consumer.connect()
  await consumer.subscribe({ topic: 'macapa-contacts', fromBeginning: true })

  const repository = new MacapaContactRepository(
    AppDataSource.getRepository(MacapaContactEntity)
  )

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const contact: Omit<Contact, 'id'> = JSON.parse(message.value!.toString())
        console.log(`📥 [Macapa] Mensagem recebida:`, contact)

        await repository.create(contact)
        console.log(`✅ [Macapa] Contato salvo no MySQL: ${contact.name}`)
      } catch (error) {
        console.error(`❌ [Macapa] Erro ao processar mensagem:`, error)
      }
    },
  })

  console.log('🎧 Macapa Consumer escutando tópico "macapa-contacts"')
}
