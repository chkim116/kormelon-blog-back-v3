import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { DateColumn } from './common/DateColumn';

type UserRoleType = ['admin', 'member'];

@Entity('User')
class User extends DateColumn {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  profileImage!: string;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'member'],
    default: 'member',
  })
  role!: UserRoleType;
}

export default User;
