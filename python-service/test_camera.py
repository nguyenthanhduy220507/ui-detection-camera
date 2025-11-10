"""
Test script to verify camera connection
"""
import asyncio
import sys
from camera_manager import CameraManager

async def test_camera():
    """Test connection to the camera"""
    camera_config = {
        "name": "Thang may 1",
        "rtsp_url": "rtsp://172.16.40.73:554/cam/realmonitor?channel=1&subtype=0",
        "username": "admin",
        "password": "Xincamon@!"
    }
    
    print("🎥 Testing camera connection...")
    print(f"Camera: {camera_config['name']}")
    print(f"URL: {camera_config['rtsp_url']}")
    print("-" * 50)
    
    manager = CameraManager()
    
    # Test connection
    result = await manager.test_connection(
        camera_config["rtsp_url"],
        camera_config["username"],
        camera_config["password"]
    )
    
    print(f"\nStatus: {result['status']}")
    print(f"Message: {result['message']}")
    
    if result['status'] == 'success':
        print("✅ Camera connection successful!")
        if result.get('frame_captured'):
            print("✅ Frame captured successfully!")
        else:
            print("⚠️ Connected but no frame captured")
    else:
        print("❌ Camera connection failed!")
        sys.exit(1)
    
    # Try adding camera and getting a frame
    try:
        print("\n📹 Adding camera to manager...")
        camera_id = await manager.add_camera(
            camera_config["name"],
            camera_config["rtsp_url"],
            camera_config["username"],
            camera_config["password"]
        )
        print(f"✅ Camera added with ID: {camera_id}")
        
        print("\n📸 Getting a frame...")
        frame_data = await manager.get_frame(camera_id)
        if frame_data:
            print(f"✅ Frame received:")
            print(f"   - Camera ID: {frame_data['camera_id']}")
            print(f"   - Timestamp: {frame_data['timestamp']}")
            print(f"   - Size: {frame_data['width']}x{frame_data['height']}")
            print(f"   - Frame data length: {len(frame_data['frame'])} bytes")
        else:
            print("❌ No frame received")
        
        # Cleanup
        await manager.remove_camera(camera_id)
        print("\n✅ Test completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Error during test: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(test_camera())

