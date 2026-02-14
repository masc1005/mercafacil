import { Contact } from "../../domain/entities/Contact";

export class AnexoGenerator {
  static generateMongoQuery(contact: Contact, collectionName: string = 'contacts'): string {
    const nome = this.escapeString(contact.name);
    const telefone = this.formatPhoneForMongo(contact.cellPhone);
    
    return `db.${collectionName}.insert({nome: '${nome}', telefone: '${telefone}'})`;
  }

  static generateSqlQuery(contact: Contact, tableName: string = 'contacts'): string {
    const nome = this.escapeString(contact.name);
    const telefone = this.formatPhoneForSql(contact.cellPhone);
    
    return `INSERT INTO ${tableName} (nome, telefone) VALUES ('${nome}', '${telefone}');`;
  }

  static generateAnexo(contact: Contact, dbType: 'mongo' | 'sql', targetName?: string): string {
    if (dbType === 'mongo') {
      return this.generateMongoQuery(contact, targetName || 'contacts');
    } else {
      return this.generateSqlQuery(contact, targetName || 'contacts');
    }
  }

  static parseAnexo(anexoContent: string): { type: 'mongo' | 'sql'; target: string; data: any } | null {
    if (!anexoContent) return null;

    const mongoMatch = anexoContent.match(/db\.(\w+)\.insert\(\{([^}]+)\}\)/);
    if (mongoMatch) {
      const target = mongoMatch[1];
      const dataStr = mongoMatch[2];
      
      try {
        const nomeMatch = dataStr.match(/nome:\s*'([^']+)'/);
        const telefoneMatch = dataStr.match(/telefone:\s*'([^']+)'/);
        
        return {
          type: 'mongo',
          target,
          data: {
            nome: nomeMatch?.[1],
            telefone: telefoneMatch?.[1]
          }
        };
      } catch (error) {
        return null;
      }
    }

    const sqlMatch = anexoContent.match(/INSERT INTO (\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\);?/);
    if (sqlMatch) {
      const target = sqlMatch[1];
      const columns = sqlMatch[2].split(',').map(col => col.trim());
      const valuesStr = sqlMatch[3];
      
      try {
        const nomeMatch = valuesStr.match(/'([^']+)'/);
        const telefoneMatch = valuesStr.match(/'(\d+)'/);
        
        return {
          type: 'sql',
          target,
          data: {
            nome: nomeMatch?.[1],
            telefone: telefoneMatch?.[1]
          }
        };
      } catch (error) {
        return null;
      }
    }

    return null;
  }

  static validateAnexo(anexoContent: string): boolean {
    return this.parseAnexo(anexoContent) !== null;
  }

  private static escapeString(str: string): string {
    return str.replace(/'/g, "''");
  }

  private static formatPhoneForMongo(phone: string): string {
    return phone;
  }

  private static formatPhoneForSql(phone: string): string {
    return phone;
  }
}
