import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../auth/entities/user.entity';
import { Camera } from '../cameras/entities/camera.entity';
import { CameraGroup } from '../cameras/entities/camera-group.entity';

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

  // Create camera groups
  const groupRepository = dataSource.getRepository(CameraGroup);
  const cameraRepository = dataSource.getRepository(Camera);

  // Create root group: Bạch Đằng
  let bachDangGroup = await groupRepository.findOne({ where: { name: 'Bạch Đằng', parentId: null } });
  if (!bachDangGroup) {
    bachDangGroup = groupRepository.create({
      name: 'Bạch Đằng',
      description: 'Root folder for all cameras',
      orderIndex: 0,
    });
    bachDangGroup = await groupRepository.save(bachDangGroup);
    console.log('✅ Created root group: Bạch Đằng');
  }

  // Create floor groups
  const floors = [
    { name: 'Tầng 1', order: 1 },
    { name: 'Tầng 2', order: 2 },
    { name: 'Tầng 3', order: 3 },
    { name: 'Tầng 4', order: 4 },
    { name: 'Tầng 7', order: 7 },
    { name: 'Tầng 8', order: 8 },
    { name: 'Tầng 9', order: 9 },
    { name: 'Tầng 10', order: 10 },
    { name: 'Thang máy', order: 11 },
    { name: 'Sảnh & Khác', order: 12 },
  ];

  const floorGroups: { [key: string]: CameraGroup } = {};

  for (const floor of floors) {
    let group = await groupRepository.findOne({ 
      where: { name: floor.name, parentId: bachDangGroup.id } 
    });
    
    if (!group) {
      group = groupRepository.create({
        name: floor.name,
        parentId: bachDangGroup.id,
        orderIndex: floor.order,
      });
      group = await groupRepository.save(group);
      console.log(`✅ Created floor group: ${floor.name}`);
    }
    
    floorGroups[floor.name] = group;
  }
  
  // Camera data with floor assignments
  const cameras = [
    // Tầng 1
    { name: "Kho để đồ (1.13)", rtspUrl: "rtsp://172.16.40.185:554/Streaming/Channels/101", floor: "Tầng 1", order: 1 },
    
    // Tầng 2
    { name: "Kho (2.1)", rtspUrl: "rtsp://172.16.40.121:554/Streaming/Channels/101", floor: "Tầng 2", order: 1 },
    { name: "Thang máy (2.2)", rtspUrl: "rtsp://172.16.40.122:554/Streaming/Channels/101", floor: "Tầng 2", order: 2 },
    { name: "Thoát hiểm 1 (2.3)", rtspUrl: "rtsp://172.16.40.123:554/Streaming/Channels/101", floor: "Tầng 2", order: 3 },
    { name: "Thoát hiểm 2 (2.4)", rtspUrl: "rtsp://172.16.40.124:554/Streaming/Channels/101", floor: "Tầng 2", order: 4 },
    
    // Tầng 3
    { name: "Kho (3.1)", rtspUrl: "rtsp://172.16.40.131:554/Streaming/Channels/101", floor: "Tầng 3", order: 1 },
    { name: "Thang máy (3.2)", rtspUrl: "rtsp://172.16.40.132:554/Streaming/Channels/101", floor: "Tầng 3", order: 2 },
    { name: "Thoát hiểm 1 (3.3)", rtspUrl: "rtsp://172.16.40.133:554/Streaming/Channels/101", floor: "Tầng 3", order: 3 },
    { name: "Thoát hiểm 2 (3.4)", rtspUrl: "rtsp://172.16.40.134:554/Streaming/Channels/101", floor: "Tầng 3", order: 4 },
    
    // Tầng 4
    { name: "Kho (4.1)", rtspUrl: "rtsp://172.16.40.141:554/Streaming/Channels/101", floor: "Tầng 4", order: 1 },
    { name: "Thang máy (4.2)", rtspUrl: "rtsp://172.16.40.142:554/Streaming/Channels/101", floor: "Tầng 4", order: 2 },
    { name: "Thoát hiểm 1 (4.3)", rtspUrl: "rtsp://172.16.40.143:554/Streaming/Channels/101", floor: "Tầng 4", order: 3 },
    { name: "Thoát hiểm 2 (4.4)", rtspUrl: "rtsp://172.16.40.144:554/Streaming/Channels/101", floor: "Tầng 4", order: 4 },
    
    // Tầng 7
    { name: "Kho để cây (7.1)", rtspUrl: "rtsp://172.16.40.171:554/Streaming/Channels/101", floor: "Tầng 7", order: 1 },
    { name: "Chờ Thang máy (7.2)", rtspUrl: "rtsp://172.16.40.172:554/Streaming/Channels/101", floor: "Tầng 7", order: 2 },
    { name: "Thang bộ (7.3)", rtspUrl: "rtsp://172.16.40.173:554/Streaming/Channels/101", floor: "Tầng 7", order: 3 },
    { name: "Thoát hiểm (7.4)", rtspUrl: "rtsp://172.16.40.174:554/Streaming/Channels/101", floor: "Tầng 7", order: 4 },
    { name: "Phòng họp (7.6)", rtspUrl: "rtsp://172.16.40.176:554/Streaming/Channels/101", floor: "Tầng 7", order: 5 },
    { name: "Văn phòng 1 (7.7)", rtspUrl: "rtsp://172.16.40.177:554/Streaming/Channels/101", floor: "Tầng 7", order: 6 },
    { name: "Văn phòng 2 (7.8)", rtspUrl: "rtsp://172.16.40.178:554/Streaming/Channels/101", floor: "Tầng 7", order: 7 },
    
    // Tầng 8
    { name: "Unconnect (8.1)", rtspUrl: "rtsp://172.16.40.169:554/Streaming/Channels/101", floor: "Tầng 8", order: 1 },
    { name: "Unconnect (8.2)", rtspUrl: "rtsp://172.16.40.158:554/Streaming/Channels/101", floor: "Tầng 8", order: 2 },
    
    // Tầng 9
    { name: "Unconnect (9.1)", rtspUrl: "rtsp://172.16.40.159:554/Streaming/Channels/101", floor: "Tầng 9", order: 1 },
    { name: "Unconnect (9.2)", rtspUrl: "rtsp://172.16.40.157:554/Streaming/Channels/101", floor: "Tầng 9", order: 2 },
    
    // Tầng 10
    { name: "Sân thượng 1 (10.1)", rtspUrl: "rtsp://172.16.40.201:554/Streaming/Channels/101", floor: "Tầng 10", order: 1 },
    { name: "Unconnect (10.2)", rtspUrl: "rtsp://172.16.40.202:554/Streaming/Channels/101", floor: "Tầng 10", order: 2 },
    { name: "Sân thượng 3 (10.3)", rtspUrl: "rtsp://172.16.40.203:554/Streaming/Channels/101", floor: "Tầng 10", order: 3 },
    { name: "Sân thượng 4 (10.4)", rtspUrl: "rtsp://172.16.40.204:554/Streaming/Channels/101", floor: "Tầng 10", order: 4 },
    { name: "Sân thượng 5 (10.5)", rtspUrl: "rtsp://172.16.40.205:554/Streaming/Channels/101", floor: "Tầng 10", order: 5 },
    { name: "Sân thượng 6 (10.6)", rtspUrl: "rtsp://172.16.40.206:554/Streaming/Channels/101", floor: "Tầng 10", order: 6 },
    
    // Thang máy
    { name: "Thang máy 1", rtspUrl: "rtsp://172.16.40.73:554/cam/realmonitor?channel=1&subtype=0", floor: "Thang máy", order: 1 },
    { name: "Thang máy 2", rtspUrl: "rtsp://172.16.40.160:554/cam/realmonitor?channel=1&subtype=0", floor: "Thang máy", order: 2 },
    
    // Sảnh & Khác
    { name: "Sảnh trước nhà", rtspUrl: "rtsp://172.16.40.110:554/Streaming/Channels/101", floor: "Sảnh & Khác", order: 1 },
    { name: "IPCamera 27", rtspUrl: "rtsp://172.16.40.60:554/Streaming/Channels/101", floor: "Sảnh & Khác", order: 2 },
    { name: "IPCamera 28", rtspUrl: "rtsp://172.16.40.167:554/Streaming/Channels/101", floor: "Sảnh & Khác", order: 3 },
  ];

  let createdCount = 0;
  let skippedCount = 0;

  for (const cameraData of cameras) {
    const existing = await cameraRepository.findOne({ where: { name: cameraData.name } });
    
    if (!existing) {
      const floorGroup = floorGroups[cameraData.floor];
      
      const camera = cameraRepository.create({
        name: cameraData.name,
        rtspUrl: cameraData.rtspUrl,
        username: 'admin',
        password: 'Xincamon@!',
        status: 'offline',
        isActive: true,
        groupId: floorGroup?.id,
        orderIndex: cameraData.order,
      });
      await cameraRepository.save(camera);
      createdCount++;
      console.log(`✅ Created: ${cameraData.floor} / ${cameraData.name}`);
    } else {
      skippedCount++;
    }
  }

  console.log(`✅ Database seeding completed:`);
  console.log(`   - Groups: ${floors.length + 1} (1 root + ${floors.length} floors)`);
  console.log(`   - Cameras: ${createdCount} created, ${skippedCount} skipped`);
}

