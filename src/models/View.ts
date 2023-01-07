import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class View {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  today!: number;

  @Column()
  total!: number;

  @Column({ type: 'simple-array' })
  ips!: string[];
}

export default View;
