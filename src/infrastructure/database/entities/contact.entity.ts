import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("contacts")
export class MacapaContactEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 200 })
  name: string;

  @Column({ name: "cell_phone", type: "varchar", length: 20 })
  cellPhone: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  anexo: string;
}
