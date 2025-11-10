import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../auth/entities/user.entity';
import { Camera } from '../cameras/entities/camera.entity';

export async function seedDatabase(dataSource: DataSource) {
  console.log('🌱 Seeding database...');

  // Create default admin user
  const userRepository = dataSource.getRepository(User);
  const existingAdmin = await userRepository.findOne({ where: { username: 'admin' } });
  
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    const admin = userRepository.create({
      username: 'admin',
      passwordHash,
      role: 'admin',
    });
    await userRepository.save(admin);
    console.log('✅ Created admin user (username: admin, password: admin123)');
  }

  // Create test camera
  const cameraRepository = dataSource.getRepository(Camera);
  const existingCamera = await cameraRepository.findOne({ where: { name: 'Thang may 1' } });
  
  if (!existingCamera) {
    const camera = cameraRepository.create({
      name: 'Thang may 1',
      rtspUrl: 'rtsp://172.16.40.73:554/cam/realmonitor?channel=1&subtype=0',
      username: 'admin',
      password: 'Xincamon@!',
      location: 'Building A - Floor 1',
      status: 'offline',
      isActive: true,
    });
    await cameraRepository.save(camera);
    console.log('✅ Created test camera: Thang may 1');
  }

  console.log('✅ Database seeding completed');
}

