import { Column, Entity } from 'typeorm';

@Entity('View')
class View {
  @Column()
  today!: number;

  @Column()
  total!: number;

  @Column({ type: 'simple-array' })
  ips!: string[];
}

export default View;
