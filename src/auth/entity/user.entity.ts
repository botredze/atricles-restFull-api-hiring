import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { UserProfile } from './user.profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => UserProfile, { cascade: true })
  profile?: UserProfile;
}
