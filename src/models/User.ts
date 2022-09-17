import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { BaseDateColumn } from './common/BaseDateColumn';

type UserRoleType = ['admin', 'member'];

@Entity('User')
class User extends BaseDateColumn {
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
